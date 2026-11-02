
jest.mock('multer', () => {
    const multer = jest.fn(options => ({ options }))
    multer.memoryStorage = jest.fn(() => ({ kind: 'memory' }))
    return multer
})

const multer = require('multer')
const upload = require('../../middlewares/uploadMiddleware')

describe('uploadMiddleware', () => {
    test('utilise un stockage en mémoire et une limite de 6 Mo', () => {
        expect(upload.options.storage).toEqual({ kind: 'memory' })
        expect(upload.options.limits.fileSize).toBe(6 * 1024 * 1024)
    })

    test.each(['image/jpeg', 'image/png', 'image/webp'])(
        'accepte le format %s', mimetype => {
            const cb = jest.fn()
            upload.options.fileFilter({}, { mimetype }, cb)
            expect(cb).toHaveBeenCalledWith(null, true)
        }
    )

    test('refuse les fichiers de type non autorisé', () => {
        const cb = jest.fn()
        upload.options.fileFilter({}, { mimetype: 'application/pdf' }, cb)
        expect(cb).toHaveBeenCalledWith(expect.any(Error))
    })
})
