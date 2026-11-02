
/**
 * @module middlewares/authMiddleware
 * @description
 * Middleware d'authentification JWT de WildPeak.
 *
 * Il permet de protéger les routes nécessitant
 * une authentification utilisateur.
 *
 * Le middleware récupère le token JWT depuis
 * l'en-tête Authorization, vérifie sa validité
 * et recherche l'utilisateur correspondant
 * dans la base de données PostgreSQL.
 *
 * Si l'authentification réussit, les informations
 * de l'utilisateur sont ajoutées à req.user
 * et la requête est transmise au middleware suivant.
 */

const jwt = require("jsonwebtoken")
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Vérifie l'authentification d'un utilisateur via JWT.
 *
 * Récupère le token depuis l'en-tête HTTP Authorization
 * au format "Bearer <token>".
 *
 * Si aucun token n'est fourni, une réponse HTTP 401
 * est retournée.
 *
 * Le token est ensuite vérifié avec jwt.verify()
 * en utilisant la clé secrète JWT_SECRET.
 *
 * L'identifiant contenu dans le token permet
 * de rechercher l'utilisateur dans PostgreSQL
 * à l'aide du modèle User.
 *
 * Si l'utilisateur existe, ses informations
 * sont enregistrées dans req.user et next()
 * permet de poursuivre le traitement de la requête.
 *
 * Si le token est invalide, expiré ou si
 * l'utilisateur est introuvable, une réponse
 * HTTP 401 est envoyée.
 *
 * @async
 * @function authMiddleware
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} req.headers - En-têtes de la requête.
 * @param {string} [req.headers.authorization] - Token JWT au format Bearer.
 * @param {Object} res - Réponse HTTP Express.
 * @param {Function} next - Fonction permettant de passer au middleware suivant.
 * @returns {Promise<Object|undefined>} Réponse HTTP 401 en cas d'échec ou passage au middleware suivant.
 *
 * @description Codes HTTP :
 * - 401 : Token manquant.
 * - 401 : Token invalide ou expiré.
 * - 401 : Utilisateur introuvable.
 *
 * @see module:models/userModel
 */
const authMiddleware = async (req, res, next) => {
    try {
        let token

        if(req.headers.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return res.status(401).json({ 
                title: 'Pas autorisé, token manquant',
                status: 401
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findUserById(decoded.id)
        if(!user){
            return res.status(401).json({ 
                title: "Utilisateur introuvable",
                status: 401
            })
        }

        req.user = user;
        next()
    } catch (err) {
        return res.status(401).json({ 
            title: 'Pas autorisé, token invalide',
            status: 401,
            error: err.message })
    }
}

module.exports = authMiddleware
