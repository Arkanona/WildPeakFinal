const Attraction = require('../models/attractionModel')

exports.getAttraction = async (req, res) => {
    try {
        const attraction = await Attraction.findAllAttraction()

        return res.status(200).json(attraction)

    } catch (err) {
        console.error('ERREUR GET ATTRACTIONS :', err)

        return res.status(500).json({message: 'Error retrieving attractions', error: err.message})
    }
}