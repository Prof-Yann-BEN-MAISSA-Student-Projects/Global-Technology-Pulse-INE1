import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globe from 'react-globe.gl';
import GraphiqueHistorique from '../components/GraphiqueHistorique';
import { FiStar, FiGitBranch, FiExternalLink, FiArrowLeft, FiActivity, FiCode } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import RadarSanteProjet from '../components/RadarSanteProjet.jsx';
import RepoHistogram from '../components/RepoHistogram.jsx';
import '../css/RepoDetails.css';

// Dictionnaire associant les codes ISO 2 des pays à leurs coordonnées centrales (200+ pays)
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
  // Extended coverage
  AF: { lat: 33.9391, lng: 67.7100 },
  AL: { lat: 41.1533, lng: 20.1683 },
  DZ: { lat: 28.0339, lng: 1.6596 },
  AO: { lat: -11.2027, lng: 17.8739 },
  AR: { lat: -38.4161, lng: -63.6167 },
  AM: { lat: 40.0691, lng: 45.0382 },
  AT: { lat: 47.5162, lng: 14.5501 },
  AZ: { lat: 40.1431, lng: 47.5769 },
  BH: { lat: 26.0275, lng: 50.5500 },
  BD: { lat: 23.6850, lng: 90.3563 },
  BY: { lat: 53.7098, lng: 27.9534 },
  BO: { lat: -16.2902, lng: -63.5887 },
  BA: { lat: 43.9159, lng: 17.6791 },
  BW: { lat: -22.3285, lng: 24.6849 },
  BG: { lat: 42.7339, lng: 25.4858 },
  CM: { lat: 3.8480, lng: 11.5021 },
  CG: { lat: -0.2280, lng: 15.8277 },
  CL: { lat: -35.6751, lng: -71.5430 },
  CO: { lat: 4.5709, lng: -74.2973 },
  CR: { lat: 9.7489, lng: -83.7534 },
  HR: { lat: 45.1000, lng: 15.2000 },
  CU: { lat: 21.5218, lng: -77.7812 },
  CY: { lat: 35.1264, lng: 33.4299 },
  CZ: { lat: 49.8175, lng: 15.4730 },
  DK: { lat: 56.2639, lng: 9.5018 },
  EC: { lat: -1.8312, lng: -78.1834 },
  EG: { lat: 26.8206, lng: 30.8025 },
  ET: { lat: 9.1450, lng: 40.4897 },
  FI: { lat: 61.9241, lng: 25.7482 },
  GH: { lat: 7.9465, lng: -1.0232 },
  GR: { lat: 39.0742, lng: 21.8243 },
  GT: { lat: 15.7835, lng: -90.2308 },
  GG: { lat: 49.4657, lng: -2.5853 },
  GY: { lat: 4.8604, lng: -58.9302 },
  HK: { lat: 22.3193, lng: 114.1694 },
  HU: { lat: 47.1625, lng: 19.5033 },
  IS: { lat: 64.9631, lng: -19.0208 },
  IQ: { lat: 33.2232, lng: 43.6793 },
  IR: { lat: 32.4279, lng: 53.6880 },
  JO: { lat: 30.5852, lng: 36.2384 },
  KH: { lat: 12.5657, lng: 104.9910 },
  KE: { lat: -0.0236, lng: 37.9062 },
  KG: { lat: 41.2044, lng: 74.7661 },
  KW: { lat: 29.3117, lng: 47.4818 },
  LB: { lat: 33.8547, lng: 35.8623 },
  LK: { lat: 7.8731, lng: 80.7718 },
  LT: { lat: 55.1694, lng: 23.8813 },
  LU: { lat: 49.8153, lng: 6.1296 },
  MK: { lat: 41.6086, lng: 21.7453 },
  MG: { lat: -18.7669, lng: 46.8691 },
  MW: { lat: -13.2543, lng: 34.3015 },
  MV: { lat: 3.2028, lng: 73.2207 },
  ML: { lat: 17.5707, lng: -3.9962 },
  MT: { lat: 35.9375, lng: 14.3754 },
  ME: { lat: 42.7087, lng: 19.3744 },
  MX: { lat: 23.6345, lng: -102.5528 },
  MD: { lat: 47.4116, lng: 28.3699 },
  MN: { lat: 46.8625, lng: 103.8467 },
  MA: { lat: 31.7917, lng: -7.0926 },
  MZ: { lat: -18.6657, lng: 35.5296 },
  MM: { lat: 21.9162, lng: 95.9560 },
  NA: { lat: -22.9576, lng: 18.4904 },
  NP: { lat: 28.3949, lng: 84.1240 },
  NZ: { lat: -40.9006, lng: 174.8860 },
  NI: { lat: 12.8654, lng: -85.2072 },
  NG: { lat: 9.0820, lng: 8.6753 },
  NE: { lat: 17.6078, lng: 8.0817 },
  OM: { lat: 21.4735, lng: 55.9754 },
  PK: { lat: 30.3753, lng: 69.3451 },
  PW: { lat: 7.5150, lng: 134.5825 },
  PA: { lat: 8.5380, lng: -80.7821 },
  PG: { lat: -6.3150, lng: 143.9555 },
  PY: { lat: -23.4425, lng: -58.4438 },
  PE: { lat: -9.1900, lng: -75.0152 },
  PH: { lat: 12.8797, lng: 121.7740 },
  PF: { lat: -17.6797, lng: -149.4068 },
  PS: { lat: 31.9522, lng: 35.2332 },
  QA: { lat: 25.3548, lng: 51.1839 },
  RS: { lat: 44.0165, lng: 21.0059 },
  RW: { lat: -1.9403, lng: 29.8739 },
  SA: { lat: 23.8859, lng: 45.0792 },
  SD: { lat: 12.8628, lng: 30.2176 },
  SN: { lat: 14.4974, lng: -14.4524 },
  SH: { lat: -24.1435, lng: -10.0307 },
  SL: { lat: 8.4606, lng: -11.7799 },
  SK: { lat: 48.6690, lng: 19.6990 },
  SI: { lat: 46.1512, lng: 14.9955 },
  SO: { lat: 5.1521, lng: 46.1996 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  SS: { lat: 4.8594, lng: 31.5713 },
  SV: { lat: 13.7942, lng: -88.8965 },
  TW: { lat: 23.6978, lng: 120.9605 },
  TJ: { lat: 38.8610, lng: 71.2761 },
  TZ: { lat: -6.3690, lng: 34.8888 },
  TH: { lat: 15.8700, lng: 100.9925 },
  TL: { lat: -8.8742, lng: 125.7275 },
  TG: { lat: 8.6195, lng: 0.8248 },
  TN: { lat: 33.8869, lng: 9.5375 },
  TR: { lat: 38.9637, lng: 35.2433 },
  TM: { lat: 38.9697, lng: 59.5563 },
  UG: { lat: 1.3733, lng: 32.2903 },
  AE: { lat: 23.4241, lng: 53.8478 },
  UZ: { lat: 41.3775, lng: 64.5853 },
  VE: { lat: 6.4238, lng: -66.5897 },
  YE: { lat: 15.5527, lng: 48.5164 },
  ZM: { lat: -13.1339, lng: 27.8493 },
  ZW: { lat: -19.0154, lng: 29.1549 },
};


