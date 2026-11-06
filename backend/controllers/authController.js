
/**
 * @module controllers/authController
 * @description
 * Contrôleur chargé de l'authentification et de la gestion
 * des comptes utilisateurs de WildPeak.
 *
 * Il permet l'inscription, la connexion, la génération
 * de tokens JWT, la réinitialisation des mots de passe
 * et la suppression définitive des comptes.
 */

const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendResetPasswordEmail } = require('../services/mailService')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

/**
 * Génère un token JWT pour un utilisateur.
 *
 * Le token contient l'identifiant de l'utilisateur
 * et possède une durée de validité de 7 jours.
 *
 * @private
 * @function generateToken
 * @param {number} id - Identifiant de l'utilisateur.
 * @returns {string} Token JWT signé.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

/**
 * Inscrit un nouvel utilisateur sur WildPeak.
 *
 * Vérifie que l'adresse e-mail n'est pas déjà utilisée,
 * chiffre le mot de passe avec bcrypt, puis enregistre
 * l'utilisateur dans la base de données.
 *
 * Un token JWT est généré après la création du compte
 * afin de permettre une connexion immédiate.
 *
 * @async
 * @function register
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.body - Données d'inscription.
 * @param {string} req.body.name - Nom de l'utilisateur.
 * @param {string} req.body.email - Adresse e-mail.
 * @param {string} req.body.password - Mot de passe.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object|undefined>} Réponse HTTP JSON.
 *
 * @description Codes HTTP :
 * - 201 : Utilisateur enregistré avec succès.
 * - 409 : Adresse e-mail déjà utilisée.
 * - 500 : Erreur serveur.
 */
exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        const isExistingUser = await User.findUserByEmail(email)

        if (isExistingUser) {
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
            error: err.message
        })
    }
}

