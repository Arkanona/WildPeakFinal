import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faCloudArrowUp, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import useAuthStore from "../../store/authStore"
import "../../styles/adminPark/adminParkModal.scss"

function AddParkModal({ park = null, mode = "create", onClose, onSaved, onUpdated }) {
    const token = useAuthStore((state) => state.token)
    const isEdit = mode === "edit"

    const [formData, setFormData] = useState({
        name_park: park?.name_park ?? "",
        country_park: park?.country_park ?? "",
        place_park: park?.place_park ?? "",
        opening_year_park: park?.opening_year_park ?? "",
        description_park: park?.description_park ?? ""
    })

    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        setImage(e.target.files?.[0] ?? null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!token) {
            setError("Vous devez être connecté en tant qu'administrateur.")
            return
        }

        if (!formData.name_park.trim()) {
            setError("Le nom du parc est obligatoire.")
            return
        }

        if (isEdit && !park?.id_park) {
            setError("Impossible de retrouver le parc à modifier.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const data = new FormData()

            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value ?? "")
            })

            if (image) {
                data.append("image", image)
            }

            const API_URL = import.meta.env.VITE_API_URL

            const url = isEdit
                ? `${API_URL}/api/v1/admin-wild/parcs/${park.id_park}`
                : `${API_URL}/api/v1/admin-wild/parcs`

            const response = await fetch(url, {
                method: isEdit ? "PATCH" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            })
            
            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.title ||
                    "Erreur lors de l'enregistrement du parc"
                )
            }

            if (!result.park) {
                throw new Error(
                    "Le serveur n'a pas retourné les informations du parc."
                )
            }

            if (isEdit) {
                onUpdated?.(result.park)
            } else {
                onSaved?.(result.park)
            }

            setShowSuccess(true)

            // Fermer la modal après le message de confirmation
            setTimeout(() => {
                onClose()
            }, 1500)

        } catch (error) {
            console.error("Erreur enregistrement parc :", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {showSuccess && (
                <div className="successPopup" role="status">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {isEdit
                        ? "Le parc a été modifié avec succès !"
                        : "Le parc a été ajouté avec succès !"}
                </div>
            )}

            <div className="modalOverlay" onClick={() => {
                    if (!loading && !showSuccess) onClose()}}>
                <div
                    className="addParkModal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="park-modal-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modalHeader">
                        <div>
                            <h2 id="park-modal-title">
                                {isEdit
                                    ? "Modifier un parc"
                                    : "Ajouter un parc"}
                            </h2>
                            <p>{isEdit
                                ? "Modifiez les informations de votre parc."
                                : "Remplissez les informations pour ajouter un nouveau parc."}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="closeModal"
                            onClick={onClose}
                            disabled={loading || showSuccess}
                            aria-label="Fermer la fenêtre"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="fullField">
                            <label htmlFor="name_park">Nom du parc</label>
                            <input
                                id="name_park"
                                type="text"
                                name="name_park"
                                value={formData.name_park}
                                onChange={handleChange}
                                placeholder="Ex : Europa-Park"
                                required
                                disabled={loading || showSuccess}
                            />
                        </div>
                        <div className="formGrid">
                            <div>
                                <label htmlFor="country_park">Pays</label>
                                <input
                                    id="country_park"
                                    type="text"
                                    name="country_park"
                                    value={formData.country_park}
                                    onChange={handleChange}
                                    placeholder="Ex : Allemagne"
                                    disabled={loading || showSuccess}
                                />
                            </div>
                            <div>
                                <label htmlFor="place_park">Localisation</label>
                                <input
                                    id="place_park"
                                    type="text"
                                    name="place_park"
                                    value={formData.place_park}
                                    onChange={handleChange}
                                    placeholder="Ex : Rust"
                                    disabled={loading || showSuccess}
                                />
                            </div>
                            <div>
                                <label htmlFor="opening_year_park">Année d'ouverture</label>
                                <input
                                    id="opening_year_park"
                                    type="number"
                                    name="opening_year_park"
                                    value={formData.opening_year_park}
                                    onChange={handleChange}
                                    placeholder="Ex : 1975"
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    disabled={loading || showSuccess}
                                />
                            </div>
                        </div>
                        <div className="descriptionField">
                            <label htmlFor="description_park">Description du parc</label>
                            <textarea
                                id="description_park"
                                name="description_park"
                                value={formData.description_park}
                                onChange={handleChange}
                                placeholder="Décrivez le parc..."
                                rows={5}
                                maxLength={2000}
                                disabled={loading || showSuccess}
                            />
                            <p className="characterCount">{formData.description_park.length} / 2000</p>
                        </div>
                        <div className="imageField">
                            <label htmlFor="park_image">
                                {isEdit
                                    ? "Remplacer l'image du parc"
                                    : "Image du parc"}
                            </label>
                            {isEdit && park?.img_park && !image && (
                                <div className="currentParkImage">
                                    <img
                                        src={
                                            park.img_park.startsWith("http")
                                                ? park.img_park
                                                : `${import.meta.env.VITE_API_URL}${park.img_park}`
                                        }
                                        alt={`Image actuelle du parc ${park.name_park}`}
                                    />
                                </div>
                            )}

                            <label htmlFor="park_image" className="uploadZone">
                                <FontAwesomeIcon icon={faCloudArrowUp} />

                                <strong>
                                    {image
                                        ? image.name
                                        : "Cliquez pour sélectionner une image"}
                                </strong>
                                <span>JPG, PNG ou WebP</span>
                            </label>
                            <input
                                id="park_image"
                                className="fileInput"
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={loading || showSuccess}
                            />
                        </div>

                        {error && (
                            <p className="modalError" role="alert">
                                {error}
                            </p>
                        )}

                        <div className="modalActions">
                            <button
                                type="button"
                                className="cancelButton"
                                onClick={onClose}
                                disabled={loading || showSuccess}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                className="submitButton"
                                disabled={loading || showSuccess}
                            >
                                {loading
                                    ? "Enregistrement..."
                                    : isEdit
                                        ? "Enregistrer les modifications"
                                        : "Ajouter le parc"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddParkModal