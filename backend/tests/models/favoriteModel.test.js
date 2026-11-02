jest.mock('../../config/db', () => ({ pool: { query: jest.fn() } }))
const { pool } = require('../../config/db')
const Favorite = require('../../models/favoriteModel')

beforeEach(() => jest.clearAllMocks())

describe('favoriteModel', () => {
    test('getFavorites retourne les attractions via la jointure', async () => {
        const rows = [{ id_attraction: 5, name_attraction: 'Blue Fire' }]
        pool.query.mockResolvedValue({ rows })
        await expect(Favorite.getFavorites(2)).resolves.toEqual(rows)
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('JOIN attraction a'), [2])
    })

    test('addFavorite évite les doublons en retournant null', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Favorite.addFavorite(2, '5')).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT (id_user, id_attraction)'), [2, '5'])
    })

    test('removeFavorite renvoie le favori supprimé', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_favorite: 8 }] })
        await expect(Favorite.removeFavorite(2, '5')).resolves.toEqual({ id_favorite: 8 })
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM favorites'), [2, '5'])
    })
})
