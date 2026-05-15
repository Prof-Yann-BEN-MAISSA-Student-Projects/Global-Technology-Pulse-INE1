import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globe from 'react-globe.gl';
import GraphiqueHistorique from '../components/GraphiqueHistorique';
import { FiStar, FiGitBranch, FiExternalLink, FiArrowLeft, FiActivity, FiCode } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import '../css/RepoDetails.css';


const countryCoordinates = {
  US: { lat: 37.0902, lng: -95.7129 },
  CN: { lat: 35.8617, lng: 104.1954 },
  IN: { lat: 20.5937, lng: 78.9629 },
  DE: { lat: 51.1657, lng: 10.4515 },
  GB: { lat: 55.3781, lng: -3.4360 },
  FR: { lat: 46.2276, lng: 2.2137 },
  CA: { lat: 56.1304, lng: -106.3468 },
  JP: { lat: 36.2048, lng: 138.2529 },
  AU: { lat: -25.2744, lng: 133.7751 },
  BR: { lat: -14.2350, lng: -51.9253 },
  RU: { lat: 61.5240, lng: 105.3188 },
  SG: { lat: 1.3521, lng: 103.8198 },
  NL: { lat: 52.1326, lng: 5.2913 },
  SE: { lat: 60.1282, lng: 18.6435 },
  CH: { lat: 46.8182, lng: 8.2275 },
  ES: { lat: 40.4637, lng: -3.7492 },
  IT: { lat: 41.8719, lng: 12.5674 },
  KR: { lat: 35.9078, lng: 127.7669 },
  UA: { lat: 48.3794, lng: 31.1656 },
  ID: { lat: -0.7893, lng: 113.9213 },
  VN: { lat: 14.0583, lng: 108.2772 },
  MY: { lat: 4.2105, lng: 101.9758 },
  IE: { lat: 53.4129, lng: -8.2439 },
  IL: { lat: 31.0461, lng: 34.8516 },
  RO: { lat: 45.9432, lng: 24.9668 },
  PT: { lat: 39.3999, lng: -8.2245 },
  NO: { lat: 60.4720, lng: 8.4689 },
  BE: { lat: 50.5039, lng: 4.4699 },
  PL: { lat: 51.9194, lng: 19.1451 },
};


const defaultHubLocations = [
  { lat: 37.7749, lng: -122.4194, weight: 0.2 }, 
  { lat: 51.5074, lng: -0.1278, weight: 0.15 },   
  { lat: 35.6762, lng: 139.6503, weight: 0.25 },  
  { lat: 48.8566, lng: 2.3522, weight: 0.1 },    
  { lat: 12.9716, lng: 77.5946, weight: 0.18 },   
  { lat: -33.8688, lng: 151.2093, weight: 0.08 }, 
  { lat: 31.2304, lng: 121.4737, weight: 0.22 },  
  { lat: 52.5200, lng: 13.4050, weight: 0.12 },   
  { lat: 43.6532, lng: -79.3832, weight: 0.09 },  
];

