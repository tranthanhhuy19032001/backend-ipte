// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "@controllers/auth.controller";

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication & Authorization
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Đăng nhập và nhận access/refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 format: username
 *               password:
 *                 type: string
 *                 minLength: 6
 *           examples:
 *             sample:
 *               value:
 *                 username: "admin"
 *                 password: "admin123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout
 *     description: Vô hiệu hoá refresh token phía server. Client nên xoá access token phía client.
 *     parameters:
 *       - in: cookie
 *         name: rt
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token lưu trong cookie
 *     responses:
 *       200:
 *         description: Successful logout (ngay cả khi refresh_token đã vô hiệu hoặc không hợp lệ)
 *       400:
 *         description: Bad Request
 */

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token & refresh token
 *     description: Cấp lại access token và refresh token khi refresh token còn hợp lệ. Refresh token được truyền qua cookie.
 *     parameters:
 *       - in: cookie
 *         name: rt
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token lưu trong cookie
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));

export default router;
