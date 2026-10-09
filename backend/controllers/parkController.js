const Park = require('../models/parkModel')

exports.getParks = async (req, res) => {
    try {
        const park = await Park.findAllPark()

        return res.status(200).json(park)

    } catch (err) {

        return res.status(500).json({
            title: 'Erreur lors de la récupération des parcs',
            status: 500,
            error: err.message})
    }
}