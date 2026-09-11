import { BrowserRouter as Router, Route, Routes } 
from "react-router-dom";

import Home from './pages/Home';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Parks from "./pages/Parks";
import ParksDetails from "./pages/ParkDetails";
import AttractionDetails from "./pages/AttractionDetails";
import AttractionComparison from "./pages/AttractionComparison";
import Comparateur from "./pages/Comparateur";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/parcs" element={<Parks />} />
        <Route path="/parcs/:id" element={<ParksDetails />} />
        <Route path="/attractions/:slug" element={<AttractionDetails />} />
        <Route path="/comparateur" element={<AttractionComparison />} />
        <Route path="/comparateur2" element={<Comparateur />} />
      </Routes>
    </Router>
  );
}

export default App;