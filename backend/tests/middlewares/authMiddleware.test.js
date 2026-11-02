
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}))

jest.mock('../../models/userModel', () => ({
    findUserById: jest.fn()
}))

const jwt = require('jsonwebtoken')
const User = require('../../models/userModel')
const authMiddleware = require('../../middlewares/authMiddleware')

describe('AuthMiddleware', () => {
    let req
    let res
    let next

    beforeEach(() => {
        req = {
            headers: {}
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        next = jest.fn()
    })

    test('refuse une requête sans token', async () => {
        await authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Pas autorisé, token manquant',
            status: 401
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('autorise un utilisateur avec un JWT valide', async () => {
        const user = {
            id_user: 1,
            name_user: 'Test',
            role_user: 'user'
        }

        req.headers.authorization = 'Bearer token-valide'

        jwt.verify.mockReturnValue({ id: 1 })
        User.findUserById.mockResolvedValue(user)

        await authMiddleware(req, res, next)

        expect(jwt.verify).toHaveBeenCalled()
        expect(req.user).toEqual(user)
        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
    })

    test('refuse un utilisateur introuvable', async () => {
        req.headers.authorization = 'Bearer token-valide'

        jwt.verify.mockReturnValue({ id: 999 })
        User.findUserById.mockResolvedValue(null)

        await authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Utilisateur introuvable',
            status: 401
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('refuse un token JWT invalide', async () => {
        req.headers.authorization = 'Bearer token-invalide'

        jwt.verify.mockImplementation(() => {
            throw new Error('invalid signature')
        })

        await authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Pas autorisé, token invalide',
            status: 401,
            error: 'invalid signature'
        })
        expect(next).not.toHaveBeenCalled()
    })
})
