/**
 * @swagger
 * components:
 *   schemas:
 *     PumpControlInput:
 *       type: object
 *       required:
 *         - deviceId
 *         - isOn
 *       properties:
 *         deviceId:
 *           type: string
 *           format: uuid
 *           description: ID của thiết bị máy bơm
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         isOn:
 *           type: boolean
 *           description: Trạng thái bật/tắt máy bơm
 *           example: true
 *         reason:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           description: Lý do bật/tắt (tự động hoặc thủ công)
 *           example: "Manual: watering plants"
 *
 *     RGBColor:
 *       type: object
 *       required:
 *         - r
 *         - g
 *         - b
 *       properties:
 *         r:
 *           type: integer
 *           minimum: 0
 *           maximum: 255
 *           description: Kênh đỏ (Red)
 *           example: 255
 *         g:
 *           type: integer
 *           minimum: 0
 *           maximum: 255
 *           description: Kênh xanh lá (Green)
 *           example: 0
 *         b:
 *           type: integer
 *           minimum: 0
 *           maximum: 255
 *           description: Kênh xanh dương (Blue)
 *           example: 100
 *
 *     RGBControlInput:
 *       type: object
 *       required:
 *         - deviceId
 *         - isOn
 *       properties:
 *         deviceId:
 *           type: string
 *           format: uuid
 *           description: ID của thiết bị đèn LED RGB
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         isOn:
 *           type: boolean
 *           description: Trạng thái bật/tắt đèn LED
 *           example: true
 *         color:
 *           $ref: '#/components/schemas/RGBColor'
 *           description: Màu sắc RGB (bắt buộc khi isOn = true)
 *
 *     LCDControlInput:
 *       type: object
 *       required:
 *         - deviceId
 *         - content
 *       properties:
 *         deviceId:
 *           type: string
 *           format: uuid
 *           description: ID của thiết bị màn hình LCD
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           description: "Nội dung hiển thị trên LCD 1602 (tối đa 32 ký tự: 16×2)"
 *           example: "Temp: 28C Hum: 65%"
 *
 *     PumpControlRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID bản ghi điều khiển
 *         deviceId:
 *           type: string
 *           format: uuid
 *           description: ID thiết bị
 *         isOn:
 *           type: boolean
 *           description: Trạng thái bật/tắt
 *         reason:
 *           type: string
 *           nullable: true
 *           description: Lý do bật/tắt
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian thực hiện
 *
 *     RGBControlRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         deviceId:
 *           type: string
 *           format: uuid
 *         isOn:
 *           type: boolean
 *         value:
 *           type: string
 *           description: Giá trị màu RGB dạng JSON
 *           example: '{"r":255,"g":0,"b":100}'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     DisplayLogRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         deviceId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *           description: Nội dung đã hiển thị trên LCD
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     ControlResult:
 *       type: object
 *       properties:
 *         record:
 *           type: object
 *           description: Bản ghi điều khiển đã lưu trong database
 *         mqttPublished:
 *           type: boolean
 *           description: Đã gửi lệnh qua MQTT thành công hay chưa
 *           example: true
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Tổng số bản ghi
 *           example: 50
 *         page:
 *           type: integer
 *           description: Trang hiện tại
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Số bản ghi mỗi trang
 *           example: 10
 *         totalPages:
 *           type: integer
 *           description: Tổng số trang
 *           example: 5
 */

/**
 * @swagger
 * tags:
 *   name: Control
 *   description: API Điều khiển thiết bị IoT (Máy bơm, Đèn LED RGB, Màn hình LCD). Sử dụng Strategy + Registry Pattern — dễ dàng mở rộng thêm thiết bị mới.
 */

/**
 * @swagger
 * /api/control/pump:
 *   post:
 *     summary: Gửi lệnh bật/tắt máy bơm
 *     tags: [Control]
 *     description: |
 *       Gửi lệnh điều khiển máy bơm. Lệnh sẽ được:
 *       1. Lưu vào bảng `pump_control` trong database
 *       2. Publish giá trị `"1"` (bật) hoặc `"0"` (tắt) tới feed `pumper` trên Adafruit IO qua MQTT
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PumpControlInput'
 *           examples:
 *             turn-on:
 *               summary: Bật máy bơm (thủ công)
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 isOn: true
 *                 reason: "Manual: watering plants"
 *             turn-off:
 *               summary: Tắt máy bơm
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 isOn: false
 *     responses:
 *       201:
 *         description: Gửi lệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: pump control command sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     record:
 *                       $ref: '#/components/schemas/PumpControlRecord'
 *                     mqttPublished:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiết bị không phải loại PUMP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Device "Sensor-01" is type TEMPERATURE_SENSOR, expected PUMP'
 *       401:
 *         description: Chưa đăng nhập (thiếu hoặc sai token)
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */

