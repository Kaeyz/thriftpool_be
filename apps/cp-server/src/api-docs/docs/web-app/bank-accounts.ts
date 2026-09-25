/**
 * @swagger
 * tags:
 *   name: Bank Accounts
 *   description: API endpoints for bank accounts
 */

/**
 * @swagger
 * /bank-accounts/me:
 *   get:
 *     summary: Get LoggedInUser bank accounts
 *     tags: [Bank Accounts]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: number
 *       - in: query
 *         name: page
 *         type: number
 *       - in: query
 *         name: sortKey
 *         type: string
 *         example: accountNumber
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
 *               $ref: '#/components/schemas/BankAccounts'
 */

/**
 * @swagger
 * /bank-accounts:
 *   post:
 *     summary: Create new bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/BankAccountInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/BankAccount'
 */

/**
 * @swagger
 * /bank-accounts/{id}:
 *   put:
 *     summary: User responds to pending invites
 *     tags: [Bank Accounts]
 *     security:
 *       - AuthToken: []
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
 *             $ref: '#/components/schemas/BankAccountInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/BankAccount'
 */
