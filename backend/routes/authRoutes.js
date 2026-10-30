const express = require('express')
const router = express.Router()
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController')
const validate = require('../middlewares/validateMiddleware')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../schemas/authSchemas')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword)

module.exports = router