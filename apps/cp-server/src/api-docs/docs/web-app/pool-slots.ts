/**
 * @swagger
 * tags:
 *   name: Pool Slots
 *   description: API endpoints for pool slots
 */

/**
 * @swagger
 * /pool-slots:
 *   get:
 *     summary: Get pool slots
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to community members. A poolId is required.
 *     parameters:
 *       - in: query
 *         name: poolId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *         example: createdAt
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *         example: asc|desc
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlots'
 */

/**
 * @swagger
 * /pool-slots/{id}:
 *   get:
 *     summary: Get a pool slot
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to community members.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlotLookup'
 */

/**
 * @swagger
 * /pools/{poolId}/slots:
 *   post:
 *     summary: Add a slot to a pool
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the community owner who owns the pool. Assigning the pool owner requires slotAccountType and bankAccountId and approves the slot immediately.
 *     parameters:
 *       - in: path
 *         name: poolId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PoolSlotInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */

/**
 * @swagger
 * /pool-slots/{id}/member:
 *   put:
 *     summary: Assign or update a pool slot member
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the community owner who owns the pool. Assigning the pool owner requires slotAccountType and bankAccountId and approves the slot immediately.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PoolSlotInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */

/**
 * @swagger
 * /pool-slots/{id}/confirm:
 *   put:
 *     summary: Send a pool slot confirmation request
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the community owner. Sends a confirmation email to the assigned slot owner.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */

/**
 * @swagger
 * /pool-slots/{id}/accept:
 *   put:
 *     summary: Accept a pending pool slot
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the assigned slot owner. Notifies the pool owner.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PoolSlotPaymentInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */

/**
 * @swagger
 * /pool-slots/{id}/reject:
 *   put:
 *     summary: Reject a pending pool slot
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the assigned slot owner. Notifies the pool owner.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */

/**
 * @swagger
 * /pool-slots/{id}/revoke:
 *   put:
 *     summary: Revoke a pool slot
 *     tags: [Pool Slots]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     description: Available to the community owner. Sends a status email to the assigned slot owner.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/PoolSlot'
 */
