
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardAttraction from "../components/park/CardAttraction";
import ParkAttractionSec1 from "../components/park/ParkAttractionSec1";
import data from '../data/attraction.json';

function ParksDetails() {
    return (
        <>
        <Navbar/>
        <main>
            <ParkAttractionSec1 datas={data}/>
            <CardAttraction datas={data}/>
        </main>
        <Footer/>
        </>
    )
}

export default ParksDetails