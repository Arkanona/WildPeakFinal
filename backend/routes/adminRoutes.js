const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const { addAttraction, deleteAttraction, updateAttraction } = require('../controllers/attractionController')
const { addPark, updatePark, deletePark } = require('../controllers/parkController')

const router = express.Router()

// Routes admin attractions
router.post('/attractions/', authMiddleware, adminMiddleware, upload.single("image"), addAttraction)
router.patch('/attractions/:id', authMiddleware, adminMiddleware, upload.single("image"), updateAttraction)
router.delete('/attractions/:id', authMiddleware, adminMiddleware, deleteAttraction)

// Routes admin parcs
router.post('/parcs', authMiddleware, adminMiddleware, upload.single("image"), addPark)
router.patch('/parcs/:id', authMiddleware, adminMiddleware, upload.single("image"), updatePark)
router.delete('/parcs/:id', authMiddleware, adminMiddleware, deletePark)

module.exports = router