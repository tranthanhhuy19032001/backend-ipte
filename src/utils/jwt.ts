import jwt from "jsonwebtoken";

type SignInput = {
    sub: string | number; // user_id
    username: string;
    email: string;
    jti?: string; // id phiên / token id (tùy chọn)
    roles?: string[]; // optional
};

export function signAccessToken(payload: SignInput) {
    const secret = process.env.JWT_ACCESS_SECRET!;
    const expiresIn = Number(process.env.JWT_ACCESS_EXPIRES || 900); // seconds
    const token = jwt.sign(
        {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            roles: payload.roles ?? [],
            jti: payload.jti,
            typ: "access",
        },
        secret,
        { expiresIn } // seconds
    );
    return { token, expiresIn };
}

export function signRefreshToken(payload: SignInput) {
    const secret = process.env.JWT_REFRESH_SECRET!;
    const expiresIn = Number(process.env.JWT_REFRESH_EXPIRES || 2592000); // seconds
    const token = jwt.sign(
        {
            sub: payload.sub,
            username: payload.username,
            email: payload.email,
            jti: payload.jti,
            typ: "refresh",
        },
        secret,
        { expiresIn }
    );
    return { token, expiresIn };
}
export function verifyToken(token: string, type: "access" | "refresh") {
    const secret =
        type === "access"
            ? process.env.JWT_ACCESS_SECRET!
            : process.env.JWT_REFRESH_SECRET!;
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}
