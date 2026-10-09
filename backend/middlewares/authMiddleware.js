const jwt = require("jsonwebtoken")
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        let token

        if(req.headers.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return res.status(401).json({ 
                title: 'Not authorized, token missing',
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