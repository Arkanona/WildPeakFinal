import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import useFavoriteStore from '../../store/favorisStore';
import useAuthStore from '../../store/authStore';

function FavoriteButton({ attractionId }) {

    const favorites = useFavoriteStore((state) => state.favorites)
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite)

    const token = useAuthStore((state) => state.token)

    const isFavorite = favorites.some((favorite) => Number(favorite.id_attraction) === Number(attractionId))

    const handleFavorite = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if(!token) {
            console.error('Utilisateur non connecté')
            return
        }

        await toggleFavorite(attractionId, token)
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