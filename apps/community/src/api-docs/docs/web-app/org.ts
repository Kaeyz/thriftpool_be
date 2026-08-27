/**
 * @swagger
 * tags:
 *   name: Org
 *   description: API endpoints for organization
 */

/**
 * @swagger
 * /orgs/platform-org:
 *   get:
 *     summary: Get Account Platform Organization
 *     tags: [Org]
 *     security:
 *       - AuthToken: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/OrgApiRes'
 */
