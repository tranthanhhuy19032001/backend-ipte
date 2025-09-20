// src/routes/branch.routes.ts
import { Router } from "express";
import { BranchController } from "@controllers/branch.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const branchController = new BranchController();

/**
 * @openapi
 * /api/branches:
 *   get:
 *     tags: [Branch]
 *     summary: List branches
 *     description: Lọc theo about_id, tìm kiếm theo tên/địa chỉ/số điện thoại. Có phân trang.
 *     parameters:
 *       - in: query
 *         name: about_id
 *         schema: { type: integer }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: page_size
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: Danh sách branch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BranchListResponse'
 *       500: { description: Failed to list branches }
 *
 *   post:
 *     tags: [Branch]
 *     summary: Create branch
 *     description: Chỉ ADMIN được tạo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchCreateDTO'
 *           examples:
 *             sample:
 *               value:
 *                 about_id: 1
 *                 branch_name: "Chi nhánh HCM"
 *                 address: "Quận 1, TP.HCM"
 *                 phone: "0909 000 000"
 *                 latitude: 10.777
 *                 longitude: 106.7
 *                 opening_hours:
 *                   mon: "09:00-18:00"
 *                   sat: "09:00-12:00"
 *     responses:
 *       201:
 *         description: Tạo branch thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400: { description: Invalid about_id (foreign key) }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       500: { description: Failed to create branch }
 *
 * /api/branches/{id}:
 *   get:
 *     tags: [Branch]
 *     summary: Get branch by id
 *     security:
 *       - bearerAuth: []   # Nếu public thì bỏ block security này
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400: { description: Invalid branch_id }
 *       404: { description: Branch not found }
 *       500: { description: Failed to get branch }
 *
 *   put:
 *     tags: [Branch]
 *     summary: Update branch
 *     description: Chỉ ADMIN được cập nhật.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Cập nhật một phần; các field đều optional.
 *             properties:
 *               about_id: { type: integer, description: "Nếu đổi, phải là about_id hợp lệ" }
 *               branch_name: { type: string }
 *               address: { type: string }
 *               phone: { type: string, nullable: true }
 *               latitude: { type: number, nullable: true }
 *               longitude: { type: number, nullable: true }
 *               opening_hours:
 *                 $ref: '#/components/schemas/OpeningHours'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400: { description: Invalid branch_id hoặc invalid about_id (foreign key) }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Branch not found }
 *       500: { description: Failed to update branch }
 *
 *   delete:
 *     tags: [Branch]
 *     summary: Remove branch
 *     description: Chỉ ADMIN được xóa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted successfully }
 *       400: { description: Invalid branch_id }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Branch not found }
 *       500: { description: Failed to delete branch }
 */

router.post(
    "/",
    authRole([Role.ADMIN]),
    branchController.create.bind(branchController)
);
router.get("/", branchController.list.bind(branchController));
router.get("/:id", branchController.getById.bind(branchController));
router.put(
    "/:id",
    authRole([Role.ADMIN]),
    branchController.update.bind(branchController)
);
router.delete(
    "/:id",
    authRole([Role.ADMIN]),
    branchController.remove.bind(branchController)
);

export default router;
