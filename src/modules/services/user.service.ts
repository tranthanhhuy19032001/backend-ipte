import { UserDAO } from "@dao/user.dao";
import { user } from "@prisma/client";

export class UserService {
    private userDao: UserDAO;

    constructor() {
        this.userDao = new UserDAO();
    }

    async getUserById(id: number): Promise<user | null> {
        return this.userDao.findById(id);
    }

    async getUserByEmail(email: string): Promise<user | null> {
        return this.userDao.findByEmail(email);
    }

    async getAllUsers(): Promise<user[]> {
        return this.userDao.findAll();
    }

    async registerUser(
        username: string,
        password: string,
        email: string,
        roleId: number
    ): Promise<user> {
        // 👉 Có thể hash password tại đây trước khi lưu
        return this.userDao.create({
            email,
            password,
            username,
            roleId,
            createdBy: "system",
            updatedBy: "system",
            version: 1,
        } as any); // ép kiểu vì thiếu id, createdAt, updatedAt
    }

    async updateUser(id: number, data: Partial<user>): Promise<user> {
        return this.userDao.update(id, data);
    }

    async deleteUser(id: number): Promise<user> {
        return this.userDao.delete(id);
    }
}
