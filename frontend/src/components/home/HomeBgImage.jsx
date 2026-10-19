import '../../styles/home/home.scss';

function HomeImage(){

    return (
        <section className='homeImage'>
            <div className='bgImageHome'>
                 <img
                    src="/assets/accueilbg.webp"
                    alt="Image d'un coucher de soleil sur un parc d'attraction."
                    className="heroImage"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                />
                <div className='heroContent'>
                    <h1>TA PROCHAINE AVENTURE COMMENCE ICI</h1>
                    <p>Découvre, compare et explore les attractions qui te feront vivre tes prochaines sensations fortes.</p>
                </div>
            </div>
        </section>
    )
}
export default HomeImage