/**
 * @swagger
 * /api/control/rgb:
 *   post:
 *     summary: Điều khiển trạng thái và màu sắc đèn LED RGB
 *     tags: [Control]
 *     description: |
 *       Gửi lệnh điều khiển đèn LED RGB. Lệnh sẽ được:
 *       1. Lưu vào bảng `rgb_control` trong database
 *       2. Publish giá trị hex (vd: `"#FF0064"`) hoặc `"0"` (tắt) tới feed `led` trên Adafruit IO qua MQTT
 *
 *       **Lưu ý:** Khi `isOn = true`, trường `color` là bắt buộc.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RGBControlInput'
 *           examples:
 *             turn-on-red:
 *               summary: Bật LED màu đỏ
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 isOn: true
 *                 color: { r: 255, g: 0, b: 0 }
 *             turn-on-custom:
 *               summary: Bật LED màu tùy chỉnh
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 isOn: true
 *                 color: { r: 100, g: 200, b: 50 }
 *             turn-off:
 *               summary: Tắt đèn LED
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 isOn: false
 *     responses:
 *       201:
 *         description: Gửi lệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: rgb control command sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     record:
 *                       $ref: '#/components/schemas/RGBControlRecord'
 *                     mqttPublished:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Dữ liệu không hợp lệ (thiếu color khi isOn=true, sai loại thiết bị, ...)
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */

/**
 * @swagger
 * /api/control/lcd:
 *   post:
 *     summary: Gửi nội dung văn bản hiển thị lên màn hình LCD 1602
 *     tags: [Control]
 *     description: |
 *       Gửi nội dung text để hiển thị trên LCD 1602 (16 ký tự × 2 dòng = tối đa 32 ký tự).
 *       Lệnh sẽ được lưu vào bảng `display_log` trong database.
 *
 *       **Lưu ý:** Hiện chưa có MQTT feed cho LCD, chỉ lưu log vào database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LCDControlInput'
 *           examples:
 *             sensor-display:
 *               summary: Hiển thị dữ liệu cảm biến
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 content: "Temp: 28C Hum: 65%"
 *             warning-display:
 *               summary: Hiển thị cảnh báo
 *               value:
 *                 deviceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 content: "ALERT! Low water!"
 *     responses:
 *       201:
 *         description: Gửi lệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: lcd control command sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     record:
 *                       $ref: '#/components/schemas/DisplayLogRecord'
 *                     mqttPublished:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Dữ liệu không hợp lệ (content rỗng, quá 32 ký tự, sai loại thiết bị)
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */

/**
 * @swagger
 * /api/control/pump/history:
 *   get:
 *     summary: Xem lịch sử các lần điều khiển máy bơm
 *     tags: [Control]
 *     description: Lấy danh sách lịch sử bật/tắt máy bơm có phân trang, bao gồm thời gian và lý do (tự động hay thủ công).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của thiết bị máy bơm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Số bản ghi mỗi trang
 *     responses:
 *       200:
 *         description: Lịch sử điều khiển máy bơm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: pump control history
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PumpControlRecord'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */

/**
 * @swagger
 * /api/control/rgb/history:
 *   get:
 *     summary: Xem lịch sử điều khiển đèn LED RGB
 *     tags: [Control]
 *     description: Lấy danh sách lịch sử điều khiển đèn LED RGB có phân trang.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của thiết bị đèn LED RGB
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
 *         description: Số bản ghi mỗi trang
 *     responses:
 *       200:
 *         description: Lịch sử điều khiển đèn LED RGB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: rgb control history
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RGBControlRecord'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */

/**
 * @swagger
 * /api/control/lcd/history:
 *   get:
 *     summary: Xem lịch sử nội dung đã gửi lên LCD
 *     tags: [Control]
 *     description: Lấy danh sách lịch sử nội dung đã hiển thị trên màn hình LCD có phân trang.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của thiết bị màn hình LCD
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
 *         description: Số bản ghi mỗi trang
 *     responses:
 *       200:
 *         description: Lịch sử nội dung LCD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: lcd control history
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DisplayLogRecord'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập thiết bị này
 *       404:
 *         description: Không tìm thấy thiết bị
 */
