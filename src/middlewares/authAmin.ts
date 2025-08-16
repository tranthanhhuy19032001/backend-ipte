import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export default function authAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden. Admin only." });
        }
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid token." });
    }
}
