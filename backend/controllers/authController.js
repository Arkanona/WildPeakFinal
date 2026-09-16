const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const validator = require('validator')
const bcrypt = require('bcryptjs')


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
        if(!name || !email || !password){
            return res.status(400).json({ message: 'Pleaser provide name, email and password'})
        }
        
        const isPasswordOK = validator.isStrongPassword(password, {
            minLength: 7,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        
        
        if(!isPasswordOK){
            return res.status(400).json({ message: 'Password must have 1 lower, 1 upper, 1 number, and 1 symbol and must be at least 6 characters long'})
        }

        const isEmailOK = validator.isEmail(email)

        if(!isEmailOK){
            return res.status(400).json({ message: 'You must provid a valid email'})
        }
        
        const isExistingUser = await User.findUserByEmail( email )
        if(isExistingUser){
            return res.status(400).json({ message: 'Invalid email'})
        }

        const user = await User.createUser(name, email, password)

        const token = generateToken(user.id_user)

        res.status(201).json({
            message: 'User register successfully',
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user,
                role: user.role_user,
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error during registeration', error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: 'Please provide email and password '})
        }
        const user = await User.findUserByEmail(email)
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        const isMatch = await bcrypt.compare(pass_hash_user, hashedPassword)
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const token = generateToken(user.id_user)

        res.status(200).json({
            message: 'User login successfuly',
            token,
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email_user,
                role: user.role_user,
            }
        })

    } catch (err) {
        res.status(500).json({ message: 'Server error during login', error: err.message })
    }
}