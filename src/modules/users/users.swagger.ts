/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
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
 *
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           minLength: 6
 *           maxLength: 255
 *           format: password
 *           description: Mật khẩu cũ (ít nhất 6 ký tự)
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           maxLength: 255
 *           format: password
 *           description: Mật khẩu mới (ít nhất 6 ký tự)
 *
 *     PasswordChangeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Password changed successfully
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API Quản lý thông tin người dùng (Yêu cầu xác thực)
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin profile của người dùng hiện tại
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Thông tin profile người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *                 message:
 *                   type: string
 *                   example: Get user's profile successfully
 *       401:
 *         description: Không có token hoặc token không hợp lệ
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
 *                   example: Unauthorized
 */

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Đổi mật khẩu của người dùng hiện tại
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *         examples:
 *           example-1:
 *             summary: Ví dụ đổi mật khẩu
 *             value:
 *               oldPassword: oldpassword123
 *               newPassword: newpassword456
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PasswordChangeResponse'
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc mật khẩu cũ sai
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
 *                   examples:
 *                     invalidOldPassword:
 *                       value: Old password is incorrect
 *                     validationError:
 *                       value: Mật khẩu phải có ít nhất 6 kí tự
 *       401:
 *         description: Không có token hoặc token không hợp lệ
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
 *                   example: Unauthorized
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