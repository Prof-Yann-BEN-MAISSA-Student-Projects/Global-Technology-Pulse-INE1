import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RepoDetails from './pages/RepoDetails';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode); 

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repo/:repoId" element={<RepoDetails />} />
      </Routes>
      
      {/* The Footer stays on every page */}
      <Footer />
    </div>
  );
}