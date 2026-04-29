/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của thiết bị
 *         userId:
 *           type: integer
 *           description: ID của người dùng sở hữu thiết bị
 *         deviceName:
 *           type: string
 *           description: Tên thiết bị
 *         deviceType:
 *           type: string
 *           enum: [TEMPERATURE_SENSOR, SOIL_SENSOR, LIGHT_SENSOR, PUMP, LED, LCD]
 *           description: Loại thiết bị
 *         location:
 *           type: string
 *           nullable: true
 *           description: Vị trí đặt thiết bị
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *
 *     CreateDeviceInput:
 *       type: object
 *       required:
 *         - userId
 *         - deviceName
 *         - deviceType
 *       properties:
 *         userId:
 *           type: integer
 *         deviceName:
 *           type: string
 *         deviceType:
 *           type: string
 *           enum: [TEMPERATURE_SENSOR, SOIL_SENSOR, LIGHT_SENSOR, PUMP, LED, LCD]
 *         location:
 *           type: string
 *
 *     UpdateDeviceInput:
 *       type: object
 *       properties:
 *         deviceName:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API Quản lý thiết bị (CRUD)
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Lấy danh sách tất cả thiết bị của người dùng
 *     tags: [Devices]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng thiết bị trên mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách thiết bị và thông tin phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Device'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *
 *   post:
 *     summary: Thêm thiết bị mới (Yolo:Bit, cảm biến, máy bơm...)
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeviceInput'
 *     responses:
 *       201:
 *         description: Trả về thông tin thiết bị vừa tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Device'
 *                     message:
 *                       type: string
 */

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Xem chi tiết thông tin và trạng thái một thiết bị
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thiết bị cần xem
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của thiết bị
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Device'
 *       404:
 *         description: Không tìm thấy thiết bị
 *
 *   put:
 *     summary: Cập nhật tên hoặc vị trí đặt thiết bị
 *     tags: [Devices]
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
 *             $ref: '#/components/schemas/UpdateDeviceInput'
 *     responses:
 *       200:
 *         description: Thông tin thiết bị sau khi cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Device'
 *                     message:
 *                       type: string
 *       404:
 *         description: Không tìm thấy thiết bị
 *
 *   delete:
 *     summary: Xóa thiết bị khỏi hệ thống
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xóa thiết bị thành công
 *       404:
 *         description: Không tìm thấy thiết bị
 */
