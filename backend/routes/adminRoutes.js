const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const router = express.Router()

router.post('/', authMiddleware, adminMiddleware)

module.exports = router