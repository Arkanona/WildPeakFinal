
/**
 * @module middlewares/validateMiddleware
 * @description
 * Middleware générique de validation des données
 * envoyées au backend de WildPeak.
 *
 * Il utilise la bibliothèque Zod pour vérifier
 * que les données reçues dans le corps des requêtes
 * HTTP respectent les schémas de validation définis.
 *
 * Si les données sont invalides, une réponse HTTP 422
 * est retournée avec le détail des erreurs.
 *
 * Si les données sont valides, elles sont remplacées
 * par les données analysées par Zod avant de poursuivre
 * le traitement de la requête.
 */

// Middleware générique de validation zod

/**
 * Crée un middleware Express de validation avec Zod.
 *
 * Reçoit un schéma Zod et retourne une fonction middleware
 * chargée de valider le contenu de req.body.
 *
 * La méthode safeParse() permet de vérifier les données
 * sans déclencher d'exception en cas d'échec de validation.
 *
 * Si la validation échoue, le middleware retourne
 * une réponse HTTP 422 contenant les champs invalides
 * et les messages d'erreur associés.
 *
 * Si la validation réussit, req.body est remplacé
 * par result.data, puis next() est appelé pour
 * transmettre la requête au traitement suivant.
 *
 * @function validateBody
 * @param {Object} schema - Schéma de validation Zod.
 * @param {Function} schema.safeParse - Méthode permettant de valider les données.
 * @returns {Function} Middleware Express de validation.
 */
function validateBody(schema){
    return (req, res, next) => {
        
        const result = schema.safeParse(req.body)
        if(!result.success){
            return res.status(422).json({
                title: "Données invalides",
                status: 422,
                invalidParams: result.error.issues.map(err => ({
                    path: err.path.join("."),
                    message: err.message
                }))
            })
        }
        // Si on arrive ici, on a passé la validation, on renvoie les données sur body et on passe à la suite
        req.body = result.data
        next()
    }   
}

module.exports = validateBody
