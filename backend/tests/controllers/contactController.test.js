
/**
 * Tests unitaires du controller de contact WildPeak.
 *
 * Le service Brevo est simulé avec Jest afin
 * d'éviter l'envoi de véritables e-mails.
 */

jest.mock('../../services/mailService', () => ({
    sendContactMail: jest.fn()
}))

const { sendContactMail } = require('../../services/mailService')
const { sendMessage } = require('../../controllers/contactController')

describe('contactController', () => {
    let req
    let res

    beforeEach(() => {
        sendContactMail.mockReset()

        req = {
            body: {
                firstname: 'Enzo',
                lastname: 'Test',
                email: 'enzo@example.com',
                message: 'Bonjour, je souhaite vous contacter.',
                confidentiality: true
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('sendMessage', () => {

        test('envoie correctement un message de contact', async () => {
            sendContactMail.mockResolvedValue({
                messageId: 'test-message-id'
            })

            await sendMessage(req, res)

            expect(sendContactMail).toHaveBeenCalledTimes(1)

            expect(sendContactMail).toHaveBeenCalledWith({
                firstname: 'Enzo',
                lastname: 'Test',
                email: 'enzo@example.com',
                message: 'Bonjour, je souhaite vous contacter.'
            })

            expect(res.status).toHaveBeenCalledWith(200)

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Votre message a bien été envoyé.'
                })
            )
        })

        test('refuse un message si la confidentialité est refusée', async () => {
            req.body.confidentiality = false

            await sendMessage(req, res)

            expect(res.status).toHaveBeenCalledWith(400)

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Vous devez accepter la politique de confidentialité.',
                    status: 400
                })
            )

            expect(sendContactMail).not.toHaveBeenCalled()
        })

        test('refuse un message si la confidentialité est absente', async () => {
            delete req.body.confidentiality

            await sendMessage(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(sendContactMail).not.toHaveBeenCalled()
        })

        test('refuse une valeur de confidentialité différente de true', async () => {
            req.body.confidentiality = 'true'

            await sendMessage(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(sendContactMail).not.toHaveBeenCalled()
        })

        test('retourne une erreur 500 si le service Brevo échoue', async () => {
            sendContactMail.mockRejectedValue(
                new Error('Erreur API Brevo')
            )

            await sendMessage(req, res)

            expect(sendContactMail).toHaveBeenCalledTimes(1)

            expect(res.status).toHaveBeenCalledWith(500)

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Erreur serveur.',
                    status: 500
                })
            )
        })

        test('journalise une erreur lors de l’échec de l’envoi', async () => {
            const error = new Error('Service indisponible')

            sendContactMail.mockRejectedValue(error)

            await sendMessage(req, res)

            expect(console.error).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(500)
        })
    })
})
