const Mail = require('../../services/mailService')

let originalFetch
beforeAll(() => { originalFetch = global.fetch })
afterAll(() => { global.fetch = originalFetch })
beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ messageId: 'fake-mail-id' })
    })
})

describe('mailService (Brevo simulé)', () => {
    test('sendContactMail prépare un POST avec replyTo', async () => {
        await expect(Mail.sendContactMail({
            firstname: 'Test', lastname: 'User',
            email: 'test@example.com', message: 'Bonjour WildPeak'
        })).resolves.toEqual({ messageId: 'fake-mail-id' })
        const [url, options] = global.fetch.mock.calls[0]
        expect(url).toBe('https://api.brevo.com/v3/smtp/email')
        expect(options.method).toBe('POST')
        const body = JSON.parse(options.body)
        expect(body.replyTo).toEqual({ email: 'test@example.com', name: 'Test User' })
        expect(body.textContent).toContain('Bonjour WildPeak')
    })

    test('sendResetPasswordEmail transmet le lien dans le HTML', async () => {
        await Mail.sendResetPasswordEmail('test@example.com', 'https://exemple.fr/reset/token-test')
        const body = JSON.parse(global.fetch.mock.calls[0][1].body)
        expect(body.to).toEqual([{ email: 'test@example.com' }])
        expect(body.htmlContent).toContain('https://exemple.fr/reset/token-test')
        expect(body.htmlContent).toContain('15 minutes')
    })

    test('sendContactMail lève une erreur si Brevo rejette la demande', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        global.fetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue({ message: 'Erreur' }) })
        await expect(Mail.sendContactMail({ firstname: 'T', lastname: 'U', email: 't@x.fr', message: 'test' }))
            .rejects.toThrow("Erreur lors de l'envoi de l'e-mail.")
        jest.restoreAllMocks()
    })

    test('sendResetPasswordEmail relaie le message d’erreur de Brevo', async () => {
        global.fetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue({ message: 'Quota dépassé' }) })
        await expect(Mail.sendResetPasswordEmail('test@example.com', 'http://local/reset'))
            .rejects.toThrow('Quota dépassé')
    })
})
