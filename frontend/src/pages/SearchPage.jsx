import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RepoCard from '../components/RepoCard';
import { FiArrowLeft } from 'react-icons/fi';
import '../index.css';
import '../css/RepoDetails.css';

export default function SearchPage() {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Search API with the search term
        const response = await fetch(`http://localhost:2500/api/projects/recherche/${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
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
            trend: 'Match'
          };
        });

        setSearchResults(formattedData);
        setPage(1);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE) || 1;
  const currentResults = searchResults.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="trending-section repo-details-page" style={{ minHeight: '80vh', padding: '6rem 4rem 4rem 4rem' }}>
      <div className="nav-actions" style={{ marginBottom: '2rem' }}>
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
      </div>

      <div className="section-header">
        <h2>Search Results</h2>
        <p>Showing repositories matching "{searchTerm}"</p>
      </div>

      {isLoading && <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>Searching repositories...</p>}
      
      {error && <p style={{ color: 'red', fontSize: '1.1rem', margin: '2rem 0' }}>Error: {error}</p>}

      {!isLoading && !error && searchResults.length === 0 && (
        <p style={{ fontSize: '1.1rem', margin: '2rem 0', color: 'var(--text-muted)' }}>No repositories found for "{searchTerm}".</p>
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <>
          <div className="repo-grid">
            {currentResults.map((repo) => (
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
