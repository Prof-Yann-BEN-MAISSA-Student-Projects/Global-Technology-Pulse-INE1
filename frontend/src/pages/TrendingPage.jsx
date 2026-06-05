import { useState, useEffect } from 'react';
import RepoCard from '../components/RepoCard';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function TrendingPage() {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:2500/api/projects/trending-paginated?page=${page}&limit=10`);

        if (!response.ok) {
          throw new Error('Failed to fetch trending repositories');
        }

        const data = await response.json();

        const formattedData = data.data.map(project => {
          const [authorName, repoName] = project.full_name ? project.full_name.split('/') : ['Unknown', 'Unknown'];

          return {
            id: project._id,
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
            trend: 'Live'
          };
        });

        setTrendingRepos(formattedData);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching trending paginated:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        // Scroll back to the top of the page when navigating between pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchTrending();
  }, [page]);

  return (
    <div className="trending-section" style={{ minHeight: '80vh', padding: '6rem 4rem 4rem 4rem' }}>
      <div className="nav-actions" style={{ marginBottom: '2rem' }}>
        <button className="btn-retour" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Retourner
        </button>
      </div>
      <div className="section-header">
        <h2>Trending Repositories</h2>
        <p>Explore the most popular open-source projects on GitHub, updated daily</p>
      </div>

      {isLoading && <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>Loading live trending repositories...</p>}

      {error && <p style={{ color: 'red', fontSize: '1.1rem', margin: '2rem 0' }}>Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <div className="repo-grid">
            {trendingRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={page === p ? 'active' : ''}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
