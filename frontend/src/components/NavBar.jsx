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
                // If it contains a slash, assume it's a specific "owner/repo" and go directly
                if (term.includes('/')) {
                    navigate(`/repo/${encodeURIComponent(term)}`);
                } else {
                    // Navigate to the new search results page
                    navigate(`/search/${encodeURIComponent(term)}`);
                }
                setSearchTerm('');
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