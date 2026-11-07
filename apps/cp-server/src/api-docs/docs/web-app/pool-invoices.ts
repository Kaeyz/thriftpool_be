/**
 * @swagger
 * tags:
 *   name: Pool Invoices
 *   description: API endpoints for pool invoices
 */

/**
 * @swagger
 * /pool-invoices/me:
 *   get:
 *     summary: Get the current member's pool invoices
 *     tags: [Pool Invoices]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     parameters:
 *       - in: query
 *         name: poolId
 *         type: string
 *       - in: query
 *         name: poolSlotId
 *         type: string
 *       - in: query
 *         name: status
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: limit
 *         type: number
 *       - in: query
 *         name: sortKey
 *         type: string
 *         example: createdAt|dueDate|issuedAt
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
 *               $ref: '#/components/schemas/PoolInvoices'
 */

/**
 * @swagger
 * /pool-invoices:
 *   get:
 *     summary: Get pool invoices in the current community
 *     tags: [Pool Invoices]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     parameters:
 *       - in: query
 *         name: poolId
 *         type: string
 *         required: true
 *       - in: query
 *         name: poolSlotId
 *         type: string
 *         required: true
 *       - in: query
 *         name: status
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: limit
 *         type: number
 *       - in: query
 *         name: sortKey
 *         type: string
 *         example: createdAt|dueDate|issuedAt
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
 *               $ref: '#/components/schemas/PoolInvoices'
 */

/**
 * @swagger
 * /pool-invoices/{id}:
 *   get:
 *     summary: Get a single pool invoice
 *     tags: [Pool Invoices]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolInvoice'
 */
