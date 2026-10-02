const express = require('express')
const router = express.Router()

router.post('/contact', contactController.sendMessage)


module.exports = router