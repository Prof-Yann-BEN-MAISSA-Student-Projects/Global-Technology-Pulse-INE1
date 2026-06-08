import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { FiArrowLeft, FiFilter, FiBriefcase, FiMapPin, FiCpu } from 'react-icons/fi';
import '../css/RepoDetails.css';

export default function UseCasesPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtres actuels
  const [domain, setDomain] = useState('');
  const [country, setCountry] = useState('');

  // Scénarios pré-définis (Professionnels)
  const scenarios = [
    {
      title: "Développeur Mobile au Maroc",
      description: "Recherche les frameworks mobiles les plus populaires au Maroc pour le marché local.",
      domain: "Mobile",
      country: "Maroc",
      icon: <FiMapPin style={{ color: '#10b981' }} />
    },
    {
      title: "Architecte SGBD en France",
      description: "Explore les bases de données les plus adoptées en France pour orienter ses choix techniques.",
      domain: "Database",
      country: "France",
      icon: <FiBriefcase style={{ color: '#3b82f6' }} />
    },
    {
      title: "Spécialiste Intelligence Artificielle",
      description: "Veille technologique sur les modèles LLM et algorithmes d'IA les plus populaires au monde.",
      domain: "AI",
      country: "Global",
      icon: <FiCpu style={{ color: '#a855f7' }} />
    },
    {
      title: "Ingénieur Web Fullstack",
      description: "Analyse des outils Web (Frontend & Backend) de référence à l'échelle mondiale.",
      domain: "Web",
      country: "Global",
      icon: <FiBriefcase style={{ color: '#f59e0b' }} />
    },
    {
      title: "Data Scientist (Analyse & Big Data)",
      description: "Recherche d'outils et librairies essentiels pour le traitement de la donnée.",
      domain: "Data Science",
      country: "Global",
      icon: <FiCpu style={{ color: '#ec4899' }} />
    },
    {
      title: "Expert DevOps & Cloud",
      description: "Outils de conteneurisation et déploiement continu les plus prisés globalement.",
      domain: "DevOps",
      country: "Global",
      icon: <FiMapPin style={{ color: '#06b6d4' }} />
    }
  ];

  const fetchFilteredProjects = async (selectedDomain, selectedCountry) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedDomain) params.append('domain', selectedDomain);
      if (selectedCountry) params.append('country', selectedCountry);

      const response = await axios.get(`http://localhost:2500/api/projects/usecases/filter?${params.toString()}`);
      
      const formattedData = response.data.map(project => {
        const [authorName, repoName] = project.full_name ? project.full_name.split('/') : ['Auteur', 'Projet'];
        return {
          id: project.full_name,
          author: authorName,
          name: repoName,
          description: project.description,
          language: project.language,
          stars: project.stargazers_count > 1000 ? (project.stargazers_count / 1000).toFixed(1) + 'k' : project.stargazers_count,
          forks: project.forks_count > 1000 ? (project.forks_count / 1000).toFixed(1) + 'k' : project.forks_count,
          trend: 'Match'
        };
      });

      setResults(formattedData);
    } catch (err) {
      console.error("Erreur lors du filtrage :", err);
      setError("Impossible de charger les résultats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain || country) {
      fetchFilteredProjects(domain, country);
    }
  }, [domain, country]);

  const applyScenario = (scenario) => {
    setDomain(scenario.domain);
    setCountry(scenario.country);
  };

  return (
    <div className="trending-section repo-details-page" style={{ minHeight: '80vh', padding: '6rem 4rem 4rem 4rem' }}>
      
      <div className="nav-actions" style={{ marginBottom: '2rem' }}>
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Retourner
        </button>
      </div>

      <div className="section-header">
        <h2>Cas d'Usage (Use Cases)</h2>
        <p>Explorez les technologies selon des profils professionnels et zones géographiques.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {scenarios.map((sc, index) => (
          <div 
            key={index}
            className="stat-item" 
            style={{ flex: '1 1 300px', cursor: 'pointer', transition: 'all 0.3s ease', border: domain === sc.domain && country === sc.country ? '1px solid #3b82f6' : '' }}
            onClick={() => applyScenario(sc)}
          >
            <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              {sc.icon}
            </div>
            <div className="stat-details">
              <span className="value" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{sc.title}</span>
              <span className="label" style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.8 }}>{sc.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', flexWrap: 'wrap' }}>
        <FiFilter style={{ color: '#0ff', fontSize: '1.5rem' }} />
        <h3 style={{ margin: 0, color: '#fff' }}>Filtres Personnalisés :</h3>
        
        <select 
          style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="">Tous les Domaines</option>
          <option value="Mobile">Développement Mobile</option>
          <option value="Web">Développement Web</option>
          <option value="Database">Bases de Données (SGBD)</option>
          <option value="AI">Intelligence Artificielle (IA/LLM)</option>
          <option value="Data Science">Data Science & Analytics</option>
          <option value="DevOps">DevOps & Cloud</option>
        </select>

        <select 
          style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Tous les Pays</option>
          <option value="Maroc">Maroc</option>
          <option value="France">France</option>
          <option value="Global">Global (Monde)</option>
        </select>
      </div>

      {/* Résultats */}
      {loading ? (
        <p style={{ color: '#0ff', fontSize: '1.2rem' }}>Recherche spatiale en cours...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : results.length > 0 ? (
        <div className="repo-grid">
          {results.map((repo) => (
            <RepoCard key={repo.id} repo={repo} /> 
          ))}
        </div>
      ) : (domain || country) ? (
        <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>
          Aucun projet ne correspond exactement à ces critères (Domaine: {domain || "Tout"}, Pays: {country || "Tout"}).
        </p>
      ) : (
        <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>Sélectionnez un scénario ou des filtres pour afficher les recommandations.</p>
      )}

    </div>
  );
}
