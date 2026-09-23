import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileFirstSec from "../components/profile/ProfileFirstSec";
import ProfileFavorite from "../components/profile/ProfileFavorite";


function Profile() {
    
    
    return (
        <>
        <title>Profile - WildPeak</title>
        <meta name="description" content="Consultez et gérez votre profil WildPeak, retrouvez vos informations personnelles et accédez facilement aux fonctionnalités liées à votre compte."/>   
        <Navbar/>
        <main>
            <ProfileFirstSec/>
            <ProfileFavorite/>
        </main>
        <Footer/>
        </>
    )
}

export default Profile