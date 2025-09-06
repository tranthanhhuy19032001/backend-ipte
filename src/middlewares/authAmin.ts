import { Request, Response, NextFunction } from "express";
import { verifyToken, DecodedToken } from "@utils/jwt";

/**
 * Middleware kiểm tra:
 * - Header Authorization: Bearer <access_token>
 * - Token hợp lệ (JWT access)
 * - Payload phải chứa roles và có "ADMIN"
 */
export function authAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token, "access") as DecodedToken;

        if (!decoded.roles || !Array.isArray(decoded.roles)) {
            return res
                .status(403)
                .json({ message: "Forbidden. Roles missing." });
        }

        if (!decoded.roles.includes("ADMIN")) {
            return res.status(403).json({ message: "Forbidden. Admin only." });
        }

        // Gắn user vào req để controller có thể dùng
        (req as any).user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}
