import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RepoDetails from './pages/RepoDetails';
import ComparePage from './pages/ComparePage';
import TrendingPage from './pages/TrendingPage';
import CollectionPage from './pages/CollectionPage';
import SearchPage from './pages/SearchPage';
import StatisticsPage from './pages/StatisticsPage';
import AboutPage from './pages/AboutPage';
import UseCasesPage from './pages/UseCasesPage';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode); 

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/repo/:repoId" element={<RepoDetails />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection/:collectionName" element={<CollectionPage />} />
        <Route path="/search/:searchTerm" element={<SearchPage />} />
        <Route path="/usecases" element={<UseCasesPage />} />
      </Routes>
      
      {}
      <Footer />
    </div>
  );
}