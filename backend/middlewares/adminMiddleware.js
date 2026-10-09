function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            title: "Utilisateur non authentifié",
            status: 401
        })
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            title: "Accès réservé aux administrateurs",
            status: 403
        })
    }

    next()
}

module.exports = adminMiddleware