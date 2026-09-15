/**
 * @swagger
 * tags:
 *   name: Utils
 *   description: API endpoints for utils
 */

/**
 * @swagger
 * /utils/schema:
 *   get:
 *     summary: Get api schema definitions
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/HttpRes'
 */

/**
 * @swagger
 * /utils/upload:
 *   get:
 *     summary: Get file upload config options
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/HttpRes'
 */

/**
 * @swagger
 * /utils/currencies:
 *   get:
 *     summary: Get currencies
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Currencies'
 */

/**
 * @swagger
 * /utils/upload:
 *   post:
 *     summary: Upload file and images to the application
 *     tags: [Utils]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/FileUploadInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/HttpRes'
 */
