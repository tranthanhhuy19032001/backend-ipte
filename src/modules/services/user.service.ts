import { UserDAO } from "@dao/user.dao";
import { user } from "@prisma/client";
import bcrypt from "bcryptjs";

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

    async getAllUsers(filters: {
        username?: string;
        email?: string;
        fullName?: string;
        isActive?: boolean;
        page: number;
        pageSize: number;
    }): Promise<{
        items: user[];
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    }> {
        return this.userDao.findAll(filters);
    }

    async registerUser(
        username: string,
        password: string,
        email: string,
        roleId: number
    ): Promise<user> {
        const passwordHash = bcrypt.hashSync(password, 10);

        return this.userDao.create({
            email,
            password: passwordHash,
            username,
            created_by: "system",
            updated_by: "system",
            version: 1,
            user_role: {
                create: [
                    {
                        created_by: "system",
                        updated_by: "system",
                        version: 1,
                        role: {
                            connect: {
                                role_id: roleId,
                            },
                        },
                    },
                ],
            },
        });
    }

    async updateUser(id: number, data: Partial<user>): Promise<user> {
        return this.userDao.update(id, data);
    }

    async deleteUser(id: number): Promise<user> {
        return this.userDao.delete(id);
    }
}
