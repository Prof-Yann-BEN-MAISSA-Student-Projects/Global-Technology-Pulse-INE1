import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { FiArrowLeft } from 'react-icons/fi';
import '../index.css';
import '../css/RepoDetails.css';

export default function CollectionPage() {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  const [collectionRepos, setCollectionRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCollectionRepos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        
        const response = await fetch(`http://localhost:2500/api/projects/recherche/${encodeURIComponent(collectionName)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories for this collection');
        }
        
        const data = await response.json();
        
        const formattedData = data.map(project => {
          const [authorName, repoName] = project.full_name ? project.full_name.split('/') : ['Unknown', 'Unknown'];
          
          return {
            id: project.full_name || Math.random().toString(),
            author: authorName,
            name: repoName,
            description: project.description || 'No description available',
            language: project.language || 'Unknown',
            stars: project.stargazers_count > 1000 
              ? (project.stargazers_count / 1000).toFixed(1) + 'k' 
              : project.stargazers_count,
            forks: project.forks_count > 1000 
              ? (project.forks_count / 1000).toFixed(1) + 'k' 
              : project.forks_count,
            trend: 'Hot'
          };
        });

        setCollectionRepos(formattedData);
        setPage(1);
      } catch (err) {
        console.error("Error fetching collection repos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchCollectionRepos();
  }, [collectionName]);

  const totalPages = Math.ceil(collectionRepos.length / ITEMS_PER_PAGE) || 1;
  const currentRepos = collectionRepos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="trending-section repo-details-page" style={{ minHeight: '80vh', padding: '6rem 4rem 4rem 4rem' }}>
      <div className="nav-actions" style={{ marginBottom: '2rem' }}>
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
      </div>

      <div className="section-header">
        <h2>{collectionName} Collection</h2>
        <p>Explore the best repositories related to {collectionName}</p>
      </div>

      {isLoading && <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>Loading collection repositories...</p>}
      
      {error && <p style={{ color: 'red', fontSize: '1.1rem', margin: '2rem 0' }}>Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <div className="repo-grid">
            {currentRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} /> 
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={page === 1} 
                onClick={() => { setPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  className={page === p ? 'active' : ''} 
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  {p}
                </button>
              ))}
              
              <button 
                disabled={page === totalPages} 
                onClick={() => { setPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
