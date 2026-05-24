/**
 * @swagger
 * components:
 *   schemas:
 *     SensorThreshold:
 *       type: object
 *       properties:
 *         soilMoisture:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng độ ẩm đất (%)
 *         light:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng cường độ ánh sáng (%)
 *         temperature:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng nhiệt độ (°C)
 *         humidity:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng độ ẩm không khí (%)
 *
 *     UpdateSensorThresholdInput:
 *       type: object
 *       required:
 *         - soilMoistureThreshold
 *         - lightIntensityThreshold
 *         - temperatureThreshold
 *         - humidityThreshold
 *       properties:
 *         soilMoistureThreshold:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng độ ẩm đất (%)
 *         lightIntensityThreshold:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng cường độ ánh sáng (%)
 *         temperatureThreshold:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng nhiệt độ (°C)
 *         humidityThreshold:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Ngưỡng độ ẩm không khí (%)
 *
 *     LatestSensorData:
 *       type: object
 *       properties:
 *         temperature:
 *           type: number
 *           description: Nhiệt độ hiện tại (°C)
 *         humidity:
 *           type: number
 *           description: Độ ẩm không khí hiện tại (%)
 *         soilMoisture:
 *           type: number
 *           description: Độ ẩm đất hiện tại (%)
 *         light:
 *           type: number
 *           description: Cường độ ánh sáng hiện tại (%)
 *         source:
 *           type: string
 *           enum: [cache, database]
 *           description: Nguồn dữ liệu (cache Redis hoặc database)
 *
 *     SensorHistoryData:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           description: Nhãn thời gian
 *         value:
 *           type: number
 *           description: Giá trị trung bình trong khoảng thời gian
 *         timestamp:
 *           type: integer
 *           format: int64
 *           description: Timestamp (milliseconds)
 *
 *     SensorHistoryResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SensorHistoryData'
 *         range:
 *           type: string
 *           enum: [day, week, month]
 *           description: Khoảng thời gian
 *         type:
 *           type: string
 *           enum: [temperature, humidity, soil, light]
 *           description: Loại cảm biến
 *         lastUpdate:
 *           type: string
 *           format: date
 *           description: Ngày cập nhật cuối cùng
 *
 *     ResetThresholdResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Sensor threshold reset successfully
 *
 *     UpdateThresholdResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Sensor threshold updated successfully
 */

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: API Quản lý cảm biến và ngưỡng (Yêu cầu xác thực)
 */

/**
 * @swagger
 * /api/sensors/threshold:
 *   get:
 *     summary: Lấy ngưỡng cảm biến hiện tại của người dùng
 *     tags: [Sensors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Thông tin ngưỡng cảm biến
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SensorThreshold'
 *                 message:
 *                   type: string
 *                   example: Get sensor threshold successfully
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *
 *   put:
 *     summary: Cập nhật ngưỡng cảm biến
 *     tags: [Sensors]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSensorThresholdInput'
 *         examples:
 *           example-1:
 *             summary: Ví dụ cập nhật ngưỡng
 *             value:
 *               soilMoistureThreshold: 60
 *               lightIntensityThreshold: 70
 *               temperatureThreshold: 35
 *               humidityThreshold: 65
 *     responses:
 *       200:
 *         description: Cập nhật ngưỡng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UpdateThresholdResponse'
 *                 message:
 *                   type: string
 *                   example: Update sensor threshold successfully
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ (giá trị ngoài khoảng 0-100)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Ngưỡng độ ẩm đất phải từ 0% trở lên
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */

/**
 * @swagger
 * /api/sensors/threshold/reset:
 *   post:
 *     summary: Đặt lại ngưỡng cảm biến về giá trị mặc định (50%)
 *     tags: [Sensors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Đặt lại ngưỡng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ResetThresholdResponse'
 *                 message:
 *                   type: string
 *                   example: Reset sensor threshold successfully
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */

/**
 * @swagger
 * /api/sensors/latest:
 *   get:
 *     summary: Lấy dữ liệu cảm biến mới nhất (từ cache Redis hoặc database)
 *     tags: [Sensors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dữ liệu cảm biến mới nhất
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LatestSensorData'
 *                 message:
 *                   type: string
 *                   example: Get latest sensor data successfully
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       500:
 *         description: Lỗi kết nối Redis hoặc database
 */

/**
 * @swagger
 * /api/sensors/history:
 *   get:
 *     summary: Lấy dữ liệu lịch sử của cảm biến theo khoảng thời gian
 *     tags: [Sensors]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [temperature, humidity, soil, light]
 *         description: Loại cảm biến cần xem lịch sử
 *       - in: query
 *         name: range
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Khoảng thời gian (ngày, tuần, tháng)
 *     responses:
 *       200:
 *         description: Dữ liệu lịch sử cảm biến đã được tổng hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SensorHistoryResponse'
 *                 message:
 *                   type: string
 *                   example: Get sensor history successfully
 *       400:
 *         description: Tham số query không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid query parameters
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy dữ liệu cảm biến
 *
 *     examples:
 *       day-request:
 *         summary: Lấy dữ liệu nhiệt độ trong ngày
 *         value:
 *           type: temperature
 *           range: day
 *       week-request:
 *         summary: Lấy dữ liệu độ ẩm trong tuần
 *         value:
 *           type: humidity
 *           range: week
 *       month-request:
 *         summary: Lấy dữ liệu ánh sáng trong tháng
 *         value:
 *           type: light
 *           range: month
 */