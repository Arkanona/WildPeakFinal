import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"

import useAuthStore from "../../store/authStore"
import useFavoriteStore from "../../store/favorisStore"

import "../../styles/legal/deleteAccountModal.scss"

function DeleteAccountModal({ onClose }) {
    const navigate = useNavigate()

    const token = useAuthStore((state) => state.token)
    const logout = useAuthStore((state) => state.logout)
    const clearFavorites = useFavoriteStore((state) => state.clearFavorites)

    const [password, setPassword] = useState("")
    const [confirmed, setConfirmed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleDeleteAccount = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!token) {
            setError("Vous devez être connecté.")
            return
        }

        if (!password || !confirmed) {
            setError("Veuillez confirmer la suppression.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/profile/account`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password })
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.title ||
                    "Impossible de supprimer le compte."
                )
            }

            // Déconnexion de l'utilisateur
            logout()

            // Nettoyage des favoris
            clearFavorites()

            // Suppression des informations persistées dans localStorage
            await useAuthStore.persist.clearStorage()

            // Fermeture et redirection
            onClose()
            navigate("/", { replace: true })
            

        } catch (err) {
            console.error("Erreur suppression du compte :", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="deleteAccountOverlay">
            <div
                className="deleteAccountModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="deleteAccountTitle"
                aria-describedby="deleteAccountDescription"
            >
                <button
                    className="closeModal"
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Fermer"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div className="warningIcon">
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                    />
                </div>
                <h2 id="deleteAccountTitle">Supprimer mon compte</h2>
                <p id="deleteAccountDescription">Êtes-vous sûr de vouloir supprimer définitivement votre compte WildPeak ? Vos favoris et vos données de compte seront supprimés.</p>

                <form onSubmit={handleDeleteAccount}>
                    <label htmlFor="deletePassword">Confirmez votre mot de passe</label>

                    <input
                        id="deletePassword"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        disabled={loading}
                    />

                    <label className="confirmCheckbox">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) =>
                                setConfirmed(e.target.checked)
                            }
                            disabled={loading}
                        />
                        <span>Je comprends que cette action est définitive et irréversible.</span>
                    </label>

                    {error && (
                        <p className="deleteError" role="alert">{error}</p>
                    )}

                    <div className="modalActions">
                        <button
                            type="button"
                            className="cancelButton"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="deleteButton"
                            disabled={
                                loading ||
                                !confirmed ||
                                !password
                            }
                        >
                            {loading
                                ? "Suppression..."
                                : "Supprimer définitivement"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DeleteAccountModal