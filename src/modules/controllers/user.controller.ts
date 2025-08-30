import { Request, Response } from "express";
import { UserService } from "@services/user.service";

const userService = new UserService();

export class UserController {
    // Lấy danh sách tất cả user
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: error.message,
            });
        }
    }

    // Lấy user theo ID
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const user = await userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to fetch user",
                error: error.message,
            });
        }
    }

    // Tạo mới user
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password, roleId } = req.body;
            const newUser = await userService.registerUser(
                username,
                email,
                password,
                roleId
            );
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to create user",
                error: error.message,
            });
        }
    }

    // Cập nhật user
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { username, email, password, roleId } = req.body;

            const updatedUser = await userService.updateUser(id, {
                username,
                email,
                password,
            });

            if (!updatedUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to update user",
                error: error.message,
            });
        }
    }

    // Xóa user
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const deletedUser = await userService.deleteUser(id);

            if (!deletedUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to delete user",
                error: error.message,
            });
        }
    }
}
