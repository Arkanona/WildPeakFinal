import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../styles/legal/legalMention.scss'
import '../../styles/legal/privacyPolicy.scss'
import { faClock, faCookieBite, faDatabase, faFileLines, faRotate, faShieldHalved, faTriangleExclamation, faUser } from '@fortawesome/free-solid-svg-icons'

function PrivacyPolicy() {
    return(
        <>
        <section id='PrivacyPolicy'>
            <div className='divPrivacyPolicy'>
                <span className="privacyVerticalLine"></span>
                <div>
                    <p className='pNumber'>02</p>
                    <h2>Politiques de confidentialités</h2>
                    <span className="privacyUnderline"></span>
                    <p>WildPeak accorde de l’importance à la protection de vos données personnelles.</p>
                </div>
            </div>
        </section>
        <section className='cardPrivacyPolicy'>
                <article>
                    <FontAwesomeIcon icon={faFileLines} />
                    <h3>DONNÉES COLLECTÉES</h3>
                    <p>Lors de la création et de l’utilisation de votre compte, WildPeak peut collecter les informations suivantes :</p>
                    <ul>
                        <li>Nom ou pseudo</li>
                        <li>Adresse e-mail</li>
                        <li>Mot de passe, stocké de manière sécurisée sous forme chiffrée</li>
                        <li>Attractions ajoutées aux favoris</li>
                    </ul>
                </article>
                <article>
                    <FontAwesomeIcon icon={faDatabase} />
                    <h3>UTILISATION DES DONNÉES</h3>
                    <p>Ces données sont utilisées uniquement pour :</p>
                    <ul>
                        <li>créer et gérer votre compte</li>
                        <li>vous permettre de vous connecter</li>
                        <li>enregistrer vos favoris</li>
                        <li>assurer le bon fonctionnement et la sécurité du site</li>
                    </ul>
                    <p>WildPeak ne vend pas vos données personnelles à des tiers.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faClock} />
                    <h3>CONSERVATION DES DONNÉES</h3>
                    <p>Les données liées à votre compte sont conservées pendant toute la durée d’utilisation de votre compte.</p>
                    <p>En cas de suppression du compte, les données associées sont supprimées, sauf obligation légale contraire.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <h3>SÉCURITÉ</h3>
                    <p>WildPeak met en place des mesures techniques afin de protéger vos données contre les accès non autorisés, la perte ou la modification.</p>
                </article>
                <article className='articleRights'>
                    <FontAwesomeIcon icon={faUser} />
                    <h3>VOS DROITS</h3>
                    <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
                    <ul>
                        <li>Droit d’accès : obtenir les données personnelles que WildPeak détient à votre sujet.</li>
                        <li>Droit de rectification : demander la correction de données incorrectes ou incomplètes.</li>
                        <li>Droit à l’effacement : demander la suppression de vos données personnelles, lorsque les conditions légales le permettent.</li>
                        <li>Droit à la limitation du traitement : demander que l’utilisation de certaines de vos données soit temporairement suspendue.</li>
                        <li>Droit à la portabilité : récupérer les données que vous avez fournies dans un format structuré et lisible par machine, lorsque ce droit est applicable.</li>
                        <li>Droit d’opposition : vous opposer à certains traitements de vos données personnelles.</li>
                    </ul>
                    <p>Pour exercer ces droits, vous pouvez nous contacter à l’adresse suivante :</p>
                    <p>E-mail : <span>arkanona@gmail.com</span></p>
                    <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez également déposer une réclamation auprès de la Commission Nationale de l’Informatique et des Libertés (CNIL).</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faRotate} />
                    <h3>MODIFICATION DE LA POLITIQUE</h3>
                    <p>Cette politique de confidentialité peut être mise à jour afin de tenir compte des évolutions du site ou de la réglementation.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faCookieBite} />
                    <h3>COOKIES</h3>
                    <p>Le site WildPeak peut être amené à vous demander l’acceptation des cookies pour des besoins de statistiques et d’affichage. <br />Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez. <br />Certaines parties de ce site ne peuvent être fonctionnelles sans l’acceptation de cookies. <br />WildPeak utilise des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies optionnels pour améliorer votre expérience. <br />Vous pouvez accepter, refuser ou modifier vos préférences à tout moment.</p>
                </article>
                <article>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                    <h3>LIMITATION CONTRACTUELLE SUR LES DONNÉES</h3>
                    <div>
                        <p>Les informations contenues sur ce site sont aussi précises que possible, mais peuvent toutefois contenir des inexactitudes ou des omissions.</p>
                        <p>Si vous constatez une lacune, erreur ou dysfonctionnement, merci de le signaler par courriel à <span>arkanona@gmail.com</span>, en décrivant le problème de la manière la plus précise possible.</p>
                        <p>Tout contenu téléchargé se fait aux risques et périls de l’utilisateur et sous sa seule responsabilité.</p>
                        <p>L’utilisateur s’engage à accéder au site avec un matériel récent, sans virus, et avec un navigateur de dernière génération mis à jour.</p>
                        <p>Les liens hypertextes vers d’autres ressources sur Internet ne sauraient engager la responsabilité de WildPeak.</p>
                    </div>
                </article>
            </section>
        </>
    )
}
export default PrivacyPolicy