const express = require('express')
const app = express()
const port = 3000
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

const corsOption = {
    origin: ['http://localhost:5173', 'http://localhost:4173']
}
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

app.use(cors(corsOption))
app.use(limiter)
app.use(express.json())
app.use('/upload', express.static(path.join(process.cwd(), 'upload')))
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/parks', parkRoutes)
app.use('/api/v1/attractions', attractionRoutes)


app.get('/', (req, res) => {
    res.send("WildPeak")
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})