// Les dépendances externes sont simulées : aucune image ni aucun bucket réel n'est utilisé.
jest.mock('sharp', () => jest.fn(() => ({
    rotate: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('image-webp'))
})))
jest.mock('../../models/uploadModel', () => ({
    selectPark: jest.fn(), updateParkDb: jest.fn()
}))
jest.mock('../../config/supabase', () => ({
    storage: {
        from: jest.fn()
    }
}))

const sharp = require('sharp')
const Upload = require('../../models/uploadModel')
const supabase = require('../../config/supabase')
const Controller = require('../../controllers/uploadController')

const storage = {
    upload: jest.fn(), remove: jest.fn(), getPublicUrl: jest.fn()
}

beforeEach(() => {
    jest.clearAllMocks()
    storage.upload.mockResolvedValue({ error: null })
    storage.remove.mockResolvedValue({ error: null })
    storage.getPublicUrl.mockImplementation(path => ({
        data: { publicUrl: `https://example.supabase.co/storage/v1/object/public/wildpeak/${path}` }
    }))
    supabase.storage.from.mockReturnValue(storage)
})

describe('uploadController', () => {
    test('createParkImages sans fichier retourne des URLs nulles', async () => {
        await expect(Controller.createParkImages(null, 5)).resolves.toEqual({
            cardImageUrl: null, backgroundImageUrl: null
        })
        expect(sharp).not.toHaveBeenCalled()
    })

    test('createAttractionImages génère deux formats et les envoie', async () => {
        const result = await Controller.createAttractionImages({ buffer: Buffer.from('fichier') }, 5)
        expect(sharp).toHaveBeenCalledTimes(2)
        expect(storage.upload).toHaveBeenCalledTimes(2)
        expect(storage.upload.mock.calls[0][0]).toMatch(/^attractions\/5-\d+-card\.webp$/)
        expect(storage.upload.mock.calls[1][0]).toMatch(/^attractions\/5-\d+-background\.webp$/)
        expect(result.cardImageUrl).toContain('/wildpeak/attractions/5-')
        expect(result.backgroundImageUrl).toContain('background.webp')
    })

    test('createParkImages utilise le dossier parks', async () => {
        await Controller.createParkImages({ buffer: Buffer.from('fichier') }, 3)
        expect(storage.upload.mock.calls[0][0]).toMatch(/^parks\/3-\d+-card\.webp$/)
    })

    test('en cas d’échec du second upload, supprime la première image', async () => {
        storage.upload.mockResolvedValueOnce({ error: null })
            .mockResolvedValueOnce({ error: new Error('upload background') })
        await expect(Controller.createAttractionImages({ buffer: Buffer.from('fichier') }, 5))
            .rejects.toThrow('upload background')
        expect(storage.remove).toHaveBeenCalledWith([expect.stringMatching(/^attractions\/5-\d+-card\.webp$/)])
    })

    test('deleteOldImages ignore les URLs hors bucket et retire les valides', async () => {
        const url = 'https://example.supabase.co/storage/v1/object/public/wildpeak/parks/3-card.webp'
        await Controller.deleteOldImages([null, 'https://exemple.org/image.png', url])
        expect(storage.remove).toHaveBeenCalledWith(['parks/3-card.webp'])
    })

    test('updateParkImage retourne 400 sans fichier', async () => {
        const req = { params: { id: '3' } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        await Controller.updateParkImage(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(Upload.selectPark).not.toHaveBeenCalled()
    })

    test('updateParkImage retourne 404 si le parc est absent', async () => {
        const req = { params: { id: '3' }, file: { buffer: Buffer.from('image') } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        Upload.selectPark.mockResolvedValue([])
        await Controller.updateParkImage(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
    })

    test('updateParkImage modifie la base et supprime les anciennes URLs', async () => {
        const req = { params: { id: '3' }, file: { buffer: Buffer.from('image') } }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        Upload.selectPark.mockResolvedValue([{
            id_park: 3,
            img_park: 'https://example.supabase.co/storage/v1/object/public/wildpeak/parks/old.webp',
            imgbg_park: 'https://example.supabase.co/storage/v1/object/public/wildpeak/parks/old-bg.webp'
        }])
        Upload.updateParkDb.mockResolvedValue({ id_park: 3 })
        await Controller.updateParkImage(req, res)
        expect(Upload.updateParkDb).toHaveBeenCalledWith(expect.stringContaining('card.webp'), expect.stringContaining('background.webp'), '3')
        expect(storage.remove).toHaveBeenCalledWith(['parks/old.webp', 'parks/old-bg.webp'])
        expect(res.status).toHaveBeenCalledWith(200)
    })
})
