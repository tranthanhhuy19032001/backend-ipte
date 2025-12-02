import { GoogleGenerativeAI } from "@google/generative-ai";
import { SeoEvaluationInput } from "@dto/SeoEvaluationInput";

const apiKey = process.env.GEMINI_API_KEY!;
const modelName = process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash";

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

export interface SeoEvaluationResult {
    score: number; // 0–100
    issues: string[]; // list of problems
    suggestions: string[]; // concrete improvement tips
    overallComment: string; // short summary
}

export async function evaluateSeo(data: SeoEvaluationInput): Promise<SeoEvaluationResult> {
    const {
        title,
        slug,
        description,
        content,
        metaTitle,
        metaDescription,
        keywords = [],
        audience = [],
        benefits,
        schemaEnabled,
        schemaMode,
        schemaData,
        duration,
        startDate,
        endDate,
        tuition,
    } = data;

    const prompt = `
You are an expert SEO content auditor for an English language center website.

You receive a JSON object describing a article (course or others).
Your job: 
1) Evaluate its SEO quality on a 0–100 scale.
2) List specific SEO issues.
3) Give concrete suggestions to improve SEO.
4) Return the result ONLY as a valid JSON object with this exact TypeScript-like shape:

{
  "score": number,                 // 0-100 integer
  "issues": string[],              // each item is <= 200 chars
  "suggestions": string[],         // each item is <= 200 chars, actionable
  "overallComment": string         // 1-3 sentences
}

Scoring criteria (0–100):
- Title & meta title: keyword usage, length, clarity, enticing.
- Meta description: keyword usage, length (120–160 chars), click-worthy.
- Slug: readable, uses keywords, hyphenated.
- Headings & content (HTML in "content"): keyword placement, readability, internal structure (H1–H2), no keyword stuffing.
- Use of target keywords (keywords[]).
- Audience clarity & benefits (audience, benefits, description).
- Basic on-page SEO best practices (no need to check technical SEO like page speed).
- Optional bonuses: structured data (schemaEnabled, schemaMode, schemaData).

Target audience: students/parents looking for English courses.

Here is the raw object (some fields may be null):

{
  "title": ${JSON.stringify(title)},
  "slug": ${JSON.stringify(slug)},
  "description": ${JSON.stringify(description)},
  "content": ${JSON.stringify(content)},
  "metaTitle": ${JSON.stringify(metaTitle)},
  "metaDescription": ${JSON.stringify(metaDescription)},
  "keywords": ${JSON.stringify(keywords)},
  "audience": ${JSON.stringify(audience)},
  "benefits": ${JSON.stringify(benefits)},
  "schemaEnabled": ${JSON.stringify(schemaEnabled)},
  "schemaMode": ${JSON.stringify(schemaMode)},
  "schemaData": ${JSON.stringify(schemaData)},
  "duration": ${JSON.stringify(duration)},
  "startDate": ${JSON.stringify(startDate)},
  "endDate": ${JSON.stringify(endDate)},
  "tuition": ${JSON.stringify(tuition)}
}

IMPORTANT:
- Respond ONLY with JSON as described, no markdown, no comments, no extra text.
- "score" MUST be an integer between 0 and 100.
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText = result.response.text().trim();

    // 1. Remove Markdown code fences if present
    let text = rawText;

    // Case: ```json\n{...}\n```
    if (text.startsWith("```")) {
        // Remove leading ``` or ```json
        text = text.replace(/^```(?:json)?\s*/i, "");
        // Remove trailing ```
        text = text.replace(/```$/, "").trim();
    }

    // Extra safety: extract first JSON object if there is any leftover text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Gemini response does not contain a JSON object: " + rawText);
    }

    let parsed: any;
    try {
        parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
        throw new Error("Gemini response is not valid JSON: " + rawText);
    }

    const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score) || 0)));

    return {
        score,
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        overallComment: typeof parsed.overallComment === "string" ? parsed.overallComment : "",
    };
}
