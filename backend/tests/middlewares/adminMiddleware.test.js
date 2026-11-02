const adminMiddleware = require('../../middlewares/adminMiddleware')

describe('adminMiddleware', () => {
    let res, next
    beforeEach(() => {
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    test('401 si req.user est absent', () => {
        adminMiddleware({}, res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    test('403 si utilisateur non administrateur', () => {
        adminMiddleware({ user: { role_user: 'user' } }, res, next)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(next).not.toHaveBeenCalled()
    })

    test('autorise le rôle admin', () => {
        adminMiddleware({ user: { role_user: 'admin' } }, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
    })
})
