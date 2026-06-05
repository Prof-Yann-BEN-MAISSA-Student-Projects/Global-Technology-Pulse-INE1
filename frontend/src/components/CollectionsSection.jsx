import { FiCpu, FiCode, FiDatabase, FiCloud, FiSmartphone, FiShield, FiStar, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const collections = [
  {
    name: 'AI & Machine Learning',
    icon: <FiCpu />,
    theme: 'theme-purple',
    count: 1234,
    growth: '+24%',
    description: 'Neural networks, deep learning, and intelligent systems',
  },
  {
    name: 'Frontend Frameworks',
    icon: <FiCode />,
    theme: 'theme-blue',
    count: 892,
    growth: '+18%',
    description: 'Modern UI libraries and component frameworks',
  },
  {
    name: 'Backend & APIs',
    icon: <FiDatabase />,
    theme: 'theme-green',
    count: 756,
    growth: '+15%',
    description: 'Server frameworks, databases, and API tools',
  },
  {
    name: 'Cloud & DevOps',
    icon: <FiCloud />,
    theme: 'theme-orange',
    count: 634,
    growth: '+21%',
    description: 'Infrastructure, deployment, and automation',
  },
  {
    name: 'Mobile Development',
    icon: <FiSmartphone />,
    theme: 'theme-indigo',
    count: 521,
    growth: '+12%',
    description: 'Cross-platform and native mobile solutions',
  },
  {
    name: 'Security & Privacy',
    icon: <FiShield />,
    theme: 'theme-red',
    count: 443,
    growth: '+28%',
    description: 'Encryption, authentication, and secure coding',
  }
];

export default function CollectionsSection() {
  const navigate = useNavigate();

  return (
    <section className="collections-section">
      
      {/* Animated Header */}
      <div className="section-header fade-in-up">
        <div className="badge">
          <FiStar className="icon-yellow" />
          <span>Curated Collections</span>
        </div>
        <h2>Hot Collections</h2>
        <p>Explore trending tech stacks and discover cutting-edge repositories</p>
      </div>

      {/* The Grid with Staggered Animations */}
      <div className="collections-grid">
        {collections.map((collection, index) => (
          <div 
            key={collection.name} 
            className="modern-card group"
            onClick={() => navigate(`/collection/${encodeURIComponent(collection.name)}`)}
            style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }} 
          >
            {/* The colored background glow that appears on hover */}
            <div className={`card-glow ${collection.theme}`}></div>
            
            <div className="card-content">
              {/* Icon Box */}
              <div className={`modern-icon-box ${collection.theme}`}>
                {collection.icon}
              </div>

              {/* Text Content */}
              <div className="card-text">
                <h3>{collection.name}</h3>
                <p className="description">{collection.description}</p>
                
                <div className="card-stats">
                  <span className="count">{collection.count}</span>
                  <div className="growth">
                    <FiTrendingUp />
                    <span>{collection.growth}</span>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="card-action">
                <span>Explore collection</span>
                <FiArrowRight className="arrow" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}