const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const { addAttraction, deleteAttraction, updateAttraction } = require('../controllers/attractionController')
const router = express.Router()

router.post('/', authMiddleware, adminMiddleware, upload.single("image"), addAttraction)
router.patch('/:id', authMiddleware, adminMiddleware, upload.single("image"), updateAttraction)
router.delete('/:id', authMiddleware, adminMiddleware, deleteAttraction)

module.exports = router