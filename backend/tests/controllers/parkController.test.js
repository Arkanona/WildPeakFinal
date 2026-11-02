jest.mock('../../models/parkModel', () => ({
    findAllPark: jest.fn(), addPark: jest.fn(), updatePark: jest.fn(),
    countAttractions: jest.fn(), deletePark: jest.fn()
}))
jest.mock('../../models/uploadModel', () => ({ updateParkDb: jest.fn() }))
jest.mock('../../controllers/uploadController', () => ({
    createParkImages: jest.fn(), deleteOldImages: jest.fn()
}))

const Park = require('../../models/parkModel')
const Upload = require('../../models/uploadModel')
const { createParkImages, deleteOldImages } = require('../../controllers/uploadController')
const Controller = require('../../controllers/parkController')

let req, res
beforeEach(() => {
    jest.clearAllMocks()
    req = { body: { name_park: 'Europa-Park', opening_year_park: '1975', country_park: 'Allemagne' }, params: { id: '4' } }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => jest.restoreAllMocks())

describe('parkController', () => {
    test('getParks renvoie la liste 200', async () => {
        Park.findAllPark.mockResolvedValue([{ id_park: 4 }])
        await Controller.getParks(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([{ id_park: 4 }])
    })

    test('getParks renvoie 500 si PostgreSQL échoue', async () => {
        Park.findAllPark.mockRejectedValue(new Error('SQL'))
        await Controller.getParks(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
    })

    test('addPark refuse un nom vide (400)', async () => {
        req.body.name_park = '  '
        await Controller.addPark(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(Park.addPark).not.toHaveBeenCalled()
    })

    test('addPark crée un slug et convertit l’année', async () => {
        Park.addPark.mockResolvedValue({ id_park: 4, name_park: 'Europa-Park' })
        await Controller.addPark(req, res)
        expect(Park.addPark).toHaveBeenCalledWith(expect.objectContaining({
            name_park: 'Europa-Park', slug_park: 'europa-park', opening_year_park: 1975
        }))
        expect(res.status).toHaveBeenCalledWith(201)
        expect(createParkImages).not.toHaveBeenCalled()
    })

    test('addPark sauvegarde les URLs lorsque l’image est envoyée', async () => {
        req.file = { buffer: Buffer.from('fichier-test') }
        Park.addPark.mockResolvedValue({ id_park: 4 })
        createParkImages.mockResolvedValue({ cardImageUrl: 'card', backgroundImageUrl: 'bg' })
        Upload.updateParkDb.mockResolvedValue({ id_park: 4, img_park: 'card' })
        await Controller.addPark(req, res)
        expect(createParkImages).toHaveBeenCalledWith(req.file, 4)
        expect(Upload.updateParkDb).toHaveBeenCalledWith('card', 'bg', 4)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ park: { id_park: 4, img_park: 'card' } }))
    })

    test('updatePark retourne 404 si le parc est inconnu', async () => {
        Park.updatePark.mockResolvedValue(null)
        await Controller.updatePark(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
    })

    test('updatePark remplace les images et tente de supprimer les anciennes', async () => {
        req.file = { buffer: Buffer.from('fichier-test') }
        Park.updatePark.mockResolvedValue({ id_park: 4, img_park: 'ancienne', imgbg_park: 'ancienne-bg' })
        createParkImages.mockResolvedValue({ cardImageUrl: 'nouvelle', backgroundImageUrl: 'nouvelle-bg' })
        Upload.updateParkDb.mockResolvedValue({ id_park: 4, img_park: 'nouvelle' })
        await Controller.updatePark(req, res)
        expect(deleteOldImages).toHaveBeenCalledWith(['ancienne', 'ancienne-bg'])
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('deletePark refuse un parc ayant encore des attractions', async () => {
        Park.countAttractions.mockResolvedValue(2)
        await Controller.deletePark(req, res)
        expect(res.status).toHaveBeenCalledWith(409)
        expect(Park.deletePark).not.toHaveBeenCalled()
    })

    test('deletePark supprime le parc et nettoie ses images', async () => {
        Park.countAttractions.mockResolvedValue(0)
        Park.deletePark.mockResolvedValue({ id_park: 4, img_park: 'card', imgbg_park: 'bg' })
        await Controller.deletePark(req, res)
        expect(deleteOldImages).toHaveBeenCalledWith(['card', 'bg'])
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('deletePark renvoie 404 si le parc est absent', async () => {
        Park.countAttractions.mockResolvedValue(0)
        Park.deletePark.mockResolvedValue(null)
        await Controller.deletePark(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
    })
})
