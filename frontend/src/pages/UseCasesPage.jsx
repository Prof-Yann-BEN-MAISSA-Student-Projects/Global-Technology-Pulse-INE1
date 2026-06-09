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
      title: "Mobile Developer in Morocco",
      description: "Search for the most popular mobile frameworks in Morocco for the local market.",
      domain: "Mobile",
      country: "Maroc",
      icon: <FiMapPin style={{ color: '#10b981' }} />
    },
    {
      title: "Database Architect in France",
      description: "Explore the most widely adopted database systems in France to guide tech stack choices.",
      domain: "Database",
      country: "France",
      icon: <FiBriefcase style={{ color: '#3b82f6' }} />
    },
    {
      title: "Artificial Intelligence Specialist",
      description: "Monitor state-of-the-art LLMs and popular AI algorithms globally.",
      domain: "AI",
      country: "Global",
      icon: <FiCpu style={{ color: '#a855f7' }} />
    },
    {
      title: "Fullstack Web Engineer",
      description: "Analyze reference Web development tools (Frontend & Backend) globally.",
      domain: "Web",
      country: "Global",
      icon: <FiBriefcase style={{ color: '#f59e0b' }} />
    },
    {
      title: "Data Scientist (Analytics & Big Data)",
      description: "Discover essential tools and libraries for heavy data processing and workflows.",
      domain: "Data Science",
      country: "Global",
      icon: <FiCpu style={{ color: '#ec4899' }} />
    },
    {
      title: "DevOps & Cloud Expert",
      description: "Examine containerization and continuous deployment tools favored worldwide.",
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
        const [authorName, repoName] = project.full_name ? project.full_name.split('/') : ['Author', 'Project'];
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
      console.error("Error filtering projects:", err);
      setError("Unable to load results.");
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
    <div className="trending-section repo-details-page use-cases-container" style={{ minHeight: '80vh' }}>
      
      <div className="nav-actions" style={{ marginBottom: '2rem', width: '100%' }}>
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
      </div>

      <div className="section-header">
        <h2>Use Cases</h2>
        <p>Explore technologies based on professional profiles and geographic regions.</p>
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

      <div className="filter-bar" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', flexWrap: 'wrap' }}>
        <FiFilter style={{ color: '#0ff', fontSize: '1.5rem' }} />
        <h3 style={{ margin: 0, color: '#fff' }}>Custom Filters:</h3>
        
        <select 
          style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="">All Domains</option>
          <option value="Mobile">Mobile Development</option>
          <option value="Web">Web Development</option>
          <option value="Database">Databases (DBMS)</option>
          <option value="AI">Artificial Intelligence (AI/LLM)</option>
          <option value="Data Science">Data Science & Analytics</option>
          <option value="DevOps">DevOps & Cloud</option>
        </select>

        <select 
          style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          <option value="Maroc">Morocco</option>
          <option value="France">France</option>
          <option value="Global">Global (World)</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ color: '#0ff', fontSize: '1.2rem' }}>Searching recommendations...</p>
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
          No projects match these criteria (Domain: {domain || "All"}, Country: {country || "All"}).
        </p>
      ) : (
        <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>Select a scenario or custom filters to display recommendations.</p>
      )}

    </div>
  );
}
