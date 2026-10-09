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

        // Vérification confidentialité
        if (confidentiality !== true) {
        return res.status(400).json({
            title: "Vous devez accepter la politique de confidentialité.",
            status: 400
        })
        }

        await sendContactMail ({
            firstname,
            lastname,
            email,
            message
        })

        return res.status(200).json({
            title: "Votre message a bien été envoyé.",
            status: 200
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            title: "Erreur serveur.",
            status: 500

        })
    }
}