const router = require('express').Router()
const passport = require('passport')
const { register, login } = require('../controller/adminController')



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: admin authentication and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Admin ID
 *           example: 787674563782983746578439
 *         firstName:
 *           type: string
 *           description: Admin first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: Admin last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: Admin email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           description: Admin password (hashed)
 *           example: $2b$10$hashedpasswordhere
 */

/**
 * @swagger
 * /api/v1/admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin registration
 *     description: Create a new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: account created
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 */
router.post('/register', register)


/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin login
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login successfully
 *                 token:
 *                   type: string
 *                   example: jwt.token.here
 */
router.post('/login', login)


/**
 * @swagger
 * /api/v1/admin/googleAuth:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google authentication
 *     description: Redirects user to Google OAuth login
 *     responses:
 *       302:
 *         description: Redirect to Google auth page
 */
router.get('/googleAuth', passport.authenticate("google", {scope: ["profile", "email"]}))


/**
 * @swagger
 * /api/v1/admin/googleLogin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login callback
 *     description: Handles Google OAuth callback
 *     responses:
 *       200:
 *         description: login success redirect or failure redirect
 */
router.get('/googleLogin', passport.authenticate("google", {successRedirect: "/api/user/success", failureRedirect: "/api/user/failed"}))

/**
 * @swagger
 * /api/v1/admin/success:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login success
 *     description: Returns logged-in Google user data
 *     responses:
 *       200:
 *         description: login successful
 */
router.get('/success', (req, res)=>{
    res.json({
        message: "login successful",
        data: req.user
    })
})

/**
 * @swagger
 * /api/v1/admin/failed:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login failed
 *     description: Returns failure message
 *     responses:
 *       200:
 *         description: login failed
 */
router.get('/failed', (req, res)=>{
    res.json({
        message: "login Failed"
    })
})

module.exports = router

