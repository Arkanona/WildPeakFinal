const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const { addAttraction } = require('../controllers/attractionController')
const router = express.Router()

router.post('/', authMiddleware, adminMiddleware, upload.single("image"), addAttraction)

module.exports = router