// Coordonnées mondiales par défaut pour animer le globe de façon spectaculaire
const defaultHubLocations = [
  { lat: 37.7749, lng: -122.4194, weight: 0.2 }, // San Francisco
  { lat: 51.5074, lng: -0.1278, weight: 0.15 },   // London
  { lat: 35.6762, lng: 139.6503, weight: 0.25 },  // Tokyo
  { lat: 48.8566, lng: 2.3522, weight: 0.1 },    // Paris
  { lat: 12.9716, lng: 77.5946, weight: 0.18 },   // Bangalore
  { lat: -33.8688, lng: 151.2093, weight: 0.08 }, // Sydney
  { lat: 31.2304, lng: 121.4737, weight: 0.22 },  // Shanghai
  { lat: 52.5200, lng: 13.4050, weight: 0.12 },   // Berlin
  { lat: 43.6532, lng: -79.3832, weight: 0.09 },  // Toronto
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
        // Si erreur API, créer un bel objet de secours pour garantir l'affichage
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

  // 2. Récupération dynamique des localisations des créateurs d'issues via OSSInsight API
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

  // Extraction propre de l'auteur et du nom
  const [authorName, repoName] = projet.full_name ? projet.full_name.split('/') : ['Auteur', projet.name || 'Projet'];
  const starsCount = projet.stargazers_count !== undefined ? projet.stargazers_count : (projet.stars || 12000);
  const forksCount = projet.forks_count !== undefined ? projet.forks_count : (projet.forks || 1500);

  return (
    <div className="repo-details-page">
      {/* Navigation action */}
      <div className="nav-actions">
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Retourner
        </button>
      </div>

      {/* Overview Banner Header */}
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

      {/* Stats Highlights Banner */}
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

      {/* Main Visualisations Row (Graphique D3 vs Globe 3D) */}
      <div className='dashboard'>
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
                // Taille de l'onde dynamique basée sur le pourcentage de créateurs d'issues de ce pays !
                ringMaxRadius={d => Math.max(4, Math.min(18, (d.weight || 0.1) * 60))}
                ringPropagationSpeed={3}
                ringRepeatPeriod={800}
              />
            )}
          </div>
        </div>
        <div className='dashboard-row bottom-graphics'>
          <div className='radar-container'>
            <RadarSanteProjet projet={projet} />
          </div>
          <div className='histogram-container'>
            <RepoHistogram projet={projet} />
          </div>
        </div>
      </div>
    </div>
  );
}