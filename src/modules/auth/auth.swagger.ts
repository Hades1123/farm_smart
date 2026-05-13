/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của người dùng
 *         username:
 *           type: string
 *           description: Tên đăng nhập
 *         email:
 *           type: string
 *           format: email
 *           description: Email người dùng
 *         phone:
 *           type: string
 *           nullable: true
 *           description: Số điện thoại
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           description: Tên đăng nhập (3-50 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới)
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *           description: Email người dùng
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 255
 *           format: password
 *           description: Mật khẩu (ít nhất 6 ký tự)
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Tên đăng nhập hoặc email
 *         password:
 *           type: string
 *           format: password
 *           description: Mật khẩu
 *
 *     TokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Access token (JWT)
 *         tokenType:
 *           type: string
 *           example: Bearer
 *           description: Loại token
 *
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Access token mới (JWT)
 *         tokenType:
 *           type: string
 *           example: Bearer
 *           description: Loại token
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Xác thực người dùng (Đăng ký, Đăng nhập, Đăng xuất, Làm mới token)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *         examples:
 *           example-1:
 *             summary: Ví dụ đăng ký
 *             value:
 *               username: john_doe
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Register successfully
 *       409:
 *         description: Email đã tồn tại
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
 *                   example: Email already exists
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
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
 *                   example: Username phải có ít nhất 3 kí tự
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *         examples:
 *           example-1:
 *             summary: Ví dụ đăng nhập
 *             value:
 *               username: john_doe
 *               password: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Refresh token được lưu trong cookie (httpOnly)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponse'
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Tên đăng nhập hoặc mật khẩu không đúng
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
 *                   example: Invalid username or password
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
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
 *                   example: Mật khẩu phải có ít nhất 6 kí tự
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công (refresh token cookie bị xóa)
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Refresh token cookie được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                   nullable: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token (sử dụng refresh token từ cookie)
 *     tags: [Auth]
 *     description: |
 *       Client cần có refresh token trong cookie (httpOnly) để gọi API này.
 *       Refresh token được lưu khi đăng nhập thành công, có hiệu lực 7 ngày.
 *       Access token mới sẽ có hiệu lực 15 phút.
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RefreshTokenResponse'
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully
 *       401:
 *         description: Refresh token thiếu hoặc hết hạn
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
 *                   example: Refresh token is missing or expired
 *       400:
 *         description: Token type không hợp lệ
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
 *                   example: Invalid token type
 *       404:
 *         description: Không tìm thấy người dùng
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
 *                   example: User not found
 */