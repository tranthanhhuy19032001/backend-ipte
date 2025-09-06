import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

/**
 * Dữ liệu chuẩn đưa vào JWT
 */
export type SignInput = {
    sub: string | number; // user_id
    username: string;
    email: string;
    jti?: string; // ID duy nhất của token
    sid?: string; // session_id (để phân biệt thiết bị/phiên)
    roles?: string[]; // vai trò (nếu cần nhúng vào access)
};

export type DecodedToken = JwtPayload & {
    sub: string | number;
    username: string;
    email: string;
    jti: string;
    sid?: string;
    roles?: string[];
    typ: "access" | "refresh";
};

/**
 * Ký Access Token
 */
export function signAccessToken(payload: SignInput) {
    const secret = process.env.JWT_ACCESS_SECRET!;
    const expiresIn = Number(process.env.JWT_ACCESS_EXPIRES || 900); // default 15 phút

    const token = jwt.sign(
        {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles ?? [],
            jti: payload.jti,
            sid: payload.sid,
            typ: "access",
        },
        secret,
        { expiresIn }
    );

    return { token, expiresIn };
}

/**
 * Ký Refresh Token
 */
export function signRefreshToken(payload: SignInput) {
    const secret = process.env.JWT_REFRESH_SECRET!;
    const expiresIn = Number(process.env.JWT_REFRESH_EXPIRES || 2592000); // default 30 ngày

    const token = jwt.sign(
        {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            jti: payload.jti,
            sid: payload.sid,
            typ: "refresh",
        },
        secret,
        { expiresIn }
    );

    return { token, expiresIn };
}

/**
 * Verify + parse JWT
 * - Kiểm tra chữ ký
 * - Kiểm tra typ (access/refresh)
 */
export function verifyToken(
    token: string,
    expectedType: "access" | "refresh"
): DecodedToken {
    const secret =
        expectedType === "access"
            ? process.env.JWT_ACCESS_SECRET!
            : process.env.JWT_REFRESH_SECRET!;

    let decoded: any;
    try {
        decoded = jwt.verify(token, secret);
    } catch {
        throw new Error("Invalid token");
    }

    if (!decoded || typeof decoded !== "object") {
        throw new Error("Invalid token");
    }

    if (decoded.typ !== expectedType) {
        throw new Error("Token type mismatch");
    }

    return decoded as DecodedToken;
}

/**
 * Hash token (chỉ lưu hash trong DB để tăng bảo mật)
 */
export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
