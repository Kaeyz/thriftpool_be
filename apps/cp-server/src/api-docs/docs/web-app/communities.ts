/**
 * @swagger
 * tags:
 *   name: Communities
 *   description: API endpoints for communities
 */

/**
 * @swagger
 * /communities/me:
 *   get:
 *     summary: Get LoggedInUser Communities
 *     tags: [Communities]
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
 *         name: sortKey
 *         type: string
 *         example: name|key|createdAt
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
 *               $ref: '#/components/schemas/Communities'
 */

/**
 * @swagger
 * /communities:
 *   post:
 *     summary: Create a new community
 *     tags: [Communities]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CommunityInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Community'
 */

/**
 * @swagger
 * /communities/me:
 *   put:
 *     summary: Update community
 *     tags: [Communities]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CommunityInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Community'
 */
