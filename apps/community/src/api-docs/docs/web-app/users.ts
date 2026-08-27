/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - name: search
 *         in: query
 *         type: string
 *       - in: query
 *         name: limit
 *         type: number
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: roleId
 *         type: string
 *       - in: query
 *         name: isSuspended
 *         type: string
 *         example: "true|false"
 *       - in: query
 *         name: sortKey
 *         type: string
 *         example: firstName|lastName|emailAddress|createdAt
 *       - in: query
 *         name: sortDir
 *         type: string
 *         example: asc|desc
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/UsersRS'
 */
