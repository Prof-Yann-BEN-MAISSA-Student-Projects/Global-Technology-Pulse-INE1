import { FaGithub } from 'react-icons/fa';
import { FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function NavBar({ isDarkMode, toggleTheme }) {
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
                <li>Trending</li>
                <li>About Us</li>
            </ul>
            <div className="search-container">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search repositories..." />
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