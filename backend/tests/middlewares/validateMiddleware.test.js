
const { z } = require('zod')
const validateBody = require('../../middlewares/validateMiddleware')

describe('ValidateMiddleware', () => {
    const schema = z.object({
        name: z.string().trim().min(2),
        email: z.email()
    }).strict()

    let req
    let res
    let next

    beforeEach(() => {
        req = {
            body: {}
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()
    })

    test('accepte des données valides', () => {
        req.body = {
            name: 'Enzo',
            email: 'test@example.com'
        }

        validateBody(schema)(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
    })

    test('retourne 422 si les données sont invalides', () => {
        req.body = {
            name: 'E',
            email: 'email-invalide'
        }

        validateBody(schema)(req, res, next)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Données invalides',
            status: 422,
            invalidParams: expect.arrayContaining([
                expect.objectContaining({ path: 'name' }),
                expect.objectContaining({ path: 'email' })
            ])
        })

        expect(next).not.toHaveBeenCalled()
    })

    test('remplace req.body par les données validées', () => {
        req.body = {
            name: '  Enzo  ',
            email: 'test@example.com'
        }

        validateBody(schema)(req, res, next)

        expect(req.body.name).toBe('Enzo')
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('refuse les champs supplémentaires', () => {
        req.body = {
            name: 'Enzo',
            email: 'test@example.com',
            role: 'admin'
        }

        validateBody(schema)(req, res, next)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(next).not.toHaveBeenCalled()
    })
})
