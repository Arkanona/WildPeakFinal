import { useParams } from 'react-router-dom';
import '../../styles/attraction/attractionDetails.scss';
// import { findAttractionBySlug } from '../../utils/findAttractionBySlug';

function AboutAttractions ({attractions = []}){

    const { slug } = useParams()
    const attraction = attractions.find(
        (attraction) => attraction.slug_attraction === slug
    )
    if (!attraction) {
        return <p>Chargement...</p>
    }
    // const { attraction } = findAttractionBySlug(datas, slug)

    return (
        <>
        <section className="secAboutAttraction">
            <div>
                <div>
                    <span></span>
                    <h2>À PROPOS DE CETTE ATTRACTION</h2>
                </div>
                <p>{attraction?.description_attraction}</p>
            </div>
        </section>
        </>
    )
}
export default AboutAttractions