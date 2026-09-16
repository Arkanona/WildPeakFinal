jest.mock('../models/userModel', () => ({
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    comparePassword: jest.fn()
}))

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'fake-token')
}))

const User = require('../models/userModel')
const { register } = require('../controllers/authController')

const createMockRes = () => ({
    statusCode: 200,
    body: null,

    status(code) {
        this.statusCode = code
        return this
    },

    json(data) {
        this.body = data
        return this
    }
})

describe('Authentification', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('User register', () => {

        test('Doit pouvoir inscrire un utilisateur valide', async () => {

            User.findUserByEmail.mockResolvedValue(null)

            User.createUser.mockResolvedValue({
                id_user: 1,
                name_user: 'Alice Tester',
                email_user: 'test_auth@example.com',
                role_user: 'user'
            })

            const req = {
                body: {
                    name: 'Alice Tester',
                    email: 'test_auth@example.com',
                    password: 'Password123!'
                }
            }

            const res = createMockRes()

            await register(req, res)

            expect(res.statusCode).toBe(201)

            expect(res.body.token).toBe('fake-token')

            expect(res.body.user).toEqual({
                id: 1,
                name: 'Alice Tester',
                email: 'test_auth@example.com',
                role: 'user'
            })

            expect(User.findUserByEmail)
                .toHaveBeenCalledWith('test_auth@example.com')

            expect(User.createUser)
                .toHaveBeenCalledWith(
                    'Alice Tester',
                    'test_auth@example.com',
                    'Password123!'
                )
        })

    })

})