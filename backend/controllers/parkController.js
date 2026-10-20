const Park = require('../models/parkModel')
const Upload = require('../models/uploadModel')
const { createParkImages, deleteOldImages } = require('./uploadController')


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

exports.addPark = async (req, res) => {
    try {
        const {
            name_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        } = req.body

        if (!name_park?.trim()) {
            return res.status(400).json({
                title: "Le nom du parc est obligatoire",
                status: 400
            })
        }

        const slug_park = name_park
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        // Création du parc en BDD
        const park = await Park.addPark({
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park: opening_year_park
                ? Number(opening_year_park)
                : null,
            description_park
        })

        let createdPark = park

        // Création des images avec Sharp
        if (req.file) {
            const {
                cardImageUrl,
                backgroundImageUrl
            } = await createParkImages(
                req.file,
                park.id_park
            )

            createdPark = await Upload.updateParkDb(
                cardImageUrl,
                backgroundImageUrl,
                park.id_park
            )
        }

        return res.status(201).json({
            title: "Parc ajouté avec succès",
            status: 201,
            park: createdPark
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            title: "Erreur lors de l'ajout du parc",
            status: 500,
            error: error.message
        })
    }
}

exports.updatePark = async (req, res) => {
    try {
        const { id } = req.params

        const {
            name_park,
            country_park,
            place_park,
            opening_year_park,
            description_park
        } = req.body

        if (!name_park?.trim()) {
            return res.status(400).json({
                title: "Le nom du parc est obligatoire",
                status: 400
            })
        }

        const slug_park = name_park
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        // Modification des informations du parc
        const park = await Park.updatePark(id, {
            name_park,
            slug_park,
            country_park,
            place_park,
            opening_year_park: opening_year_park
                ? Number(opening_year_park)
                : null,
            description_park
        })

        if (!park) {
            return res.status(404).json({
                title: "Parc introuvable",
                status: 404
            })
        }

        let updatedPark = park

        if (req.file) {
            // On conserve les anciennes URLs avant modification
            const oldImages = [
                park.img_park,
                park.imgbg_park
            ]

            const {
                cardImageUrl,
                backgroundImageUrl
            } = await createParkImages(
                req.file,
                park.id_park
            )

            try {
                const result = await Upload.updateParkDb(
                    cardImageUrl,
                    backgroundImageUrl,
                    park.id_park
                )

                updatedPark = result[0]

                // On supprime les anciennes images
                await deleteOldImages(oldImages)

            } catch (error) {
                // Si la BDD échoue, on nettoie les nouvelles images
                await deleteOldImages([
                    cardImageUrl,
                    backgroundImageUrl
                ])

                throw error
            }
        }

        return res.status(200).json({
            title: "Parc modifié avec succès",
            status: 200,
            park: updatedPark
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            title: "Erreur lors de la modification du parc",
            status: 500,
            error: error.message
        })
    }
}

exports.deletePark = async (req, res) => {
    try {
        const { id } = req.params

        // On vérifie si le parc contient encore des attractions
        const attractionCount = await Park.countAttractions(id)

        if (attractionCount > 0) {
            return res.status(409).json({
                title: "Impossible de supprimer ce parc",
                message: "Ce parc contient encore des attractions.",
                status: 409
            })
        }

        const park = await Park.deletePark(id)

        if (!park) {
            return res.status(404).json({
                title: "Parc introuvable",
                status: 404
            })
        }

        // Supprimer les images de Supabase
        await deleteOldImages([
            park.img_park,
            park.imgbg_park
        ])

        return res.status(200).json({
            title: "Parc supprimé avec succès",
            status: 200,
            park
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            title: "Erreur lors de la suppression du parc",
            status: 500,
            error: error.message
        })
    }
}