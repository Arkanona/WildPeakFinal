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