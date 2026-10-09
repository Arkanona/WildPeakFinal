const express = require('express')
const router = express.Router()
const { sendMessage } = require('../controllers/contactController')
const validate = require('../middlewares/validateMiddleware')
const { sendMessageSchema } = require('../schemas/contactSchemas')

router.post('/', validate(sendMessageSchema), sendMessage)


module.exports = router