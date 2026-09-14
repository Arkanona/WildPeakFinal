const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')

const { getParks } = require('../controllers/parkController')
const { updateParkImage } = require('../controllers/uploadController')

router.patch('/:id/image', upload.single('image'), updateParkImage)
router.get('/', getParks)

module.exports = router