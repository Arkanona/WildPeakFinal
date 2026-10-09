const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendResetPasswordEmail } = require('../services/mailService')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '365d'


const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

exports.register = async (req, res) => {
    try{

        const { name, email, password } = req.body
        
        const isExistingUser = await User.findUserByEmail( email )
        if(isExistingUser){
            return res.status(409).json({ 
                title: 'Vous ne pouvez pas vous inscrire avec ce mail',
                status: 409,
                detail: "Ce mail ne peut pas être utilisé"
            })
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.createUser(name, email, hashedPassword)

        const token = generateToken(user.id_user)

        res.status(201).json({
            title: 'Utilisateur enregistré avec succès',
            status: 201,
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user,
                role: user.role_user,
            }
        })
    } catch (err) {
        res.status(500).json({ 
            title: "Erreur serveur pendant l'inscription utilisateur",
            status: 500,
            error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findUserByEmail(email)
        if(!user){
            return res.status(401).json({ 
                title: 'Identifiant incrorrect',
                status: 401,
                detail: "Les identifiants ne sont pas correctes"
            })
        }

        const isMatch = await bcrypt.compare(password, user.pass_hash_user)
        if(!isMatch){
            return res.status(401).json({ 
                title: 'Identifiant incorrect',
                status: 401,
                detail: "Les identifiants ne sont pas correctes"
            })
        }

        const token = generateToken(user.id_user)

        res.status(200).json({
            title: 'Utilisateur connecter avec succès',
            status: 200,
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user,
                role: user.role_user,
            }
        })

    } catch (err) {
        res.status(500).json({ 
            title: 'Server error during login',
            status: 500,
            error: err.message })
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        const { email } = req.body

        if(!email){
            return res.status(400).json({ 
                title: "L'adresse e-mail est obligatoire.",
                status: 400
            })
        }

        const user = await User.findUserByEmail(email)

        // On ne révèle pas si l'adresse mail existe ou non
        if(!user){
            return res.status(409).json({ 
                title: 'Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé.',
                status: 409
            })
        }

        // On génère un token aléatoire
        const resetToken = crypto.randomBytes(32).toString('hex')

        // On hash le token avant l'enregistrement en BDD
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        // Date d'expiration 15 minutes
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        // On enregistre token + expiration dans la BDD
        await User.saveResetToken(
            user.id_user,
            hashedToken,
            expiresAt
        )

        // On construit le lien envoyé à l'utilisateur
        const resetUrl = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe/${resetToken}`

        // On envoie l'e-mail
        await sendResetPasswordEmail(user.email_user, resetUrl)

        return res.status(200).json({ 
            title: 'Si un compte existe avec cette adresse, un lien de réinitialisation à été envoyé.',
            status: 200
        })

    } catch(err){
        res.status(500).json({ 
            title: 'Erreur serveur lors de la demande de réinitialisation',
            status: 500,
            error: err.message})
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        if (!token) {
            return res.status(400).json({
                title: "Token de réinitialisation manquant.",
                status: 400
            })
        }

        // On hash le token reçu pour le comparer à celui stocké en BDD
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        // Recherche de l'utilisateur avec ce token valide
        const user = await User.findUserByResetToken(hashedToken)

        if (!user) {
            return res.status(400).json({
                title: "Le lien de réinitialisation est invalide ou expiré.",
                status: 400
            })
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Mise à jour du mot de passe
        await User.updatePassword(user.id_user, hashedPassword)

        // Suppression du token pour empêcher sa réutilisation
        await User.clearResetToken(user.id_user)

        return res.status(200).json({
            title: "Votre mot de passe a bien été réinitialisé.",
            status: 200
        })

    } catch (err) {

        return res.status(500).json({
            title: "Erreur serveur lors de la réinitialisation du mot de passe.",
            status: 500
        })
    }
}