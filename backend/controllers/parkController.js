const Park = require('../models/parkModel')

exports.getParks = async (req, res) => {
    try {
        const park = await Park.findAllPark()

        return res.status(200).json(park)

    } catch (err) {
        console.error('ERREUR GET PARKS :', err)

        return res.status(500).json({message: 'Error retrieving parks', error: err.message})
    }
}