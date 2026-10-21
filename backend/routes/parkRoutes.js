const express = require('express')
const router = express.Router()

const { getParks } = require('../controllers/parkController')

router.get('/', getParks)

module.exports = router