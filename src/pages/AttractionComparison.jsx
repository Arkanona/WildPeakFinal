import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from '../data/attraction.json';
import ComparisonImage from "../components/comparison/ComparisonImage";
import ComparisonCollapse from "../components/comparison/ComparisonCollapse";


function AttractionComparison() {
    return (
        <>
        <Navbar/>
        <main>
            <ComparisonImage/>
            <ComparisonCollapse datas={data}/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionComparison