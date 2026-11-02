
/**
 * @module middlewares/adminMiddleware
 * @description
 * Middleware chargé de contrôler les droits
 * d'administration des utilisateurs de WildPeak.
 *
 * Il permet de restreindre l'accès aux routes
 * administrateur aux utilisateurs authentifiés
 * possédant le rôle "admin".
 *
 * Ce middleware doit être utilisé après
 * authMiddleware, qui renseigne req.user.
 */

/**
 * Vérifie que l'utilisateur possède les droits administrateur.
 *
 * Contrôle d'abord la présence des informations
 * de l'utilisateur dans req.user.
 *
 * Si aucun utilisateur n'est authentifié, une réponse
 * HTTP 401 est retournée.
 *
 * Si l'utilisateur est authentifié mais ne possède
 * pas le rôle "admin", une réponse HTTP 403 est retournée.
 *
 * Si l'utilisateur possède les droits nécessaires,
 * next() est appelé pour poursuivre le traitement
 * de la requête.
 *
 * @function adminMiddleware
 * @param {Object} req - Requête HTTP Express.
 * @param {Object} [req.user] - Utilisateur authentifié par authMiddleware.
 * @param {string} [req.user.role_user] - Rôle de l'utilisateur.
 * @param {Object} res - Réponse HTTP Express.
 * @param {Function} next - Fonction permettant de passer au middleware suivant.
 * @returns {void} Envoie une réponse HTTP en cas de refus ou appelle next().
 *
 * @description Codes HTTP :
 * - 401 : Utilisateur non authentifié.
 * - 403 : Accès réservé aux administrateurs.
 *
 * @see module:middlewares/authMiddleware
 */
function adminMiddleware(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            title: "Utilisateur non authentifié",
            status: 401
        })
    }

    if (req.user.role_user !== "admin") {
        return res.status(403).json({
            title: "Accès réservé aux administrateurs",
            status: 403
        })
    }

    next()
}

module.exports = adminMiddleware
