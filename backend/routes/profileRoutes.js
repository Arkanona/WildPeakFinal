// const express = require('express')
// const router = express.Router()

// router.get('/', (req, res) => {
//     res.status(200).json({
//         message: 'Route profil fonctionne'
//     })
// })

// module.exports = router
const express = require('express')
const router = express.Router()

const favoriteController = require('../controllers/favoriteController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, favoriteController.getFavorites)
router.post('/:idAttraction', authMiddleware, favoriteController.addFavorite)
router.delete('/:idAttraction', authMiddleware, favoriteController.removeFavorite)

module.exports = router