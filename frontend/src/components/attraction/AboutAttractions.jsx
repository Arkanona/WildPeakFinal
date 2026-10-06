import '../../styles/attraction/attractionDetails.scss';

function AboutAttractions ({attraction}){

    return (
        <section className="secAboutAttraction">
            <div>
                <div>
                    <span></span>
                    <h2>À PROPOS DE CETTE ATTRACTION</h2>
                </div>
                <p>{attraction?.description_attraction}</p>
            </div>
        </section>
    )
}
export default AboutAttractions