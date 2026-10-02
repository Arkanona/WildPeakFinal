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
            ${message}
                    `
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();

    console.error(error);

    throw new Error("Erreur lors de l'envoi de l'e-mail.");
  }

  return response.json();
};