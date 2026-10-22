import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/legal/legalMention.scss';
import { faBuilding, faCopyright, faServer, faImages } from '@fortawesome/free-solid-svg-icons';
import imageCredits from '../../data/imageCredits.json';

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
                        <li>Téléphone : 07.49.29.16.50 </li> 
                        <li>E-mail : arkanona@gmail.com</li>
                    </ul>
                </article>
                <article>
                    <FontAwesomeIcon icon={faServer} />
                    <h3>Les mentions relatives à l’hébergeur du site internet</h3>
                    <h4>1. Hébergement du frontend — Vercel</h4>
                    <ul>
                        <li>Raison sociale : Vercel Inc.</li>
                        <li>Adresse : 440 N Barranca Avenue 4133, Covina, CA 91723, États-Unis.</li>
                        <li>Site internet : https://vercel.com</li>
                        <li>Téléphone : À compléter après vérification auprès de Vercel.</li>
                    </ul>
                    <h4>2. Hébergement du backend — Render</h4>
                    <ul>
                        <li>Raison sociale : Render Services, Inc.</li>
                        <li>Adresse : 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis.</li>
                        <li>Site internet : https://render.com</li>
                        <li>Téléphone : +1 415-319-8186</li>
                    </ul>
                </article>
                <article>
                    <FontAwesomeIcon icon={faCopyright} />
                    <h3>Les mentions relatives à la propriété intellectuelle</h3>            
                    <p>L'ensemble des éléments originaux du site WildPeak(design, code source, textes et structure) est protégé par le droit de la propriété intellectuelle.
                    <br />
                    <br />
                    Les photographies des parcs et attractions proviennent notamment de Wikimedia Commons et Flickr. Elles sont utilisées conformément aux licences indiquées dans les crédits photographiques. Certaines ont été retouchées à l'aide de l'intelligence artificielle, tandis que d'autres ont été entièrement générées par IA.
                    <br />
                    <br />
                    Les auteurs, sources, licences et modifications sont détaillés dans la section « Crédits photographiques » ci-dessous.
                    <br />
                    <br />
                    Les noms, marques et logos des parcs restent la propriété de leurs titulaires respectifs. WildPeak est un projet pédagogique indépendant, sans affiliation officielle avec les parcs d'attractions présentés.
                    </p>
                </article>
                <article className="cardImageCredits">
                    <FontAwesomeIcon icon={faImages} />
                    <h3>Crédits photographiques</h3>
                    <p className="creditsIntroduction">
                        Les photographies utilisées sur WildPeak proviennent
                        notamment de Wikimedia Commons et de Flickr.
                        Leurs auteurs et licences respectives sont
                        mentionnés ci-dessous.
                    </p>
                    <div className="creditsGrid">
                        {imageCredits.map((image) => (
                            <div className="creditItem" key={image.sourceUrl}>
                                <h4>{image.name}</h4>
                                <p className="creditPark">{image.park}</p>
                                <ul>
                                    <li>
                                        <strong>Auteur :</strong> {image.author}
                                    </li>
                                    <li>
                                        <strong>Source : </strong>
                                        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                                            {image.source}
                                        </a>
                                    </li>
                                    <li>
                                        <strong>Licence : </strong>
                                        {image.licenseUrl ? (
                                            <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">
                                                {image.license}
                                            </a>
                                        ) : (
                                            <span>{image.license}</span>
                                        )}
                                    </li>
                                    {image.modified && (
                                        <li>
                                            <strong>Modifications :</strong> retouches
                                            effectuées avec l'intelligence
                                            artificielle, notamment pour supprimer
                                            les personnes visibles.
                                        </li>
                                    )}
                                    {image.modified &&
                                        image.license.includes("BY-SA") && (
                                            <li>
                                                <strong>Adaptation :</strong> version
                                                modifiée diffusée sous la licence
                                                CC BY-SA indiquée ci-dessus.
                                            </li>
                                        )}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <p className="creditsDisclaimer">
                        WildPeak est un projet indépendant, sans affiliation
                        officielle avec les parcs présentés. Les photographies
                        restent soumises aux droits de leurs auteurs et aux
                        éventuels droits de tiers sur les éléments représentés.
                    </p>
                </article>
            </section>
        </>
    )
}
export default LegalMention