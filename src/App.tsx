import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Home from "./pages/home/Home";
import Practice from "./pages/practice/Practice";
import "./i18n";

// Remonte en haut à chaque changement de route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="appWrapper">
        <Header />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}