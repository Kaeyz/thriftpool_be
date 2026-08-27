/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for authentication
 */

/**
 * @swagger
 * /auth/session-token:
 *   post:
 *     summary: Verify session token
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SessionTokenInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SessionTokenResponse'
 */

/**
 * @swagger
 * /auth/refresh-session-token:
 *   post:
 *     summary: Refresh session token
 *     tags: [Auth]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/SessionRefreshTokenInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/SessionTokenResponse'
 */
