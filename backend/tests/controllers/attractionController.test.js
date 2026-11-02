jest.mock('../../models/uploadModel', () => ({
    selectAttraction: jest.fn(), updateAttractionDb: jest.fn()
}))
jest.mock('../../models/attractionModel', () => ({
    findAllAttraction: jest.fn(), addAttraction: jest.fn(),
    updateAttraction: jest.fn(), deleteAttraction: jest.fn()
}))
jest.mock('../../models/parkModel', () => ({ findParkById: jest.fn() }))
jest.mock('../../controllers/uploadController', () => ({
    createAttractionImages: jest.fn(), deleteOldImages: jest.fn()
}))

const Upload = require('../../models/uploadModel')
const Attraction = require('../../models/attractionModel')
const Park = require('../../models/parkModel')
const { createAttractionImages, deleteOldImages } = require('../../controllers/uploadController')
const Controller = require('../../controllers/attractionController')

let req, res
beforeEach(() => {
    jest.clearAllMocks()
    req = {
        params: { id: '5' },
        body: {
            name_attraction: 'Blue Fire', id_park: '1', type_attraction: 'Coaster',
            speed_max_kmh_attraction: '100', height_m_attraction: '',
            length_m_attraction: '1056', duration_min_attraction: '2.5',
            inversion_attraction: '4', minimum_height_cm_attraction: '130',
            opening_year_attraction: '2009', description_attraction: 'Description',
            parc_zone_attraction: 'Islande', intensity_level_attraction: 'Forte',
            family_friendly_attraction: 'false', short_description_attraction: 'Rapide'
        }
    }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    Park.findParkById.mockResolvedValue({ id_park: 1, name_park: 'Europa-Park' })
    jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => jest.restoreAllMocks())

describe('attractionController', () => {
    test('getAttraction renvoie la liste 200', async () => {
        Attraction.findAllAttraction.mockResolvedValue([{ id_attraction: 5 }])
        await Controller.getAttraction(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([{ id_attraction: 5 }])
    })

    test('getAttraction renvoie 500 en cas d’erreur SQL', async () => {
        Attraction.findAllAttraction.mockRejectedValue(new Error('SQL'))
        await Controller.getAttraction(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
    })

    test('addAttraction génère le slug, le texte alt et le booléen', async () => {
        Attraction.addAttraction.mockResolvedValue({ id_attraction: 5 })
        await Controller.addAttraction(req, res)
        expect(Attraction.addAttraction).toHaveBeenCalledWith(expect.objectContaining({
            slug_attraction: 'blue-fire',
            alt_attraction: "Vue de l'attraction Blue Fire à Europa-Park",
            family_friendly_attraction: false
        }))
        expect(res.status).toHaveBeenCalledWith(201)
    })

    test('addAttraction avec une image retourne l’objet actualisé', async () => {
        req.file = { buffer: Buffer.from('image-test') }
        Attraction.addAttraction.mockResolvedValue({ id_attraction: 5 })
        createAttractionImages.mockResolvedValue({ cardImageUrl: 'card', backgroundImageUrl: 'bg' })
        Upload.updateAttractionDb.mockResolvedValue({ id_attraction: 5, img_attraction: 'card' })
        await Controller.addAttraction(req, res)
        expect(Upload.updateAttractionDb).toHaveBeenCalledWith('card', 'bg', 5)
        // Ce test suppose que le [0] a bien été supprimé dans le controller.
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            attraction: { id_attraction: 5, img_attraction: 'card' }
        }))
    })

    test('updateAttraction répond 404 si l’attraction est absente', async () => {
        Upload.selectAttraction.mockResolvedValue([])
        await Controller.updateAttraction(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(Attraction.updateAttraction).not.toHaveBeenCalled()
    })

    test('updateAttraction transforme les valeurs en nombres ou null', async () => {
        Upload.selectAttraction.mockResolvedValue([{ id_attraction: 5 }])
        Attraction.updateAttraction.mockResolvedValue({ id_attraction: 5 })
        await Controller.updateAttraction(req, res)
        expect(Attraction.updateAttraction).toHaveBeenCalledWith('5', expect.objectContaining({
            id_park: 1, speed_max_kmh_attraction: 100,
            height_m_attraction: null, duration_min_attraction: 2.5,
            inversion_attraction: 4, family_friendly_attraction: false
        }))
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('updateAttraction avec image sauvegarde les URLs et nettoie les anciennes', async () => {
        req.file = { buffer: Buffer.from('image-test') }
        Upload.selectAttraction.mockResolvedValue([{
            id_attraction: 5, img_attraction: 'ancienne-card', imgbg_attraction: 'ancien-bg'
        }])
        Attraction.updateAttraction.mockResolvedValue({ id_attraction: 5 })
        createAttractionImages.mockResolvedValue({ cardImageUrl: 'nouvelle-card', backgroundImageUrl: 'nouveau-bg' })
        Upload.updateAttractionDb.mockResolvedValue({ id_attraction: 5, img_attraction: 'nouvelle-card' })
        await Controller.updateAttraction(req, res)
        expect(deleteOldImages).toHaveBeenCalledWith(['ancienne-card', 'ancien-bg'])
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            attraction: { id_attraction: 5, img_attraction: 'nouvelle-card' }
        }))
    })

    test('deleteAttraction répond 404 si id inconnu', async () => {
        Attraction.deleteAttraction.mockResolvedValue(null)
        await Controller.deleteAttraction(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
    })

    test('deleteAttraction retourne 200 avec l’attraction supprimée', async () => {
        Attraction.deleteAttraction.mockResolvedValue({ id_attraction: 5 })
        await Controller.deleteAttraction(req, res)
        expect(Attraction.deleteAttraction).toHaveBeenCalledWith('5')
        expect(res.json).toHaveBeenCalledWith({
            title: 'Attraction supprimée', status: 200, attraction: { id_attraction: 5 }
        })
    })
})
