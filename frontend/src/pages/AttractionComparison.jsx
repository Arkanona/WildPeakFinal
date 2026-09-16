import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ComparisonImage from "../components/comparison/ComparisonImage";
import ComparisonCollapse from "../components/comparison/ComparisonCollapse";
import ComparisonBalanced from "../components/comparison/ComparisonBalanced";
import { getAttractions, getParks } from "../services/api";
import { useEffect, useState } from "react";


function AttractionComparison() {

    const [ attractions, setAttractions ] = useState([])
    const [ selectedAttraction, setSelectedAttraction] = useState([])
        
    useEffect(() => {
        getAttractions()
            .then(data => setAttractions(data))
            .catch(error => console.error(error))
    }, [])
    const [ parks, setParks ] = useState([])
        
    useEffect(() => {
        getParks()
            .then(data => setParks(data))
            .catch(error => console.error(error))
    }, [])
    return (
        <>
        <title>Comparateur - WildPeak</title>
        <meta name="description" content="Comparez les attractions des parcs européens grâce à leurs statistiques et caractéristiques principales." />
        <Navbar/>
        <main>
            <ComparisonImage/>
            <ComparisonCollapse attractions={attractions} parks={parks} selectedAttraction={selectedAttraction} setSelectedAttraction={setSelectedAttraction}/>
            <ComparisonBalanced/>
        </main>
        <Footer/>
        </>
    )
}

export default AttractionComparison