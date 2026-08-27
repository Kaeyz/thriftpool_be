/**
 * @swagger
 * tags:
 *   name: Org
 *   description: API endpoints for organization
 */

/**
 * @swagger
 * /orgs:
 *   post:
 *     summary: Create Organization
 *     tags: [Org]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/OrgInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/OrgApiRes'
 */

/**
 * @swagger
 * /orgs/{id}:
 *   get:
 *     summary: Get  Organization
 *     tags: [Org]
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/OrgApiRes'
 */

/**
 * @swagger
 * /orgs/{id}:
 *   put:
 *     summary: Update  Organization
 *     tags: [Org]
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/OrgInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/OrgApiRes'
 */
