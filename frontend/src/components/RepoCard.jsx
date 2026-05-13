import { FiStar, FiGitBranch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function RepoCard({ repo }) {
  const navigate = useNavigate();
  const fullName = `${repo.author}/${repo.name}`;

  const handleClick = () => {
    // Navigation propre avec passage d'état pour un rendu instantané
    navigate(`/repo/${encodeURIComponent(fullName)}`, {
      state: {
        projet: {
          full_name: fullName,
          author: repo.author,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: typeof repo.stars === 'string' && repo.stars.includes('k') 
            ? parseFloat(repo.stars) * 1000 
            : repo.stars,
          forks_count: typeof repo.forks === 'string' && repo.forks.includes('k') 
            ? parseFloat(repo.forks) * 1000 
            : repo.forks,
          history: []
        }
      }
    });
  };

  return (
    <div className="repo-card" onClick={handleClick}>
      <div className="card-header">
        <div className="repo-title">
          <span className="author">{repo.author} / </span>
          <h3>{repo.name}</h3>
        </div>
        <span className="trend-badge">{repo.trend}</span>
      </div>
      
      <p className="repo-description">{repo.description}</p>
      
      <div className="card-footer">
        <div className="repo-lang">
          <span className={`lang-dot ${repo.language ? repo.language.toLowerCase() : 'other'}`}></span>
          {repo.language}
        </div>
        <div className="repo-stats">
          <span><FiStar /> {repo.stars}</span>
          <span><FiGitBranch /> {repo.forks}</span>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;