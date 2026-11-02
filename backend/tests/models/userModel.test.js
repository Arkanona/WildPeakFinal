
jest.mock('../../config/db', () => ({
    pool: { query: jest.fn(), connect: jest.fn() }
}))

const { pool } = require('../../config/db')
const User = require('../../models/userModel')

beforeEach(() => jest.clearAllMocks())

describe('userModel', () => {
    test('createUser normalise l’email et ne retourne pas le hash', async () => {
        const user = { id_user: 1, name_user: 'Test', email_user: 'test@mail.fr', role_user: 'user' }
        pool.query.mockResolvedValue({ rows: [user] })
        await expect(User.createUser('Test', ' TEST@MAIL.FR ', 'hash')).resolves.toEqual(user)
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('RETURNING id_user, name_user, email_user, role_user'),
            ['Test', 'test@mail.fr', 'hash', 'user']
        )
    })

    test('findUserByEmail retourne l’utilisateur puis null si absent', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id_user: 2 }] })
        pool.query.mockResolvedValueOnce({ rows: [] })
        await expect(User.findUserByEmail(' TEST@MAIL.FR ')).resolves.toEqual({ id_user: 2 })
        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), ['test@mail.fr'])
        await expect(User.findUserByEmail('absent@mail.fr')).resolves.toBeNull()
    })

    test('findUserById retourne null si absent', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(User.findUserById(10)).resolves.toBeNull()
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [10])
    })

    test('saveResetToken stocke le hash et la date d’expiration', async () => {
        const date = new Date('2026-11-02T12:00:00Z')
        pool.query.mockResolvedValue({ rows: [{ id_user: 3 }] })
        await expect(User.saveResetToken(3, 'sha256', date)).resolves.toEqual({ id_user: 3 })
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('reset_password_token = $1'), ['sha256', date, 3])
    })

    test('findUserByResetToken ne cherche que les tokens non expirés', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await expect(User.findUserByResetToken('hash')).resolves.toBeUndefined()
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('reset_password_expires > NOW()'), ['hash'])
    })

    test('updatePassword utilise le hash fourni', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await User.updatePassword(3, 'nouveauHash')
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SET pass_hash_user = $1'), ['nouveauHash', 3])
    })

    test('clearResetToken supprime token et expiration', async () => {
        pool.query.mockResolvedValue({ rows: [] })
        await User.clearResetToken(3)
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('reset_password_token = NULL'), [3])
    })

    describe('deleteUserAccount (transaction)', () => {
        let client
        beforeEach(() => {
            client = { query: jest.fn(), release: jest.fn() }
            pool.connect.mockResolvedValue(client)
        })

        test('COMMIT après vérification et suppression des favoris puis du compte', async () => {
            client.query.mockResolvedValueOnce({}) // BEGIN
                .mockResolvedValueOnce({ rows: [{ id_user: 3, pass_hash_user: 'hash' }] })
                .mockResolvedValue({ rows: [] })
            const verify = jest.fn().mockResolvedValue(true)
            await expect(User.deleteUserAccount(3, verify)).resolves.toEqual({ success: true })
            expect(verify).toHaveBeenCalledWith('hash')
            const sql = client.query.mock.calls.map(([query]) => query.trim())
            expect(sql[0]).toBe('BEGIN')
            expect(sql[1]).toContain('FOR UPDATE')
            expect(sql[2]).toContain('DELETE FROM favorites')
            expect(sql[3]).toContain('DELETE FROM users')
            expect(sql[4]).toBe('COMMIT')
            expect(client.release).toHaveBeenCalledTimes(1)
        })

        test('ROLLBACK si le compte n’existe pas', async () => {
            client.query.mockResolvedValueOnce({}).mockResolvedValueOnce({ rows: [] }).mockResolvedValue({})
            const verify = jest.fn()
            await expect(User.deleteUserAccount(3, verify)).resolves.toEqual({ success: false, reason: 'USER_NOT_FOUND' })
            expect(verify).not.toHaveBeenCalled()
            expect(client.query).toHaveBeenCalledWith('ROLLBACK')
            expect(client.release).toHaveBeenCalledTimes(1)
        })

        test('ROLLBACK si le mot de passe est faux', async () => {
            client.query.mockResolvedValueOnce({}).mockResolvedValueOnce({ rows: [{ pass_hash_user: 'hash' }] }).mockResolvedValue({})
            await expect(User.deleteUserAccount(3, jest.fn().mockResolvedValue(false)))
                .resolves.toEqual({ success: false, reason: 'INVALID_PASSWORD' })
            expect(client.query).toHaveBeenCalledWith('ROLLBACK')
            expect(client.query.mock.calls.some(([sql]) => sql.includes('DELETE FROM users'))).toBe(false)
            expect(client.release).toHaveBeenCalledTimes(1)
        })

        test('ROLLBACK et propagation de l’erreur en cas d’échec SQL', async () => {
            client.query.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('SQL indisponible'))
                .mockResolvedValueOnce({})
            await expect(User.deleteUserAccount(3, jest.fn())).rejects.toThrow('SQL indisponible')
            expect(client.query).toHaveBeenCalledWith('ROLLBACK')
            expect(client.release).toHaveBeenCalledTimes(1)
        })
    })
})
