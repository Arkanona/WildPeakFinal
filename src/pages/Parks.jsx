import CardParks from "../components/park/CardParks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from '../data/attraction.json';


function Parks() {
    return (
        <>
        <Navbar/>
        <main>
            <section className='sectionCardPark'>
                <CardParks datas={data}/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default Parks