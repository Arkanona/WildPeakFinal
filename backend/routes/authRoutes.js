const express = require('express')
const router = express.Router()
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController')
const validate = require('../middlewares/validateMiddleware')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../schemas/authSchemas')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Superman
 *               email:
 *                 type: string
 *                 example: superman@pascher.com
 *               password:
 *                 type: string
 *                 example: password123HuHu
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword)

module.exports = router