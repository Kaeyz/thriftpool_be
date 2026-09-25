/**
 * @swagger
 * tags:
 *   name: Community Invites
 *   description: API endpoints for community invites
 */

/**
 * @swagger
 * /community-invites/me:
 *   get:
 *     summary: Get LoggedInUser invites
 *     tags: [Community Invites]
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
 *         example: name|createdAt
 *       - in: query
 *         name: sortDir
 *         type: string
 *         example: asc|desc
 *       - in: query
 *         name: status
 *         type: string
 *         example: pending|accepted
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityInvites'
 */

/**
 * @swagger
 * /community-invites:
 *   get:
 *     summary: Get all Community invites
 *     tags: [Community Invites]
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
 *         example: name|createdAt
 *       - in: query
 *         name: sortDir
 *         type: string
 *         example: asc|desc
 *       - in: query
 *         name: status
 *         type: string
 *         example: pending|accepted|rejected|suspended|removed|left
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityInvites'
 */

/**
 * @swagger
 * /community-invites:
 *   post:
 *     summary: Send new Invite
 *     tags: [Community Invites]
 *     security:
 *       - AuthToken: []
 *       - CommunityKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CommunityInviteInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityInvite'
 */

/**
 * @swagger
 * /community-invites/pending-decision:
 *   put:
 *     summary: User responds to pending invites
 *     tags: [Community Invites]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CommunityPendingInviteInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityInvite'
 */
