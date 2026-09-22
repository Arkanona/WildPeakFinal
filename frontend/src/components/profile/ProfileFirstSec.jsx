import '../../styles/profile/profileFirstSec.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons';

function ProfileFirstSec(){

    return(

        <>
        <section className='secFirstProfile'>
            <div className='divText'>
                <span></span>
                <h2>VOS FAVORIS</h2>
                <span></span>
            </div>
        </section>
        <section className='secHeart'>
            <div>
                <span><FontAwesomeIcon icon={faHeart} /></span>
                <h2>Pas de favoris pour le moment.</h2>
                <p> Commencez à explorer les attractions et appuyez <br /> sur l'icône en forme de cœur  pour enregistrer vos favoris ici.</p>
            </div>
        </section>
        </>
    )
}
export default ProfileFirstSec