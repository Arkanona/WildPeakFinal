const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')

require('dotenv').config()
require('./config/db')

// Routes
const authRoutes = require('./routes/authRoutes')
const parkRoutes = require('./routes/parkRoutes')
const attractionRoutes = require('./routes/attractionRoutes')
const profileRoutes = require('./routes/profileRoutes')
const contactRoutes = require('./routes/contactRoutes')
const adminRoutes = require('./routes/adminRoutes')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    message: { status: 429, error: 'Too many request'}
})


app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
)

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(
            new Error(`Origin non autorisée : ${origin}`)
        )
    },
    credentials: true
}))

app.use(limiter)
app.use(express.json())
app.use('/upload', express.static(path.join(process.cwd(), 'upload')))
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/parks', parkRoutes)
app.use('/api/v1/attractions', attractionRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/contact', contactRoutes)
app.use('/api/v1/admin-wild', adminRoutes)


app.get('/', (req, res) => {
    res.send("WildPeak")
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
})