import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import useFavoriteStore from '../../store/favorisStore';

function FavoriteButton({ attractionId }) {

    const favorites = useFavoriteStore((state) => state.favorites)
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)

    const isFavorite = favorites.includes(String(attractionId))

    const handleFavorite = (e) => {
        e.preventDefault()
        e.stopPropagation()

        toggleFavorite(attractionId)
    }

    return (
        <button
            onClick={handleFavorite}
            className={`favoriteButton ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} />
        </button>
    )
}

export default FavoriteButton