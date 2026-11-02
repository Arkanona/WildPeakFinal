jest.mock('../../config/db', () => ({ pool: { query: jest.fn() } }))
const { pool } = require('../../config/db')
const Attraction = require('../../models/attractionModel')

beforeEach(() => jest.clearAllMocks())

const data = {
    name_attraction: 'Blue Fire', slug_attraction: 'blue-fire', id_park: 1,
    type_attraction: 'Coaster', alt_attraction: 'Vue Blue Fire',
    parc_zone_attraction: 'Islande', intensity_level_attraction: 'Forte',
    family_friendly_attraction: false, short_description_attraction: 'Rapide',
    speed_max_kmh_attraction: 100, height_m_attraction: 38,
    length_m_attraction: 1056, duration_min_attraction: 2.5,
    inversion_attraction: 4, minimum_height_cm_attraction: 130,
    opening_year_attraction: 2009, description_attraction: 'Montagnes russes'
}

describe('attractionModel', () => {
    test('findAllAttraction retourne les lignes triées par id', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_attraction: 1 }] })
        await expect(Attraction.findAllAttraction()).resolves.toEqual([{ id_attraction: 1 }])
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM attraction ORDER BY id_attraction')
    })

    test('addAttraction passe les 17 paramètres à PostgreSQL', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_attraction: 5 }] })
        await expect(Attraction.addAttraction(data)).resolves.toEqual({ id_attraction: 5 })
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO attraction'), Object.values(data))
        expect(pool.query.mock.calls[0][1]).toHaveLength(17)
    })

    test('updateAttraction respecte l’ordre de ses 18 paramètres', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_attraction: 5 }] })
        await expect(Attraction.updateAttraction(5, data)).resolves.toEqual({ id_attraction: 5 })
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_attraction = $18'), [
            data.name_attraction, data.slug_attraction, data.alt_attraction,
            data.id_park, data.type_attraction, data.speed_max_kmh_attraction,
            data.height_m_attraction, data.length_m_attraction, data.duration_min_attraction,
            data.inversion_attraction, data.minimum_height_cm_attraction,
            data.opening_year_attraction, data.description_attraction,
            data.parc_zone_attraction, data.intensity_level_attraction,
            data.family_friendly_attraction, data.short_description_attraction, 5
        ])
    })

    test('deleteAttraction retourne null si rien n’a été supprimé', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Attraction.deleteAttraction(5)).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM attraction'), [5])
    })
})
