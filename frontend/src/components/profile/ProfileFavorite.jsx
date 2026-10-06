import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useFavoriteStore from '../../store/favorisStore'
import FavoriteButton from '../attraction/FavoriteButton'
import { getAttractions } from '../../services/api'
import '../../styles/park/cardAttraction.scss';
import useAuthStore from '../../store/authStore'


function ProfileFavorite(){

    const [attractions, setAttractions] = useState([])

    const token = useAuthStore((state) => state.token)

    const favorites = useFavoriteStore((state) => state.favorites)
    const fetchFavorites = useFavoriteStore((state) => state.fetchFavorites)

    useEffect(() => {
        const loadAttractions = async () => {
            try{
                const data = await getAttractions()
                setAttractions(data)
            }catch(error){
                console.error('Erreur lors du chargement des attractions :', error)
            }
        }
        loadAttractions()
    }, [])

    useEffect(() => {
        if (token) {
            fetchFavorites(token)
        }
    }, [token, fetchFavorites])

    const favoriteAttractions = attractions.filter((attraction) => 
        favorites.some((favorite) => Number(favorite.id_attraction) === Number(attraction.id_attraction))
    )

    if(favoriteAttractions.length === 0){
        return null
    }

    return(
        <section className='cardAttraction'>
            <div className='cardsContainerAttraction'>
            {favoriteAttractions.map((attraction) => (
                <Link to={`/attractions/${attraction.slug_attraction}`} key={attraction.id_attraction}>
                    <article >
                        <FavoriteButton attractionId={attraction.id_attraction}/>
                        <img src={`http://localhost:3000${attraction.img_attraction}`} alt={attraction.alt_attraction} />
                        <div>
                            <h3>{attraction.name_attraction}</h3>
                            <div className='location'>
                                <p>{attraction.short_description_attraction}</p>
                            </div>
                            <div className='divStatAttraction'>
                                <p>{attraction.speed_max_kmh_attraction} km/h</p>
                                <p><FontAwesomeIcon icon={faRotate} size="2xs" /> {attraction.inversion_attraction}</p>
                                <p>durée {attraction.duration_min_attraction} min</p>
                                <span>{attraction.type_attraction}</span>
                            </div>
                            </div>
                    </article>
                </Link>
            ))}
            </div>
        </section>
    )
}
export default ProfileFavorite