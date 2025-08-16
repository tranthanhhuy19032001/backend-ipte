import { UserDAO } from "./user.dao";
import { User } from "@prisma/client";

export class UserService {
    private userDao: UserDAO;

    constructor() {
        this.userDao = new UserDAO();
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userDao.findById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userDao.findByEmail(email);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userDao.findAll();
    }

    async registerUser(
        username: string,
        password: string,
        email: string,
        roleId: number
    ): Promise<User> {
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

    async updateUser(id: number, data: Partial<User>): Promise<User> {
        return this.userDao.update(id, data);
    }

    async deleteUser(id: number): Promise<User> {
        return this.userDao.delete(id);
    }
}
