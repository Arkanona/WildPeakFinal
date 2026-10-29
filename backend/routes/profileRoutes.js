const express = require('express')
const router = express.Router()

const favoriteController = require('../controllers/favoriteController')
const { deleteAccount } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

router.delete('/account', authMiddleware, deleteAccount)
router.get('/', authMiddleware, favoriteController.getFavorites)
router.post('/:idAttraction', authMiddleware, favoriteController.addFavorite)
router.delete('/:idAttraction', authMiddleware, favoriteController.removeFavorite)


module.exports = router