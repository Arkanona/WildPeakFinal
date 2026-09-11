import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import data from '../data/attraction.json';
import ComparisonImage from "../components/comparison/ComparisonImage";
import ComparisonBalanced from "../components/comparison/ComparisonBalanced";
import ComparisonCollapse2 from "../components/comparison/ComparisonCollapse2";


function Comparateur() {
    return (
        <>
        <title>Comparateur - WildPeak</title>
        <meta name="description" content="Comparez les attractions des parcs européens grâce à leurs statistiques et caractéristiques principales." />
        <Navbar/>
        <main>
            <ComparisonImage/>
            <ComparisonCollapse2 datas={data}/>
            <ComparisonBalanced/>
        </main>
        <Footer/>
        </>
    )
}

export default Comparateur