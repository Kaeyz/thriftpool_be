/**
 * @swagger
 * tags:
 *   name: Pools
 *   description: API endpoints for Pools
 */

/**
 * @swagger
 * /pools/me:
 *   get:
 *     summary: Get LoggedInUser Pools
 *     tags: [Pools]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
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
 *               $ref: '#/components/schemas/Pools'
 */

/**
 * @swagger
 * /pools:
 *   post:
 *     summary: Create a new pool
 *     tags: [Pools]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PoolInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Pool'
 */

/**
 * @swagger
 * /pools/{id}:
 *   put:
 *     summary: Update community
 *     tags: [Pools]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
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
