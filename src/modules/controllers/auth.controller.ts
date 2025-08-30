// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "@services/auth.service";

export class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, usernameOrEmail, password } = req.body;

            // Linh hoạt: chấp nhận usernameOrEmail hoặc (username/email)
            const credential = usernameOrEmail ?? username ?? email;
            if (!credential || !password) {
                res.status(400).json({
                    message:
                        "usernameOrEmail (hoặc username/email) và password là bắt buộc",
                });
                return;
            }

            const tokens = await AuthService.login({
                usernameOrEmail: credential,
                password,
            });

            // (Tùy chọn) Set refresh token vào HttpOnly cookie:
            // res.cookie("refresh_token", tokens.refresh_token, {
            //   httpOnly: true,
            //   secure: process.env.NODE_ENV === "production",
            //   sameSite: "lax",
            //   maxAge: Number(process.env.JWT_REFRESH_EXPIRES || 2592000) * 1000,
            // });

            res.status(200).json(tokens);
        } catch (err: any) {
            // Trả thông báo chung, tránh leak
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
}
