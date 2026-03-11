import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Home from "./pages/home/Home";
import Practice from "./pages/practice/Practice";
import TheGate from "./pages/theGate/TheGate";
import "./i18n";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
  const isMobile = window.innerWidth < 768;
  if (isMobile) return <Navigate to="/" replace />;
  return <>{children}</>;
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
            <Route
              path="/the-gate"
              element={
                <DesktopOnly>
                  <TheGate />
                </DesktopOnly>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}