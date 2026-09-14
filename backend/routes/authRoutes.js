const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

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
router.post('/register', register)
router.post('/login', login)

module.exports = router