/**
 * Authentifie un utilisateur existant.
 *
 * Recherche l'utilisateur à partir de son adresse e-mail
 * et compare son mot de passe avec le hash enregistré
 * dans la base de données.
 *
 * Si les identifiants sont corrects, un token JWT
 * est généré et retourné avec les informations du compte.
 *
 * @async
 * @function login
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.body - Identifiants de connexion.
 * @param {string} req.body.email - Adresse e-mail.
 * @param {string} req.body.password - Mot de passe.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object|undefined>} Réponse HTTP JSON.
 *
 * @description Codes HTTP :
 * - 200 : Connexion réussie.
 * - 401 : Identifiants incorrects.
 * - 500 : Erreur serveur.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findUserByEmail(email)

        if (!user) {
            return res.status(401).json({
                title: 'Identifiant incrorrect',
                status: 401,
                detail: "Les identifiants ne sont pas correctes"
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.pass_hash_user
        )

        if (!isMatch) {
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
            error: err.message
        })
    }
}

/**
 * Traite une demande de réinitialisation du mot de passe.
 *
 * Recherche le compte associé à l'adresse e-mail.
 * Si celui-ci existe, un token aléatoire est généré.
 *
 * Le token est haché avec SHA-256 avant son stockage
 * dans la base de données, avec une expiration
 * fixée à 15 minutes.
 *
 * Un lien de réinitialisation contenant le token
 * original est ensuite envoyé à l'utilisateur par e-mail.
 *
 * Pour des raisons de sécurité, la réponse HTTP ne révèle
 * pas si l'adresse e-mail correspond à un compte existant.
 *
 * @async
 * @function forgotPassword
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.body - Données de la demande.
 * @param {string} req.body.email - Adresse e-mail du compte.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object|undefined>} Réponse HTTP JSON.
 *
 * @description Codes HTTP :
 * - 200 : Demande traitée.
 * - 400 : Adresse e-mail manquante.
 * - 500 : Erreur serveur.
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                title: "L'adresse e-mail est obligatoire.",
                status: 400
            })
        }

        const user = await User.findUserByEmail(email)

        if (!user) {
            return res.status(200).json({
                title: 'Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé.',
                status: 200
            })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await User.saveResetToken(
            user.id_user,
            hashedToken,
            expiresAt
        )

        const resetUrl = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe/${resetToken}`

        await sendResetPasswordEmail(user.email_user, resetUrl)

        return res.status(200).json({
            title: 'Si un compte existe avec cette adresse, un lien de réinitialisation à été envoyé.',
            status: 200
        })

    } catch (err) {
        res.status(500).json({
            title: 'Erreur serveur lors de la demande de réinitialisation',
            status: 500,
            error: err.message
        })
    }
}

/**
 * Réinitialise le mot de passe d'un utilisateur.
 *
 * Récupère le token fourni dans l'URL et calcule
 * son empreinte SHA-256 pour rechercher le compte associé.
 *
 * Si le token est valide et non expiré, le nouveau
 * mot de passe est haché avec bcrypt avant son
 * enregistrement en base de données.
 *
 * Le token est ensuite supprimé pour empêcher
 * sa réutilisation.
 *
 * @async
 * @function resetPassword
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.params - Paramètres de l'URL.
 * @param {string} req.params.token - Token de réinitialisation.
 * @param {Object} req.body - Corps de la requête.
 * @param {string} req.body.password - Nouveau mot de passe.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object>} Réponse HTTP JSON.
 *
 * @description Codes HTTP :
 * - 200 : Mot de passe réinitialisé.
 * - 400 : Token absent, invalide ou expiré.
 * - 500 : Erreur serveur.
 */
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

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const user = await User.findUserByResetToken(hashedToken)

        if (!user) {
            return res.status(400).json({
                title: "Le lien de réinitialisation est invalide ou expiré.",
                status: 400
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.updatePassword(user.id_user, hashedPassword)

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

/**
 * Supprime définitivement le compte de l'utilisateur connecté.
 *
 * Vérifie que l'utilisateur est authentifié et qu'un
 * mot de passe a été fourni.
 *
 * Délègue la suppression au modèle User, qui reçoit
 * une fonction de comparaison du mot de passe avec
 * le hash enregistré en base de données.
 *
 * Les résultats du modèle permettent de différencier
 * un compte introuvable et un mot de passe incorrect.
 *
 * @async
 * @function deleteAccount
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.user - Utilisateur authentifié.
 * @param {number} req.user.id_user - Identifiant du compte.
 * @param {Object} req.body - Corps de la requête.
 * @param {string} req.body.password - Mot de passe actuel.
 * @param {Object} res - Réponse HTTP Express.
 * @returns {Promise<Object>} Réponse HTTP JSON.
 *
 * @description Codes HTTP :
 * - 200 : Compte supprimé avec succès.
 * - 400 : Mot de passe manquant.
 * - 401 : Utilisateur non authentifié.
 * - 403 : Mot de passe incorrect.
 * - 404 : Compte introuvable.
 * - 500 : Erreur serveur.
 */
exports.deleteAccount = async (req, res) => {
    try {
        const idUser = req.user?.id_user
        const { password } = req.body || {}

        if (!idUser) {
            return res.status(401).json({
                title: "Utilisateur non authentifié",
                status: 401
            })
        }

        if (typeof password !== "string" || !password) {
            return res.status(400).json({
                title: "Mot de passe obligatoire",
                status: 400
            })
        }

        const result = await User.deleteUserAccount(
            idUser,
            async (passwordHash) => {
                if (
                    typeof passwordHash !== "string" ||
                    !passwordHash
                ) {
                    throw new Error(
                        "Hash du mot de passe introuvable"
                    )
                }

                return bcrypt.compare(password, passwordHash)
            }
        )

        if (!result.success) {
            if (result.reason === 'USER_NOT_FOUND') {
                return res.status(404).json({
                    title: "Compte introuvable",
                    status: 404
                })
            }

            if (result.reason === 'INVALID_PASSWORD') {
                return res.status(403).json({
                    title: "Mot de passe incorrect",
                    status: 403
                })
            }
        }

        return res.status(200).json({
            title: "Votre compte a été supprimé avec succès",
            status: 200
        })

    } catch (error) {
        console.error("Erreur suppression du compte :", error)

        return res.status(500).json({
            title: "Erreur lors de la suppression du compte",
            status: 500
        })
    }
}
