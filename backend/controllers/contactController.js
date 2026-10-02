const { sendContactMail } = require("../services/mailService");

exports.sendMessage = async (req, res) => {
    try{
        let {
            firstname,
            lastname,
            email,
            message,
            confidentiality

        } = req.body

        firstname = firstname?.trim();
        lastname = lastname?.trim();
        email = email?.trim().toLowerCase();
        message = message?.trim();

         // Vérification des champs obligatoires
        if (!firstname || !lastname || !email || !message) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires."
        })
        }

        // Vérification confidentialité
        if (confidentiality !== true) {
        return res.status(400).json({
            message: "Vous devez accepter la politique de confidentialité."
        })
        }

        // Vérification email simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Adresse e-mail invalide."
        })
        }

        // Limites
        if (firstname.length > 50 || lastname.length > 50) {
        return res.status(400).json({
            message: "Nom ou prénom trop long."
        })
        }

        if (message.length > 500) {
        return res.status(400).json({
            message: "Le message ne peut pas dépasser 500 caractères."
        })
        }

        await sendContactMail ({
            firstname,
            lastname,
            email,
            message
        })

        return res.status(200).json({
      message: "Votre message a bien été envoyé."
    })

    }catch(error){
        console.error(error)
        return res.status(500).json({message: "Erreur serveur."})
    }
}