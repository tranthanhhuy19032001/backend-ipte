import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORAGE_DIR = path.join(process.cwd(), "storage", "images", "courses");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Decode base64 image string and save to storage
 * @param base64String - Base64 image string (e.g., "data:image/jpeg;base64,...")
 * @returns Path to saved image (relative path for database)
 */
export async function saveBase64Image(base64String: string): Promise<string> {
    try {
        if (!base64String) {
            throw new Error("Image string is empty");
        }

        // Parse base64 string
        const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
            throw new Error("Invalid base64 format. Expected: data:image/type;base64,encoded_data");
        }

        const [, mimeType, base64Data] = matches;

        // Validate MIME type
        if (!ALLOWED_TYPES.includes(mimeType)) {
            throw new Error(`Invalid image type. Allowed: ${ALLOWED_TYPES.join(", ")}`);
        }

        // Decode base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");

        // Validate file size
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }

        // Create storage directory if it doesn't exist
        if (!fs.existsSync(STORAGE_DIR)) {
            fs.mkdirSync(STORAGE_DIR, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const hash = crypto.randomBytes(8).toString("hex");
        const extension = mimeType.split("/")[1]; // jpeg, png, etc.
        const filename = `${timestamp}-${hash}.${extension}`;
        const filePath = path.join(STORAGE_DIR, filename);

        // Save file
        fs.writeFileSync(filePath, buffer);

        console.log(`Image saved successfully: ${filename}`);

        // Return relative path for database storage
        return `/storage/images/courses/${filename}`;
    } catch (error) {
        console.error("Error saving image:", error);
        throw error;
    }
}

/**
 * Delete image from storage
 * @param imagePath - Relative path to image (e.g., "/storage/images/courses/123-abc.jpg")
 */
export function deleteImage(imagePath: string): void {
    try {
        if (!imagePath) return;

        // Extract filename from path
        const filename = path.basename(imagePath);
        const filePath = path.join(STORAGE_DIR, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Image deleted: ${filename}`);
        }
    } catch (error) {
        console.error("Error deleting image:", error);
    }
}

/**
 * Check if image exists
 * @param imagePath - Relative path to image
 */
export function imageExists(imagePath: string): boolean {
    try {
        if (!imagePath) return false;

        const filename = path.basename(imagePath);
        const filePath = path.join(STORAGE_DIR, filename);

        return fs.existsSync(filePath);
    } catch (error) {
        console.error("Error checking image:", error);
        return false;
    }
}
