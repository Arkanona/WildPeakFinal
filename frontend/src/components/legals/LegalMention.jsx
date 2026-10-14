import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/legal/legalMention.scss';
import { faBuilding, faUserTie } from '@fortawesome/free-solid-svg-icons';

function LegalMention(){

    return (
        <>
            <section id='LegalMention'>
            <div className='divLegalMention'>
                    <span className="legalVerticalLine"></span>
                    <div>
                        <p className='pNumber'>01</p>
                        <h2>MENTIONS LÉGALES</h2>
                        <span className="legalUnderline"></span>
                        <p>Conformément aux dispositions légales en vigueur, vous trouverez ci-dessous l'ensemble des <br /> informations relatives à l'éditeur, à l'hébergeur et aux droits applicables au site WildPeak.</p>
                    </div>
            </div>
            </section>
            <section className='cardLegalMention'>
                <article>
                    <FontAwesomeIcon icon={faBuilding} />
                    <h3>Les mentions d’identifications</h3>
                    <ul>
                        <li>Gallardo Enzo</li>
                        <li>Sièges sociale : 201 chemin du labonet, 83136 Ste Anastasie sur issole, France</li>
                        <li>Contact : 07.49.29.16.50 – arkanona@gmail.com</li>
                    </ul>
                </article>
                <article>
                    <FontAwesomeIcon icon={faUserTie} />
                    <h3>Les mentions relatives à l’hébergeur du site internet</h3>
                    <ul>
                        <li>nom de l'hébergeur</li>
                        <li>raison sociale</li>
                        <li>adresse</li>
                        <li>numéro SIRET</li>
                        <li>numéro de téléphone.</li>
                    </ul>
                </article>
                <article>
                    <FontAwesomeIcon icon={faUserTie} />
                    <h3>Les mentions relatives à la propriété intellectuelle</h3>
                    <p>Visuels utilisés à titre d'illustration pédagogique, tous droits réservés à leurs propriétaires respectifs. Utilisation d’images générées par IA.</p>
                </article>
            </section>
        </>
    )
}
export default LegalMention