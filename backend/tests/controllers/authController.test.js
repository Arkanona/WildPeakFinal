jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('jwt-test') }))
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn(), hash: jest.fn(), compare: jest.fn()
}))
jest.mock('../../models/userModel', () => ({
    createUser: jest.fn(), findUserByEmail: jest.fn(), findUserById: jest.fn(),
    saveResetToken: jest.fn(), findUserByResetToken: jest.fn(),
    updatePassword: jest.fn(), clearResetToken: jest.fn(), deleteUserAccount: jest.fn()
}))
jest.mock('../../services/mailService', () => ({ sendResetPasswordEmail: jest.fn() }))

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')
const { sendResetPasswordEmail } = require('../../services/mailService')
const Auth = require('../../controllers/authController')

const user = {
    id_user: 7, name_user: 'Test', email_user: 'test@mail.fr',
    role_user: 'user', pass_hash_user: 'hash-bdd'
}

let req, res
beforeEach(() => {
    jest.clearAllMocks()
    req = { body: { name: 'Test', email: 'test@mail.fr', password: 'Test123!' }, params: {}, user: user }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    jwt.sign.mockReturnValue('jwt-test')
    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hash-bdd')
    bcrypt.compare.mockResolvedValue(true)
})

describe('authController', () => {
    test('register retourne 201, hash le mot de passe et ne révèle pas son hash', async () => {
        User.findUserByEmail.mockResolvedValue(null)
        User.createUser.mockResolvedValue(user)
        await Auth.register(req, res)
        expect(bcrypt.hash).toHaveBeenCalledWith('Test123!', 'salt')
        expect(User.createUser).toHaveBeenCalledWith('Test', 'test@mail.fr', 'hash-bdd')
        expect(jwt.sign.mock.calls[0][0]).toEqual({ id: 7 })
        expect(jwt.sign.mock.calls[0][2]).toEqual({ expiresIn: '7d' })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            title: 'Utilisateur enregistré avec succès', status: 201,
            token: 'jwt-test', user: { id: 7, name: 'Test', email: 'test@mail.fr', role: 'user' }
        })
    })

    test('register refuse l’adresse déjà utilisée avec 409', async () => {
        User.findUserByEmail.mockResolvedValue(user)
        await Auth.register(req, res)
        expect(res.status).toHaveBeenCalledWith(409)
        expect(User.createUser).not.toHaveBeenCalled()
    })

    test('register retourne 500 si la base échoue', async () => {
        User.findUserByEmail.mockRejectedValue(new Error('SQL'))
        await Auth.register(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
    })

    test('login retourne 200 et un token si les identifiants sont bons', async () => {
        User.findUserByEmail.mockResolvedValue(user)
        await Auth.login(req, res)
        expect(bcrypt.compare).toHaveBeenCalledWith('Test123!', 'hash-bdd')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt-test', status: 200 }))
    })

    test('login retourne 401 si l’utilisateur est absent', async () => {
        User.findUserByEmail.mockResolvedValue(null)
        await Auth.login(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(bcrypt.compare).not.toHaveBeenCalled()
    })

    test('login retourne 401 si le mot de passe est incorrect', async () => {
        User.findUserByEmail.mockResolvedValue(user)
        bcrypt.compare.mockResolvedValue(false)
        await Auth.login(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(jwt.sign).not.toHaveBeenCalled()
    })

    test('forgotPassword ne divulgue pas l’existence d’un compte', async () => {
        User.findUserByEmail.mockResolvedValue(null)
        await Auth.forgotPassword(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(sendResetPasswordEmail).not.toHaveBeenCalled()
    })

    test('forgotPassword crée un hash de token et envoie le lien', async () => {
        const oldUrl = process.env.FRONTEND_URL
        process.env.FRONTEND_URL = 'http://localhost:5173'
        try {
            User.findUserByEmail.mockResolvedValue(user)
            User.saveResetToken.mockResolvedValue({ id_user: 7 })
            sendResetPasswordEmail.mockResolvedValue({ messageId: 'email-test' })
            await Auth.forgotPassword(req, res)
            expect(User.saveResetToken).toHaveBeenCalledWith(
                7, expect.stringMatching(/^[a-f0-9]{64}$/), expect.any(Date)
            )
            expect(sendResetPasswordEmail).toHaveBeenCalledWith(
                'test@mail.fr', expect.stringMatching(/^http:\/\/localhost:5173\/reinitialiser-mot-de-passe\/[a-f0-9]{64}$/)
            )
            expect(res.status).toHaveBeenCalledWith(200)
        } finally {
            if (oldUrl === undefined) delete process.env.FRONTEND_URL
            else process.env.FRONTEND_URL = oldUrl
        }
    })

    test('resetPassword refuse un lien expiré / inconnu', async () => {
        req.params.token = 'faux'
        User.findUserByResetToken.mockResolvedValue(undefined)
        await Auth.resetPassword(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(User.updatePassword).not.toHaveBeenCalled()
    })

    test('resetPassword change le hash et efface le token', async () => {
        req.params.token = 'token-valide'
        User.findUserByResetToken.mockResolvedValue(user)
        await Auth.resetPassword(req, res)
        expect(User.findUserByResetToken).toHaveBeenCalledWith(expect.stringMatching(/^[a-f0-9]{64}$/))
        expect(User.updatePassword).toHaveBeenCalledWith(7, 'hash-bdd')
        expect(User.clearResetToken).toHaveBeenCalledWith(7)
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('deleteAccount vérifie le mot de passe via une fonction callback', async () => {
        User.deleteUserAccount.mockImplementation(async (_id, verifyPassword) => {
            expect(await verifyPassword('hash-bdd')).toBe(true)
            return { success: true }
        })
        await Auth.deleteAccount(req, res)
        expect(User.deleteUserAccount).toHaveBeenCalledWith(7, expect.any(Function))
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test.each([
        ['USER_NOT_FOUND', 404],
        ['INVALID_PASSWORD', 403]
    ])('deleteAccount : %s donne %i', async (reason, httpCode) => {
        User.deleteUserAccount.mockResolvedValue({ success: false, reason })
        await Auth.deleteAccount(req, res)
        expect(res.status).toHaveBeenCalledWith(httpCode)
    })

    test('deleteAccount refuse le mot de passe manquant', async () => {
        req.body = {}
        await Auth.deleteAccount(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(User.deleteUserAccount).not.toHaveBeenCalled()
    })
})
