const Upload = require('../models/uploadModel')
const Attraction = require('../models/attractionModel')
const Park = require('../models/parkModel')
const { createAttractionImages } = require('./uploadController')

exports.getAttraction = async (req, res) => {
    try {
        const attraction = await Attraction.findAllAttraction()

        return res.status(200).json(attraction)

    } catch (err) {

        return res.status(500).json({
            title: "Erreur de récupération de l'attraction",
            status: 500,
            error: err.message
        })
    }
}

exports.addAttraction = async (req, res) => {

    try {
        const {
            name_attraction,
            id_park,
            type_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction,
            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction,
            short_description_attraction
        } = req.body

        const slug_attraction = name_attraction
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        const park = await Park.findParkById(id_park)

        const alt_attraction = `Vue de l'attraction ${name_attraction} à ${park.name_park}`
        const familyFriendly = family_friendly_attraction === "true"

        // Création de l'attraction
        const attraction = await Attraction.addAttraction({
            name_attraction,
            slug_attraction,
            alt_attraction,

            id_park,
            type_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction,

            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction: familyFriendly,
            short_description_attraction
        })

        // Création des images
        if(req.file){
            const {
                cardImageUrl,
                backgroundImageUrl
            } = await createAttractionImages(
                req.file,
                attraction.id_attraction
            )

            // Enregistrement des URLs
            const updatedAttraction =
                await Upload.updateAttractionDb(
                    cardImageUrl,
                    backgroundImageUrl,
                    attraction.id_attraction
                )

            return res.status(201).json({
                title: "Attraction ajoutée avec succès",
                status: 201,
                attraction: updatedAttraction
            })
        }
        res.status(201).json({
            title: "Attraction ajoutée avec succès",
            status: 201,
            attraction
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            title: "Erreur lors de l'ajout de l'attraction",
            status: 500
        })
    }
}

const toNumberOrNull = (value) => {
    if (value === "" || value === undefined || value === null) {
        return null
    }

    return Number(value)
}

exports.updateAttraction = async (req, res) => {
    try {
        const { id } = req.params

        const {
            name_attraction,
            id_park,
            type_attraction,
            speed_max_kmh_attraction,
            height_m_attraction,
            length_m_attraction,
            duration_min_attraction,
            inversion_attraction,
            minimum_height_cm_attraction,
            opening_year_attraction,
            description_attraction,
            parc_zone_attraction,
            intensity_level_attraction,
            family_friendly_attraction,
            short_description_attraction
        } = req.body

        const slug_attraction = name_attraction
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        const park = await Park.findParkById(id_park)

        const alt_attraction = `Vue de l'attraction ${name_attraction} à ${park.name_park}`

        const attraction = await Attraction.updateAttraction(
            id,
            {
                name_attraction,
                slug_attraction,
                alt_attraction,

                id_park: toNumberOrNull(id_park),

                type_attraction,

                speed_max_kmh_attraction:
                    toNumberOrNull(speed_max_kmh_attraction),

                height_m_attraction:
                    toNumberOrNull(height_m_attraction),

                length_m_attraction:
                    toNumberOrNull(length_m_attraction),

                duration_min_attraction:
                    toNumberOrNull(duration_min_attraction),

                inversion_attraction:
                    toNumberOrNull(inversion_attraction),

                minimum_height_cm_attraction:
                    toNumberOrNull(minimum_height_cm_attraction),

                opening_year_attraction:
                    toNumberOrNull(opening_year_attraction),

                description_attraction,
                parc_zone_attraction,
                intensity_level_attraction,

                family_friendly_attraction:
                    family_friendly_attraction === "true",

                short_description_attraction
            }
        )

        if (!attraction) {
            return res.status(404).json({
                title: "Attraction introuvable",
                status: 404
            })
        }

        let updatedAttraction = attraction

        // Si une nouvelle image a été envoyée
        if (req.file) {
            const {
                cardImageUrl,
                backgroundImageUrl
            } = await createAttractionImages(
                req.file,
                attraction.id_attraction
            )

            updatedAttraction = await Upload.updateAttractionDb(
                cardImageUrl,
                backgroundImageUrl,
                attraction.id_attraction
            )
        }

        return res.status(200).json({
            title: "Attraction modifiée avec succès",
            status: 200,
            attraction: updatedAttraction
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            title: "Erreur lors de la modification de l'attraction",
            status: 500,
            error: error.message
        })
    }
}

exports.deleteAttraction = async (req, res) => {
    try {
        const { id } = req.params

        const attraction = await Attraction.deleteAttraction(id)

        if (!attraction) {
            return res.status(404).json({
                title: "Attraction introuvable",
                status: 404
            })
        }

        return res.status(200).json({
            title: "Attraction supprimée",
            status: 200,
            attraction
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            title: "Erreur lors de la suppression",
            status: 500
        })
    }
}