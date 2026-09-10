import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from '../data/attraction.json';
import ComparisonImage from "../components/comparison/ComparisonImage";
import ComparisonCollapse from "../components/comparison/ComparisonCollapse";
import ComparisonBalanced from "../components/comparison/ComparisonBalanced";


function AttractionComparison() {
    return (
        <>
        <title>Comparateur - WildPeak</title>
        <meta name="description" content="Comparez les attractions des parcs européens grâce à leurs statistiques et caractéristiques principales." />
        <Navbar/>
        <main>
            <ComparisonImage/>
            <ComparisonCollapse datas={data}/>
            <ComparisonBalanced/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionComparison