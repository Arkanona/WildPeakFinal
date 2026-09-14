import '../../styles/park/parkImage.scss';


function ParkImage({parks}){

    return (
        <>
        <section className='parkImage'>
            <div className='bgImagePark'
            style={{backgroundImage: `url(http://localhost:3000${parks.imgbg_park})`}}>
                <div>
                    <h1>Parc à thèmes</h1>
                    <p>Explorez les plus grands parcs d'attractions d'Europe.<br/> Des montagnes russes aux records impressionnants aux univers thématiques immersifs, <br/> découvrez où commence votre prochaine aventure.</p>
                </div>
            </div>
        </section>
        </>
    )
}
export default ParkImage