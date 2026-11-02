jest.mock('../../config/db', () => ({ pool: { query: jest.fn() } }))
const { pool } = require('../../config/db')
const Upload = require('../../models/uploadModel')

beforeEach(() => jest.clearAllMocks())

describe('uploadModel', () => {
    test('selectAttraction retourne les URLs des images', async () => {
        const images = [{ id_attraction: 3, img_attraction: 'card', imgbg_attraction: 'bg' }]
        pool.query.mockResolvedValue({ rows: images })
        await expect(Upload.selectAttraction(3)).resolves.toEqual(images)
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_attraction = $1'), [3])
    })

    test('selectPark retourne un tableau vide si le parc est absent', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Upload.selectPark(55)).resolves.toEqual([])
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_park = $1'), [55])
    })

    test('updateParkDb retourne un objet, pas un tableau', async () => {
        pool.query.mockResolvedValue({ rows: [{ id_park: 3, img_park: 'card' }] })
        await expect(Upload.updateParkDb('card', 'bg', 3)).resolves.toEqual({ id_park: 3, img_park: 'card' })
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE park'), ['card', 'bg', 3])
    })

    test('updateAttractionDb retourne null quand id absent', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(Upload.updateAttractionDb('card', 'bg', 99)).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE attraction'), ['card', 'bg', 99])
    })
})
