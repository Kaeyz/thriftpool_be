/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for authentication
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get LoggedInUser
 *     tags: [Auth]
 *     security:
 *       - AuthToken: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   get:
 *     summary: Refresh Token
 *     tags: [Auth]
 *     security:
 *       - RefreshToken: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/RefreshToken'
 */

/**
 * @swagger
 * /auth/set-password:
 *   post:
 *     summary: Set password with token
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SetPasswordInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SetPassword'
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Signup User
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /auth/verify-account:
 *   post:
 *     summary: Verify User
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/VerifyTokenInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Verify'
 */

/**
 * @swagger
 * /auth/verify-reset-token:
 *   post:
 *     summary: Verify Forgot Password token
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/VerifyTokenInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Verify'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     security:
 *       - DeviceId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Login'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request forgot password
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/ForgotInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Forgot'
 */
