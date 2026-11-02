
/**
 * @module services/mailService
 * @description
 * Service chargé de l'envoi des e-mails de WildPeak
 * à l'aide de l'API transactionnelle Brevo.
 *
 * Il permet d'envoyer les messages provenant
 * du formulaire de contact et les e-mails
 * de réinitialisation des mots de passe.
 *
 * Les informations de configuration et la clé API
 * Brevo sont récupérées depuis les variables
 * d'environnement du backend.
 */

/**
 * Envoie un e-mail depuis le formulaire de contact WildPeak.
 *
 * Récupère les informations saisies par le visiteur
 * et construit un message contenant son nom, son prénom,
 * son adresse e-mail et le contenu de sa demande.
 *
 * Le message est envoyé via l'API Brevo à l'adresse
 * définie dans la variable BREVO_RECEIVER_EMAIL.
 *
 * L'adresse du visiteur est renseignée dans replyTo
 * afin de permettre une réponse directe à son message.
 *
 * La requête utilise la méthode POST et transmet
 * les informations au format JSON.
 *
 * Si l'API retourne une erreur HTTP, celle-ci est
 * affichée dans la console et une exception est levée.
 *
 * @async
 * @function sendContactMail
 * @param {Object} contactData - Informations du formulaire de contact.
 * @param {string} contactData.firstname - Prénom du visiteur.
 * @param {string} contactData.lastname - Nom du visiteur.
 * @param {string} contactData.email - Adresse e-mail du visiteur.
 * @param {string} contactData.message - Contenu du message.
 * @returns {Promise<Object>} Réponse JSON retournée par l'API Brevo.
 * @throws {Error} Si l'envoi de l'e-mail échoue ou si la requête rencontre une erreur.
 */
exports.sendContactMail = async ({
  firstname,
  lastname,
  email,
  message
}) => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "Accept": "application/json"
      },

      body: JSON.stringify({
        sender: {
          name: "WildPeak",
          email: process.env.BREVO_SENDER_EMAIL
        },

        to: [
          {
            email: process.env.BREVO_RECEIVER_EMAIL,
            name: "WildPeak"
          }
        ],

        replyTo: {
          email: email,
          name: `${firstname} ${lastname}`
        },

        subject: `Nouveau message WildPeak - ${firstname} ${lastname}`,

        textContent: `
            Nom : ${lastname}
            Prénom : ${firstname}
            E-mail : ${email}

            Message :
            ${message}`
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()

    console.error(error)

    throw new Error("Erreur lors de l'envoi de l'e-mail.")
  }

  return response.json()
}

/**
 * Envoie un e-mail de réinitialisation de mot de passe.
 *
 * Cette fonction est appelée lors d'une demande
 * de réinitialisation du mot de passe d'un utilisateur.
 *
 * Elle construit un e-mail HTML contenant un lien
 * permettant d'accéder au formulaire de modification
 * du mot de passe.
 *
 * Le lien de réinitialisation est généré en amont
 * par le contrôleur d'authentification.
 *
 * Le message informe l'utilisateur que le lien
 * possède une durée de validité de 15 minutes.
 *
 * L'e-mail est envoyé à l'adresse de l'utilisateur
 * via l'API transactionnelle Brevo.
 *
 * Si l'API retourne une erreur HTTP, une exception
 * est levée avec le message fourni par Brevo
 * ou un message d'erreur générique.
 *
 * @async
 * @function sendResetPasswordEmail
 * @param {string} email - Adresse e-mail du destinataire.
 * @param {string} resetUrl - URL contenant le token de réinitialisation.
 * @returns {Promise<Object>} Réponse JSON retournée par l'API Brevo.
 * @throws {Error} Si l'envoi de l'e-mail échoue ou si la requête rencontre une erreur.
 *
 * @see module:controllers/authController
 */
exports.sendResetPasswordEmail = async (email, resetUrl) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: 'WildPeak',
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [
                {
                    email: email
                }
            ],
            subject: 'Réinitialisation de votre mot de passe WildPeak',
            htmlContent: `
                <h2>Réinitialisation du mot de passe</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>
                    <a href="${resetUrl}">
                        Réinitialiser mon mot de passe
                    </a>
                </p>
                <p>Ce lien expire dans 15 minutes.</p>
            `
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'envoi de l'e-mail")
    }

    return response.json()
}
