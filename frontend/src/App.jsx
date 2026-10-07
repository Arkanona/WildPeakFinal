import { BrowserRouter as Router, Route, Routes } 
from "react-router-dom";

import Home from './pages/Home';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Parks from "./pages/Parks";
import ParksDetails from "./pages/ParkDetails";
import AttractionDetails from "./pages/AttractionDetails";
import AttractionComparison from "./pages/AttractionComparison";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Attraction from "./pages/Attraction";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/reinitialiser-mot-de-passe/:token" element={<ResetPassword />} />
        <Route path="/parcs" element={<Parks />} />
        <Route path="/parcs/:id" element={<ParksDetails />} />
        <Route path="/attractions" element={<Attraction />} />
        <Route path="/attractions/:slug" element={<AttractionDetails />} />
        <Route path="/comparateur" element={<AttractionComparison />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/404" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;