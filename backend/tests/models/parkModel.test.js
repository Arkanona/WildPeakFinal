jest.mock('../../config/db', () => ({ pool: { query: jest.fn() } }))
const { pool } = require('../../config/db')
const Park = require('../../models/parkModel')

beforeEach(() => jest.clearAllMocks())

const data = {
    name_park: 'Europa-Park', slug_park: 'europa-park', country_park: 'Allemagne',
    place_park: 'Rust', opening_year_park: 1975, description_park: 'Parc européen'
}

describe('parkModel', () => {
    test('findAllPark retourne les lignes dans l’ordre prévu', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_park: 1 }] })
        await expect(Park.findAllPark()).resolves.toEqual([{ id_park: 1 }])
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM park ORDER BY id_park')
    })

    test('findParkById retourne null si absent', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Park.findParkById(123)).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_park = $1'), [123])
    })

    test('addPark transmet les six paramètres dans l’ordre SQL', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_park: 4, ...data }] })
        await expect(Park.addPark(data)).resolves.toMatchObject({ id_park: 4 })
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO park'),
            ['Europa-Park', 'europa-park', 'Allemagne', 'Rust', 1975, 'Parc européen']
        )
    })

    test('updatePark retourne null si le parc est absent', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Park.updatePark(4, data)).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_park = $7'), [...Object.values(data), 4])
    })

    test('countAttractions renvoie un nombre', async () => {
        pool.query.mockResolvedValue({ rows: [{ total: 2 }] })
        await expect(Park.countAttractions(4)).resolves.toBe(2)
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('COUNT(*)::integer'), [4])
    })

    test('deletePark retourne le parc supprimé ou null', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id_park: 4 }] }).mockResolvedValueOnce({ rows: [] })
        await expect(Park.deletePark(4)).resolves.toEqual({ id_park: 4 })
        await expect(Park.deletePark(99)).resolves.toBeNull()
        expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining('DELETE FROM park'), [4])
    })
})
