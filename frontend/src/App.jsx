import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import { useState } from 'react';
import Footer from './components/Footer';
import TrendingSection from './components/TrendingSection';
import CollectionsSection from './components/CollectionsSection';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = ()=>{
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>
      <HeroSection />
      <TrendingSection />
      <CollectionsSection />
      <Footer />
    </div>
  );
}