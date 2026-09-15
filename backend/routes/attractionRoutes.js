const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')

const { getAttraction } = require('../controllers/attractionController')
const { updateAttractionImage } = require('../controllers/uploadController')

router.patch('/:id/image', upload.single('image'), updateAttractionImage)
router.get('/', getAttraction)

module.exports = router