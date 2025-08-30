import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@utils/jwt";

const prisma = new PrismaClient();

export type LoginDTO = {
    usernameOrEmail: string;
    password: string;
};

export type OAuth2TokenResponse = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number; // seconds for access token
    refresh_token: string;
    scope?: string;
};

export class AuthService {
    /**
     * Đăng nhập người dùng, trả về OAuth2 token response
     * - Tìm user theo username hoặc email
     * - So sánh mật khẩu bằng bcrypt
     * - Ký JWT access & refresh
     * - (Tùy chọn) Có thể lưu refresh token (hash) vào DB/Redis để enable rotation & revoke
     */
    static async login(input: LoginDTO): Promise<OAuth2TokenResponse> {
        const { usernameOrEmail, password } = input;

        // 1) Tìm user theo username hoặc email
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            },
            include: {
                UsersRoles: {
                    include: { Role: true },
                },
            },
        });

        // Không tiết lộ lý do cụ thể (tránh leak)
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // 2) So sánh mật khẩu
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            throw new Error("Invalid credentials");
        }

        // Lấy danh sách role (nếu cần embed vào access token)
        const roles = (user.UsersRoles ?? []).map((ur) => ur.Role.role_name);

        // jti có thể là user_id + timestamp (tùy thích); nếu bạn lưu session, dùng jti để revoke/rotate
        const jti = `${user.user_id}:${Date.now()}`;

        // 3) Ký token
        const { token: accessToken, expiresIn: accessExpiresIn } =
            signAccessToken({
                sub: user.user_id,
                username: user.username,
                email: user.email,
                jti,
                roles,
            });

        const { token: refreshToken } = signRefreshToken({
            sub: user.user_id,
            username: user.username,
            email: user.email,
            jti,
        });

        // 4) (Tùy chọn) Lưu refresh token (hash) vào DB/Redis để revoke/rotate
        // - Schema hiện tại chưa có bảng lưu token. Bạn có thể:
        //   * Tạo bảng refresh_token(user_id, jti, token_hash, expires_at, revoked_at, user_agent, ip)
        //   * Hoặc lưu vào Redis với TTL = JWT_REFRESH_EXPIRES
        //   Ở đây mình để TODO:
        // await saveRefreshToken({ userId: user.user_id, jti, token: refreshToken });

        // 5) Trả về đúng format OAuth2
        return {
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: accessExpiresIn, // seconds
            refresh_token: refreshToken,
            scope: roles.join(" "), // optional, nếu cần
        };
    }
}
