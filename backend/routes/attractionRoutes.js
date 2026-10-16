const express = require('express')
const router = express.Router()

const { getAttraction } = require('../controllers/attractionController')

router.get('/', getAttraction)

module.exports = router