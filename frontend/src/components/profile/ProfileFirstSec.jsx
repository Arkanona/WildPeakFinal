import '../../styles/profile/profileFirstSec.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import useFavoriteStore from '../../store/favorisStore';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';

function ProfileFirstSec(){

    const favorites = useFavoriteStore((state) => state.favorites)
    const token = useAuthStore((state) => state.token)

    return(

        <>
        <section className='secFirstProfile'>
            <div className='divText'>
                <span></span>
                <h2>VOS FAVORIS</h2>
                <span></span>
            </div>
        </section>
        {!token ? (
                <section className='secHeart'>
                    <div>
                        <span><FontAwesomeIcon icon={faHeart} /></span>
                        <h2>Connectez-vous pour ajouter des favoris.</h2>
                        <p>Connectez-vous à votre compte pour enregistrer vos attractions préférées et les retrouver facilement ici.</p>
                        <Link to="/connexion">Se connecter</Link>
                    </div>
                </section>
            ) : (
                favorites.length === 0 && (
                    <section className='secHeart'>
                        <div>
                            <span><FontAwesomeIcon icon={faHeart} /></span>
                            <h2>Pas de favoris pour le moment.</h2>
                            <p>Commencez à explorer les attractions et appuyez <br />sur l'icône en forme de cœur pour enregistrer vos favoris ici.</p>
                        </div>
                    </section>
                )
            )}
        </>
    )
}
export default ProfileFirstSec