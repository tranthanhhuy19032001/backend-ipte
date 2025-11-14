// src/routes/about.routes.ts
import { Router } from "express";
import { AboutController } from "@controllers/about.controller";
import { authRole } from "@middlewares/authorization";
import { Role } from "@enums/role.enum";

const router = Router();
const aboutController = new AboutController();

/**
 * @openapi
 * tags:
 *   - name: About
 *     description: Quản lý nội dung About
 */

/**
 * @openapi
 * /api/about:
 *   get:
 *     tags: [About]
 *     summary: List about entries
 *     description: Lấy danh sách about, hỗ trợ tìm kiếm và phân trang.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khoá tìm kiếm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bản ghi mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách about
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/About'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 page_size:
 *                   type: integer
 *       500:
 *         description: Failed to list about
 *   post:
 *     tags: [About]
 *     summary: Create about
 *     description: Tạo mới một about entry (chỉ ADMIN).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AboutInput'
 *     responses:
 *       201:
 *         description: About created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       500:
 *         description: Failed to create about
 */

/**
 * @openapi
 * /api/about/{id}:
 *   get:
 *     tags: [About]
 *     summary: Get about by ID
 *     description: Lấy chi tiết một about entry theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: About info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       400:
 *         description: Invalid about_id
 *       404:
 *         description: About not found
 *       500:
 *         description: Failed to get about
 *   put:
 *     tags: [About]
 *     summary: Update about
 *     description: Cập nhật một about entry theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AboutInput'
 *     responses:
 *       200:
 *         description: About updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 *       400:
 *         description: Invalid about_id
 *       404:
 *         description: About not found
 *       500:
 *         description: Failed to update about
 *   delete:
 *     tags: [About]
 *     summary: Delete about
 *     description: Xoá một about entry theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: About deleted successfully (no content)
 *       400:
 *         description: Invalid about_id
 *       404:
 *         description: About not found
 *       500:
 *         description: Failed to delete about
 */

router.post("/", authRole([Role.ADMIN]), aboutController.create.bind(aboutController));
router.get("/", aboutController.list.bind(aboutController));
router.get("/:id", aboutController.getById.bind(aboutController));
router.put("/:id", aboutController.update.bind(aboutController));
router.delete("/:id", aboutController.remove.bind(aboutController));

export default router;
