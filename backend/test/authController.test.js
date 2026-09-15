jest.mock('../config/db', () => ({
    pool: {
        query: jest.fn()
    }
}))

const { pool } = require('../config/db')
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

            // SELECT pour vérifier si l'email existe
            pool.query.mockResolvedValueOnce({
                rows: []
            })

            // INSERT du nouvel utilisateur
            pool.query.mockResolvedValueOnce({
                rows: [
                    {
                        id_user: 1,
                        name_user: 'Alice Tester',
                        email_user: 'test_auth@example.com'
                    }
                ]
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

            expect(res.body.user.email_user)
                .toBe('test_auth@example.com')

            expect(pool.query).toHaveBeenCalledTimes(2)
        })

    })

})