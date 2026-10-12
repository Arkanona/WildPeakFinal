import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import '../../styles/adminAttraction/adminAttractionModal.scss'
import useAuthStore from "../../store/authStore"

function AddAttractionModal({ parks = [], onClose }) {

    const token = useAuthStore((state) => state.token)

    const [formData, setFormData] = useState({
    name_attraction: "",
    id_park: "",
    type_attraction: "",
    speed_max_kmh_attraction: "",
    height_m_attraction: "",
    length_m_attraction: "",
    duration_min_attraction: "",
    inversion_attraction: "",
    minimum_height_cm_attraction: "",
    opening_year_attraction: "",
    description_attraction: "",
    parc_zone_attraction: "",
    intensity_level_attraction: "",
    family_friendly_attraction: false,
    short_description_attraction: ""
})

    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setImage(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()

            data.append("name_attraction", formData.name_attraction)
            data.append("id_park", formData.id_park)
            data.append("type_attraction", formData.type_attraction)
            data.append("speed_max_kmh_attraction", formData.speed_max_kmh_attraction)
            data.append("height_m_attraction", formData.height_m_attraction)
            data.append("length_m_attraction", formData.length_m_attraction)
            data.append("duration_min_attraction", formData.duration_min_attraction)
            data.append("inversion_attraction", formData.inversion_attraction)
            data.append("minimum_height_cm_attraction", formData.minimum_height_cm_attraction)
            data.append("opening_year_attraction", formData.opening_year_attraction)
            data.append("description_attraction", formData.description_attraction)
            data.append("parc_zone_attraction", formData.parc_zone_attraction)
            data.append("intensity_level_attraction", formData.intensity_level_attraction)
            data.append("family_friendly_attraction", formData.family_friendly_attraction)
            data.append("short_description_attraction", formData.short_description_attraction)

            if (image) {
                data.append("image", image)
            }


            const response = await fetch(
                "http://localhost:3000/api/v1/admin-wild",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'ajout")
            }

            console.log("Attraction ajoutée :", result)

            onClose()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div
                className="addAttractionModal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <div>
                        <h2>Ajouter une attraction</h2>
                        <p>Ajoutez une nouvelle attraction au catalogue</p>
                    </div>

                    <button
                        type="button"
                        className="closeModal"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="fullField">
                        <label htmlFor="name_attraction">
                            Nom de l'attraction
                        </label>

                        <input
                            type="text"
                            id="name_attraction"
                            name="name_attraction"
                            value={formData.name_attraction}
                            onChange={handleChange}
                            placeholder="Ex : Toutatis"
                        />
                    </div>

                    <div className="formGrid">
                        <div>
                            <label htmlFor="id_park">Parc</label>

                            <select
                                id="id_park"
                                name="id_park"
                                value={formData.id_park}
                                onChange={handleChange}
                            >
                                <option value="">Choisir un parc</option>

                                {parks.map((park) => (
                                    <option
                                        key={park.id_park}
                                        value={park.id_park}
                                    >
                                        {park.name_park}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="type_attraction">Type</label>

                            <input
                                type="text"
                                id="type_attraction"
                                name="type_attraction"
                                value={formData.type_attraction}
                                onChange={handleChange}
                                placeholder="Ex : Montagnes russes"
                            />
                        </div>
                        <div>
                            <label htmlFor="parc_zone_attraction">
                                Zone du parc
                            </label>

                            <input
                                type="text"
                                id="parc_zone_attraction"
                                name="parc_zone_attraction"
                                value={formData.parc_zone_attraction}
                                onChange={handleChange}
                                placeholder="Ex : Parc Astérix — Égypte"
                            />
                        </div>
                        <div>
                            <label htmlFor="intensity_level_attraction">
                                Niveau d'intensité
                            </label>

                            <select
                                id="intensity_level_attraction"
                                name="intensity_level_attraction"
                                value={formData.intensity_level_attraction}
                                onChange={handleChange}
                            >
                                <option value="">Choisir un niveau</option>
                                <option value="calme">Calme</option>
                                <option value="modere">Modéré</option>
                                <option value="extreme">Extrême</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="speed_max_kmh_attraction">
                                Vitesse max (km/h)
                            </label>

                            <input
                                type="number"
                                id="speed_max_kmh_attraction"
                                name="speed_max_kmh_attraction"
                                value={formData.speed_max_kmh_attraction}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="height_m_attraction">
                                Hauteur (m)
                            </label>

                            <input
                                type="number"
                                id="height_m_attraction"
                                name="height_m_attraction"
                                value={formData.height_m_attraction}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="length_m_attraction">
                                Longueur (m)
                            </label>

                            <input
                                type="number"
                                id="length_m_attraction"
                                name="length_m_attraction"
                                value={formData.length_m_attraction}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="duration_min_attraction">
                                Durée (min)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                id="duration_min_attraction"
                                name="duration_min_attraction"
                                value={formData.duration_min_attraction}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="inversion_attraction">
                                Inversions
                            </label>

                            <input
                                type="number"
                                id="inversion_attraction"
                                name="inversion_attraction"
                                value={formData.inversion_attraction}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="minimum_height_cm_attraction">
                                Taille minimum (cm)
                            </label>

                            <input
                                type="number"
                                id="minimum_height_cm_attraction"
                                name="minimum_height_cm_attraction"
                                value={formData.minimum_height_cm_attraction}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="opening_year_attraction">
                                Année d'ouverture
                            </label>

                            <input
                                type="number"
                                id="opening_year_attraction"
                                name="opening_year_attraction"
                                value={formData.opening_year_attraction}
                                onChange={handleChange}
                                placeholder="Ex : 2019"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div className="checkboxField">
                            <input
                                type="checkbox"
                                id="family_friendly_attraction"
                                name="family_friendly_attraction"
                                checked={formData.family_friendly_attraction}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        family_friendly_attraction: e.target.checked
                                    }))
                                }
                            />

                            <label htmlFor="family_friendly_attraction">
                                Attraction familiale
                            </label>
                        </div>
                    </div>
                    <div className="descriptionField">
                        <label htmlFor="description_attraction">
                            Description de l'attraction
                        </label>

                        <textarea
                            id="description_attraction"
                            name="description_attraction"
                            value={formData.description_attraction}
                            onChange={handleChange}
                            placeholder="Décrivez brièvement l'attraction..."
                            maxLength={1000}
                        />
                        <p className="characterCount">
                            {formData.description_attraction.length} / 1000
                        </p>
                    </div>
                    <div className="descriptionField">
                        <label htmlFor="short_description_attraction">
                            Description courte
                        </label>

                        <textarea
                            id="short_description_attraction"
                            name="short_description_attraction"
                            value={formData.short_description_attraction}
                            onChange={handleChange}
                            placeholder="Ex : Un coaster rapide avec plusieurs lancements..."
                            maxLength={150}
                        />

                        <p className="characterCount">
                            {formData.short_description_attraction.length} / 150
                        </p>
                    </div>

                    <div className="imageField">
                        <label htmlFor="image">
                            Image de l'attraction
                        </label>

                        <label className="uploadZone" htmlFor="image">
                            <FontAwesomeIcon icon={faCloudArrowUp} />

                            <strong>
                                {image
                                    ? image.name
                                    : "Cliquez pour ajouter une image"}
                            </strong>

                            <span>
                                JPG, PNG ou WebP
                            </span>
                        </label>

                        <input
                            type="file"
                            id="image"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            hidden
                        />
                    </div>

                    <div className="modalActions">
                        <button
                            type="button"
                            className="cancelButton"
                            onClick={onClose}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="submitButton"
                        >
                            Ajouter l'attraction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddAttractionModal