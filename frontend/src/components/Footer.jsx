import { FaTwitter, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              <h2>Tech Pulse INPT</h2>
            </Link>
          </div>
          <p>
            Visualizing open-source activity and comparing GitHub repository 
            metrics to help developers make informed decisions.
          </p>
          <div className="social-icons">
            <FaTwitter className="icon" />
            <FaGithub className="icon" />
            <FaLinkedin className="icon" />
            <FaDiscord className="icon" />
          </div>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>
                <Link to="/compare" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Compare Repos
                </Link>
              </li>
              <li>Trending</li>
              <li>API Access</li>
            </ul>
          </div>
          
          <div className="link-column">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Tech Pulse INPT. All rights reserved.</p>
        <div className="legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}