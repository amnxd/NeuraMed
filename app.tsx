import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Shop } from "./components/Shop";
import { Mindfulness } from "./components/Mindfulness";
import { Games } from "./components/Games";
import { Support } from "./components/Support";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Research } from "./components/Research";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandyMatchPage from "./pages/games/CandyMatchPage";
import HealAvatarPage from "./pages/games/HealAvatarPage";
import WordPuzzlePage from "./pages/games/WordPuzzlePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/games/candy-match" element={<CandyMatchPage />} />
          <Route path="/games/heal-avatar" element={<HealAvatarPage />} />
          <Route path="/games/word-puzzle" element={<WordPuzzlePage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Research />
      <Shop />
      <Mindfulness />
      <Games />
      <Support />
      <About />
      <Footer />
      
    </div>
  );
}
