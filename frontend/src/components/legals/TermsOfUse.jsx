import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/legal/legalMention.scss'
import '../../styles/legal/termsUse.scss';
import { faGear, faGlobe, faLaptopCode, faShieldHalved, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function TermsOfUse(){

    return (
        <>
            <section id='TermsOfUse'>
            <div className='divTermsOfUse'>
                    <span className="termsVerticalLine"></span>
                    <div>
                        <p className='pNumber'>03</p>
                        <h2>Conditions d’utilisations</h2>
                        <span className="termsUnderline"></span>
                        <p>Les règles d’utilisation de WildPeak pour une expérience en toute sérénité.</p>
                    </div>
            </div>
            </section>
            <section className='cardTermsOfUse'>
                <article>
                    <FontAwesomeIcon icon={faLaptopCode} />
                    <h3>LANGAGES ET TECHNOLOGIES UTILISÉES</h3>
                    <p>Le site WildPeak est proposé en différents langages web (HTML5, Javascript, CSS, etc...) pour un meilleur confort d’utilisation et un graphisme plus agréable.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faGlobe} />
                    <h3>NAVIGATEURS RECOMMANDÉS</h3>
                    <p>Nous vous recommandons de recourir à des navigateurs modernes comme Safari, Firefox, Google Chrome, etc... pour profiter pleinement de toutes les fonctionnalités du site.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faGear} />
                    <h3>FIABILITÉ DES INFORMATIONS</h3>
                    <p>WildPeak met en œuvre tous les moyens dont elle dispose, pour assurer une information fiable et une mise à jour fiable de ses sites internet. Toutefois, des erreurs ou omissions peuvent survenir.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <h3>RESPONSABILITÉ DE L’UTILISATEUR</h3>
                    <p>L’internaute devra donc s’assurer de l’exactitude des informations auprès de WildPeak et signaler toutes modifications du site qu’il jugerait utile.</p>
                    <p>WildPeak n’est en aucun cas responsable de l’utilisation faite de ces informations, et de tout préjudice direct ou indirect pouvant en découler.</p>
                </article>
                <article className='articleAcceptance'>
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <h3>ACCEPTATION DES CONDITIONS</h3>
                     <p>En utilisant le site WildPeak, vous reconnaissez avoir lu, compris et accepté les présentes conditions d’utilisation.</p>
                    <p>Celles-ci peuvent être modifiées à tout moment afin de tenir compte des évolutions du site ou de la réglementation.</p>
                    <p>Nous vous invitons à les consulter régulièrement.</p>
                </article>
            </section>
        </>
    )
}
export default TermsOfUse