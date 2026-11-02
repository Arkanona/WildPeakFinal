
jest.mock('../../models/favoriteModel', () => ({
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn()
}))

const Favorite = require('../../models/favoriteModel')

const {
    getFavorites,
    addFavorite,
    removeFavorite
} = require('../../controllers/favoriteController')

describe('FavoriteController', () => {
    let req
    let res

    beforeEach(() => {
        req = {
            user: { id_user: 1 },
            params: { idAttraction: '5' }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('getFavorites', () => {

        test('retourne les favoris de l’utilisateur', async () => {
            const favorites = [
                { id_attraction: 5, name_attraction: 'Blue Fire' }
            ]

            Favorite.getFavorites.mockResolvedValue(favorites)

            await getFavorites(req, res)

            expect(Favorite.getFavorites).toHaveBeenCalledWith(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(favorites)
        })

        test('retourne une erreur 500 si la récupération échoue', async () => {
            Favorite.getFavorites.mockRejectedValue(
                new Error('Erreur PostgreSQL')
            )

            await getFavorites(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Erreur lors de la récupération des favoris',
                status: 500
            })
        })
    })

    describe('addFavorite', () => {

        test('ajoute une attraction aux favoris', async () => {
            const favorite = {
                id_favorite: 1,
                id_user: 1,
                id_attraction: 5
            }

            Favorite.addFavorite.mockResolvedValue(favorite)

            await addFavorite(req, res)

            expect(Favorite.addFavorite).toHaveBeenCalledWith(1, '5')
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Attraction ajoutée aux favoris',
                status: 201,
                favorite
            })
        })

        test('retourne null si le favori existe déjà', async () => {
            Favorite.addFavorite.mockResolvedValue(null)

            await addFavorite(req, res)

            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Attraction ajoutée aux favoris',
                status: 201,
                favorite: null
            })
        })

        test('retourne une erreur 500 si l’ajout échoue', async () => {
            Favorite.addFavorite.mockRejectedValue(
                new Error('Erreur PostgreSQL')
            )

            await addFavorite(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
        })
    })

    describe('removeFavorite', () => {

        test('supprime une attraction des favoris', async () => {
            const favorite = {
                id_favorite: 1,
                id_user: 1,
                id_attraction: 5
            }

            Favorite.removeFavorite.mockResolvedValue(favorite)

            await removeFavorite(req, res)

            expect(Favorite.removeFavorite).toHaveBeenCalledWith(1, '5')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Attraction supprimée des favoris',
                status: 200,
                favorite
            })
        })

        test('retourne null si le favori est inexistant', async () => {
            Favorite.removeFavorite.mockResolvedValue(null)

            await removeFavorite(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Attraction supprimée des favoris',
                status: 200,
                favorite: null
            })
        })

        test('retourne une erreur 500 si la suppression échoue', async () => {
            Favorite.removeFavorite.mockRejectedValue(
                new Error('Erreur PostgreSQL')
            )

            await removeFavorite(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
        })
    })
})
