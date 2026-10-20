
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"

// Chargement différé des pages
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Parks = lazy(() => import("./pages/Parks"));
const ParksDetails = lazy(() => import("./pages/ParkDetails"));
const AttractionDetails = lazy(() => import("./pages/AttractionDetails"));
const AttractionComparison = lazy(() => import("./pages/AttractionComparison"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Attraction = lazy(() => import("./pages/Attraction"));
const AdminAttraction = lazy(() => import("./pages/AdminAttraction"));
const LegalInformation = lazy(() => import("./pages/LegalInformation"));

// Protection de la route administrateur
import AdminRoute from "./components/adminAttractions/AdminRoute";
import AdminParks from "./pages/AdminPark";

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
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
          <Route path="/informations-legales" element={<LegalInformation />} />
          <Route path="/404" element={<ErrorPage />} />
          <Route
            path="/admin-wild/attractions" element={
              <AdminRoute>
                <AdminAttraction />
              </AdminRoute> }/>
          <Route
            path="/admin-wild/parcs" element={
              <AdminRoute>
                <AdminParks />
              </AdminRoute> }/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