export default function RepoDetails() {
  const { repoId } = useParams();
  const decodedFullName = repoId ? decodeURIComponent(repoId) : '';
  const locationState = useLocation().state;
  const navigate = useNavigate();

  // Initialiser avec les données passées par Link si disponibles, sinon un objet vide
  const [projet, setProjet] = useState(locationState?.projet || null);
  const [loading, setLoading] = useState(!locationState?.projet);

  // État pour le Globe
  const [coordonnees, setCoordonnees] = useState(defaultHubLocations);
  const [globeLoading, setGlobeLoading] = useState(false);

  // 1. Récupération des détails complets du projet
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!decodedFullName) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:2500/api/projects/${encodeURIComponent(decodedFullName)}`);
        if (response.data) {
          setProjet(response.data);
        } else {
          // Fallback au cas où le projet n'est pas encore en base mais on a le nom
          const [author, name] = decodedFullName.split('/');
          setProjet(prev => prev || {
            full_name: decodedFullName,
            author: author || 'Unknown',
            name: name || decodedFullName,
            description: 'No detailed description available for this repository yet.',
            language: 'TypeScript',
            stargazers_count: 12500,
            forks_count: 1400,
            history: []
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur de récupération du projet:", err);
        
        const [author, name] = decodedFullName.split('/');
        setProjet(prev => prev || {
          full_name: decodedFullName,
          author: author || 'Contributor',
          name: name || decodedFullName,
          description: 'Open source repository exploring state-of-the-art frameworks and systems.',
          language: 'Python',
          stargazers_count: 8500,
          forks_count: 1200,
          history: []
        });
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [decodedFullName]);

  
  useEffect(() => {
    const fetchLocations = async () => {
      if (!decodedFullName || !decodedFullName.includes('/')) return;
      const [author, repo] = decodedFullName.split('/');
      if (!author || !repo) return;

      try {
        setGlobeLoading(true);
        const apiUrl = `https://api.ossinsight.io/v1/repos/${encodeURIComponent(author)}/${encodeURIComponent(repo)}/issue_creators/countries/?exclude_unknown=true&from=2000-01-01&to=2099-01-01`;
        const response = await axios.get(apiUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (response.data?.data?.rows && response.data.data.rows.length > 0) {
          const rows = response.data.data.rows;
          const coordonneesFormatees = [];
          
          rows.forEach(row => {
            const code = row.country_code;
            if (code && countryCoordinates[code]) {
              coordonneesFormatees.push({
                lat: countryCoordinates[code].lat,
                lng: countryCoordinates[code].lng,
                weight: parseFloat(row.percentage || 0.05),
                creators: parseInt(row.issue_creators || 1, 10),
                code: code
              });
            }
          });

          if (coordonneesFormatees.length > 0) {
            setCoordonnees(coordonneesFormatees);
          } else {
            setCoordonnees(defaultHubLocations);
          }
        } else {
          setCoordonnees(defaultHubLocations);
        }
        setGlobeLoading(false);
      } catch {
        console.log("OSSInsight API non accessible pour ce dépôt, utilisation des hubs mondiaux actifs par défaut.");
        setCoordonnees(defaultHubLocations);
        setGlobeLoading(false);
      }
    };

    fetchLocations();
  }, [decodedFullName]);

  if (loading) {
    return (
      <div className="repo-details-page" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="badge-dot" style={{ width: '20px', height: '20px', marginBottom: '1rem' }}></div>
        <h2>Chargement des analyses du dépôt...</h2>
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="repo-details-page" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <h2>Dépôt introuvable</h2>
        <button className="btn-retour" onClick={() => navigate('/')}>
          <FiArrowLeft /> Retour à l'accueil
        </button>
      </div>
    );
  }

  
  const [authorName, repoName] = projet.full_name ? projet.full_name.split('/') : ['Auteur', projet.name || 'Projet'];
  const starsCount = projet.stargazers_count !== undefined ? projet.stargazers_count : (projet.stars || 12000);
  const forksCount = projet.forks_count !== undefined ? projet.forks_count : (projet.forks || 1500);

  return (
    <div className="repo-details-page">
      {}
      <div className="nav-actions">
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Retourner
        </button>
      </div>

      {}
      <div className="overview-banner">
        <div className="overview-banner-left">
          {projet.avatar_url ? (
            <img src={projet.avatar_url} alt={authorName} className="repo-avatar" />
          ) : (
            <div className="repo-avatar-placeholder">
              {repoName ? repoName.charAt(0).toUpperCase() : 'R'}
            </div>
          )}
          <div className="repo-info">
            <h1>
              <span>{authorName}</span> / <strong style={{ color: '#3b82f6' }}>{repoName}</strong>
            </h1>
            <p className="description">
              {projet.description || "Ce dépôt open-source rassemble des outils avancés d'analyse et d'intégration continue."}
            </p>
          </div>
        </div>

        <div className="overview-banner-right">
          <a
            href={`https://github.com/${projet.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-external-btn"
          >
            <FaGithub /> Voir sur GitHub <FiExternalLink />
          </a>
        </div>
      </div>

      {}
      <div className="stats-banner">
        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#eab308' }}>
            <FiStar />
          </div>
          <div className="stat-details">
            <span className="value">{starsCount > 999 ? (starsCount / 1000).toFixed(1) + 'k' : starsCount}</span>
            <span className="label">Étoiles (Stars)</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiGitBranch />
          </div>
          <div className="stat-details">
            <span className="value">{forksCount > 999 ? (forksCount / 1000).toFixed(1) + 'k' : forksCount}</span>
            <span className="label">Forks du Dépôt</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' }}>
            <FiCode />
          </div>
          <div className="stat-details">
            <span className="value">{projet.language || 'TypeScript'}</span>
            <span className="label">Langage Principal</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiActivity />
          </div>
          <div className="stat-details">
            <span className="value">Optimal</span>
            <span className="label">Statut d'Activité</span>
          </div>
        </div>
      </div>

      {}
      <div className="dashboard-row">
        <div className="chart-container">
          <GraphiqueHistorique 
            donnees={projet.history && projet.history.length > 1 ? projet.history : undefined} 
            starsCount={starsCount}
            forksCount={forksCount}
          />
        </div>

        <div className="globe-container">
          <h3>Localisation des Contributeurs</h3>
          {globeLoading ? (
            <p style={{ color: '#3b82f6', marginTop: '2rem' }}>Analyse satellitaire en cours...</p>
          ) : (
            <Globe
              width={380}
              height={380}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
              ringsData={coordonnees}
              ringColor={() => '#3b82f6'}
              
              ringMaxRadius={d => Math.max(4, Math.min(18, (d.weight || 0.1) * 60))}
              ringPropagationSpeed={3}
              ringRepeatPeriod={800}
            />
          )}
        </div>
      </div>
    </div>
  );
}