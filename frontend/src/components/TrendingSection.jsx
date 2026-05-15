import { useState, useEffect } from 'react';
import RepoCard from './RepoCard';

export default function TrendingSection() {
  
  const [trendingRepos, setTrendingRepos] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [error, setError] = useState(null);

  
  useEffect(() => {
    
    const fetchProjects = async () => {
      try {
        
        const response = await fetch('http://localhost:2500/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        
        const data = await response.json();
        
        
        const top5Projects = data
          .sort((a, b) => {
            const scoreA = (a.stargazers_count || 0) + (a.forks_count || 0);
            const scoreB = (b.stargazers_count || 0) + (b.forks_count || 0);
            return scoreB - scoreA; 
          })
          .slice(0, 5); 
        
        
        const formattedData = top5Projects.map(project => {
          
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
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
      } finally {
        
        setIsLoading(false);
      }
    };

    
    fetchProjects();
  }, []); 

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>Trending Repositories</h2>
        <p>Discover the most popular open-source projects gaining momentum right now</p>
      </div>

      {}
      {isLoading && <p>Loading live repositories...</p>}
      
      {}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="repo-grid">
        {}
        {!isLoading && !error && trendingRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} /> 
        ))}
      </div>
    </section>
  );
}