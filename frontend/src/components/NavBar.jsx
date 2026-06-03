import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';
import { FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function NavBar({ isDarkMode, toggleTheme }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const term = searchTerm.trim();
            if (!term) return;

            setLoading(true);
            try {
                // If it contains a slash, assume it's "owner/repo" and go directly
                if (term.includes('/')) {
                    navigate(`/repo/${encodeURIComponent(term)}`);
                    setSearchTerm('');
                } else {
                    // Otherwise search using backend API
                    const apiUrl = import.meta.env.DEV ? 'http://localhost:2500' : '/_/backend';
                    const resp = await axios.get(`${apiUrl}/api/projects/recherche/${encodeURIComponent(term)}`);
                    
                    if (resp.data && resp.data.length > 0) {
                        const firstResult = resp.data[0];
                        navigate(`/repo/${encodeURIComponent(firstResult.full_name)}`);
                        setSearchTerm('');
                    } else {
                        console.log('No repository found for:', term);
                        // Fallback: try to navigate directly with the term if not found
                        navigate(`/repo/${encodeURIComponent(term)}`);
                        setSearchTerm('');
                    }
                }
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <h2>Tech Pulse INPT</h2>
                </Link>
            </div>

            <ul className="nav-links">
                <li>
                    <Link to="/compare" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Compare
                    </Link>
                </li>
                <li>
                    <Link to="/trending" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Trending
                    </Link>
                </li>
                <li>About Us</li>
            </ul>
            <div className="search-container">
                <FiSearch 
                    className={`search-icon ${loading ? 'spinning' : ''}`} 
                    onClick={handleSearch}
                    style={{ cursor: 'pointer' }}
                />
                <input 
                    type="text" 
                    placeholder={loading ? "Searching..." : "Search repositories..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    disabled={loading}
                />
            </div>

            <div className="action-icons">
                <a
                    href="https://github.com/AlaeeddineAmrani/Tech-Pulse-INPT.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                >
                    <FaGithub className="icon" />
                    <span>Our Project</span>
                </a>


                <button className="theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? <FiSun className="icon" /> : <FiMoon className="icon" />}
                </button>

            </div>
        </nav>
    )
}

export default NavBar;