import { useState, useEffect } from 'react';
import RepoCard from './RepoCard';

export default function TrendingSection() {
  // 1. Create state to hold our repositories (starts as an empty array)
  const [trendingRepos, setTrendingRepos] = useState([]);
  
  // 2. Create state to track if we are currently loading data
  const [isLoading, setIsLoading] = useState(true);
  
  // 3. Create state for handling any errors
  const [error, setError] = useState(null);

  // useEffect runs automatically when the component first appears on the screen
  useEffect(() => {
    // We define an async function to fetch our data
    const fetchProjects = async () => {
      try {
        // Fetch from your backend URL for trending projects
        const response = await fetch('http://localhost:2500/api/projects/trending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        // Convert the response to JSON format
        const data = await response.json();
        
        // Slice the first 6 repositories
        const top6Projects = data.slice(0, 6);
        
        // Format the projects to match our RepoCard perfectly
        const formattedData = top6Projects.map(project => {
          // 'full_name' looks like "author/repoName", so we split it by '/'
          const [authorName, repoName] = project.full_name ? project.full_name.split('/') : ['Unknown', 'Unknown'];
          
          return {
            id: project._id,
            author: authorName,
            name: repoName,
            description: project.description || 'No description available',
            language: project.language || 'Unknown',
            // Format numbers to look nice (e.g. 1500 -> 1.5k)
            stars: project.stargazers_count > 1000 
              ? (project.stargazers_count / 1000).toFixed(1) + 'k' 
              : project.stargazers_count,
            forks: project.forks_count > 1000 
              ? (project.forks_count / 1000).toFixed(1) + 'k' 
              : project.forks_count,
            trend: 'Live'
          };
        });

        // Update our state with the formatted data
        setTrendingRepos(formattedData);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
      } finally {
        // Whether it succeeded or failed, we are done loading
        setIsLoading(false);
      }
    };

    // Call the function we just defined
    fetchProjects();
  }, []); // The empty array [] means this effect runs exactly ONE time when the component loads

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>Trending Repositories</h2>
        <p>Discover the most popular open-source projects gaining momentum right now</p>
      </div>

      {/* Show a loading message while waiting for backend */}
      {isLoading && <p>Loading live repositories...</p>}
      
      {/* Show an error message if something went wrong */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="repo-grid">
        {/* Render our fetched repositories */}
        {!isLoading && !error && trendingRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} /> 
        ))}
      </div>
    </section>
  );
}