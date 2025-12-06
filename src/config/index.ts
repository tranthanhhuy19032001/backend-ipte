import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "",
    domain: process.env.DOMAIN || "http://localhost:4000",
    IMGBB_API_KEY: process.env.IMGBB_API_KEY || "",
    IMGBB_URL_UPLOAD: process.env.IMGBB_URL_UPLOAD || "",
};
