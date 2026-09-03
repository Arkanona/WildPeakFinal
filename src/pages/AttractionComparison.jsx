import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import data from '../data/attraction.json';
import ComparisonImage from "../components/comparison/ComparisonImage";


function AttractionComparison() {
    return (
        <>
        <Navbar/>
        <main>
            <ComparisonImage/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionComparison