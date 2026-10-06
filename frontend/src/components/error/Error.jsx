import { Link } from 'react-router-dom';
import '../../styles/error/error.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHouse } from "@fortawesome/free-solid-svg-icons";

function ErrorSec() {

    return(
        <section className='secError'>
            <img src="../../../assets/ErrorPage.webp" alt="Image 404" />
            <h1>Oups ! cette attraction <br />n'existe pas.</h1>
            <p>La page que vous chercher semble avoir déraillé. <br />Revenez à l'accueil.</p>
            <Link to='/'><FontAwesomeIcon icon={faHouse} /> Revenir à l'accueil <FontAwesomeIcon icon={faArrowRight} /></Link>
        </section>
    )
}

export default ErrorSec