import { FiStar, FiGitBranch } from 'react-icons/fi';


function RepoCard({ repo }) {
  return (
    <div className="repo-card">
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
          <span className={`lang-dot ${repo.language.toLowerCase()}`}></span>
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