import { useParams } from 'react-router-dom';
import '../../styles/attraction/attractionDetails.scss';
import { findAttractionBySlug } from '../../utils/findAttractionBySlug';

function AboutAttractions ({datas}){

    const { slug } = useParams()
    const { attraction } = findAttractionBySlug(datas, slug)

    return (
        <>
        <section className="secAboutAttraction">
            <div>
                <div>
                    <span></span>
                    <h2>À PROPOS DE CETTE ATTRACTION</h2>
                </div>
                <p>{attraction.description}</p>
            </div>
        </section>
        </>
    )
}
export default AboutAttractions