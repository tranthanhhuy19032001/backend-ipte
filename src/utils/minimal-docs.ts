// src/utils/minimal-docs.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
/* eslint-disable @typescript-eslint/no-var-requires */
const listEndpoints = require("express-list-endpoints");

// Từ danh sách route của Express -> build OpenAPI 3.0 "tối giản"
function buildMinimalOpenAPISpec(baseUrl: string, app: express.Express) {
    const eps = listEndpoints(app) as Array<{
        path: string;
        methods: string[];
    }>;
    const paths: Record<string, any> = {};

    for (const ep of eps) {
        // Loại chính trang docs ra khỏi spec để đỡ lặp
        if (["/swagger", "/docs.json", "/endpoints"].includes(ep.path))
            continue;

        const item: Record<string, any> = {};
        for (const m of ep.methods) {
            const method = m.toLowerCase();
            item[method] = {
                summary: `${m} ${ep.path}`,
                responses: { 200: { description: "OK" } }, // dummy – chỉ để hiện method
            };
        }
        paths[ep.path] = item;
    }

    return {
        openapi: "3.0.3",
        info: {
            title: "IPTE API Map",
            version: "1.0.0",
            description:
                "Auto-generated from Express routes (URL + METHOD only).",
        },
        servers: [{ url: baseUrl }],
        paths,
    };
}

// Mount 3 endpoint: /endpoints (JSON), /docs.json (OpenAPI JSON), /swagger (UI)
export function registerDocs(app: express.Express) {
    // Liệt kê endpoints dạng JSON (debug tiện)
    app.get("/endpoints", (_req, res) => {
        const endpoints = (
            listEndpoints(app) as Array<{ path: string; methods: string[] }>
        )
            .map((e) => ({ path: e.path, methods: [...e.methods].sort() }))
            .sort((a, b) => a.path.localeCompare(b.path));
        res.json({ count: endpoints.length, endpoints });
    });

    // OpenAPI JSON feed cho Swagger UI
    app.get("/docs.json", (req, res) => {
        const proto =
            (req.headers["x-forwarded-proto"] as string) ||
            req.protocol ||
            "http"; // Render sẽ set x-forwarded-proto=https
        const base = `${proto}://${req.get("host")}`;
        res.json(buildMinimalOpenAPISpec(base, app));
    });

    // Swagger UI trỏ tới /docs.json
    app.use(
        "/swagger",
        swaggerUi.serve,
        swaggerUi.setup(undefined, { swaggerUrl: "/docs.json" })
    );
}
