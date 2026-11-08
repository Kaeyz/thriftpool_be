/**
 * @swagger
 * tags:
 *   name: Bank Account History
 *   description: Platform transaction records for registered external bank accounts
 */

/**
 * @swagger
 * /bank-account-histories:
 *   get:
 *     summary: List history for a registered bank account
 *     description: bankAccountId is required, and the account must belong to the authenticated user.
 *     tags: [Bank Account History]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: query
 *         name: bankAccountId
 *         type: string
 *         required: true
 *       - in: query
 *         name: transactionId
 *         type: string
 *       - in: query
 *         name: type
 *         type: string
 *         example: inflow|outflow
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: limit
 *         type: number
 *     responses:
 *       200:
 *         description: Bank account history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/BankAccountHistories'
 */
