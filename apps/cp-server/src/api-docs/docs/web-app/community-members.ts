/**
 * @swagger
 * tags:
 *   name: Community Members
 *   description: API endpoints for community members and invites
 */

/**
 * @swagger
 * /community-members/me:
 *   get:
 *     summary: Get LoggedInUser Memberships and invites
 *     tags: [Community Members]
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
 *               $ref: '#/components/schemas/CommunityMembers'
 */

/**
 * @swagger
 * /community-members:
 *   get:
 *     summary: Get all Community members and invites
 *     tags: [Community Members]
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
 *               $ref: '#/components/schemas/CommunityMembers'
 */

/**
 * @swagger
 * /community-members/send-invite:
 *   post:
 *     summary: Send Invite to new Member
 *     tags: [Community Members]
 *     security:
 *       - AuthToken: []
 *       - MinistryKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/InviteMemberInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityMember'
 */

/**
 * @swagger
 * /community-members/pending-decision:
 *   put:
 *     summary: User responds to pending invites
 *     tags: [Community Members]
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
 *               $ref: '#/components/schemas/CommunityMember'
 */

/**
 * @swagger
 * /community-members/{memberId}/set-role:
 *   put:
 *     summary: Update accepted member role
 *     tags: [Community Members]
 *     security:
 *       - AuthToken: []
 *       - MinistryKey: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/CommunityRoleUpdateInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityMember'
 */

/**
 * @swagger
 * /community-members/{memberId}/suspend:
 *   put:
 *     summary: Suspend accepted member role
 *     tags: [Community Members]
 *     security:
 *       - AuthToken: []
 *       - MinistryKey: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityMember'
 */

/**
 * @swagger
 * /community-members/{memberId}/unsuspend:
 *   put:
 *     summary: unSuspend accepted member role
 *     tags: [Community Members]
 *     security:
 *       - AuthToken: []
 *       - MinistryKey: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/CommunityMember'
 */
