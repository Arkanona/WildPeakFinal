import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import useFavoriteStore from '../../store/favorisStore';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/profile/favoriteButton.scss"

function FavoriteButton({ attractionId }) {

    const [showPopup, setShowPopup] = useState(false)

    const favorites = useFavoriteStore((state) => state.favorites)
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)

    const token = useAuthStore((state) => state.token)

    const isFavorite = favorites.some(
        (favorite) =>
            Number(favorite.id_attraction) === Number(attractionId)
    )

    const handleFavorite = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!token) {
            setShowPopup(true)
            return
        }

        try {
            await toggleFavorite(attractionId, token)
        } catch (error) {
            console.error("Erreur lors de la modification des favoris :", error)
        }
    }

    const closePopup = (e) => {
        e?.preventDefault()
        e?.stopPropagation()
        setShowPopup(false)
    }

    return (
        <>
        <button
            onClick={handleFavorite}
            className={`favoriteButton ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} />
        </button>
        {showPopup && (
            <div
                className="favoritePopupOverlay"
                onClick={closePopup}
            >
                <div
                    className="favoritePopup"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="favoritePopupTitle"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <button
                        type="button"
                        className="closePopup"
                        onClick={closePopup}
                        aria-label="Fermer"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    <FontAwesomeIcon
                        icon={faHeartRegular}
                        className="popupHeart"
                    />

                    <h2 id="favoritePopupTitle">
                        Connexion requise
                    </h2>

                    <p>
                        Veuillez vous connecter pour ajouter
                        une attraction à vos favoris.
                    </p>

                    <div className="popupActions">
                        <button
                            type="button"
                            onClick={closePopup}
                            className="cancelButton"
                        >
                            Annuler
                        </button>

                        <Link
                            to="/connexion"
                            className="loginButton"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default FavoriteButton