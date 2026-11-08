/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Invoice payments and receiver decisions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Register a payment against an invoice
 *     description: The invoice sender registers the payment amount. External bank-account payments start awaiting proof; upload proof using /utils/upload with entityName transaction and useCase proof.
 *     tags: [Transactions]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/TransactionRegistrationInput'
 *     responses:
 *       200:
 *         description: Transaction registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Transaction'
 *   get:
 *     summary: List transactions in the active community
 *     description: Community admins see all matching community transactions; other members see transactions on their invoices. Optionally filter by pool or pool slot.
 *     tags: [Transactions]
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
 *         name: invoiceId
 *         type: string
 *       - in: query
 *         name: invoiceIds
 *         type: array
 *         collectionFormat: csv
 *         items:
 *           type: string
 *       - in: query
 *         name: status
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: limit
 *         type: number
 *     responses:
 *       200:
 *         description: Transactions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Transactions'
 */

/**
 * @swagger
 * /transactions/me:
 *   get:
 *     summary: List transactions for the authenticated user
 *     description: Returns transactions associated with the user's invoices across all communities, pools, and pool slots.
 *     tags: [Transactions]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: query
 *         name: status
 *         type: string
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: limit
 *         type: number
 *     responses:
 *       200:
 *         description: User transactions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Transactions'
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a transaction
 *     description: Only community admins, the invoice sender, and the invoice receiver can view it.
 *     tags: [Transactions]
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
 *         description: Transaction retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Transaction'
 */

/**
 * @swagger
 * /transactions/{id}/decision:
 *   post:
 *     summary: Approve or reject a transaction
 *     description: Only the invoice receiver can decide a pending-approval transaction. Rejections require a reason.
 *     tags: [Transactions]
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
 *             $ref: '#/components/schemas/TransactionDecisionInput'
 *     responses:
 *       200:
 *         description: Transaction decision saved
 */
