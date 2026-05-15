import '../css/HeroSection.css';

const stats = [
  { value: '50K+', label: 'Repositories Tracked' },
  { value: '2.4M', label: 'Commits Analyzed' },
  { value: '180+', label: 'Countries' },
];

export default function HeroSection() {
  return (
    <section className="hero">

      {}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {}
      <div className="hero-badge-wrapper">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Live GitHub Analytics Platform
        </div>
      </div>

      {}
      <div className="hero-left">

        {}
        <h1 className="hero-title">
          <span className="purple-text">Visualize</span><br />
          <span className="gradient-text">Open Source</span><br />
          <span className="purple-text">Activity</span>
        </h1>

        {}
        <p className="hero-subtitle">
          Track, analyze, and compare GitHub repositories with real-time
          metrics, contributor insights, and trend detection — all in one place.
        </p>

        {}
        <div className="hero-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="hero-right">
        <div className="hero-graph-container">
          <svg
            viewBox="0 0 900 320"
            className="pulse-graph"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4facfe"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4facfe" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#4facfe" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="fillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {}
            {[80, 140, 200, 260].map(y => (
              <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#ffffff08" strokeWidth="1"/>
            ))}

            {}
            <path
              className="graph-fill"
              fill="url(#fillGrad2)"
              d="M 0,320 L 0,200 Q 100,220 200,170 T 400,200 T 600,140 T 750,160 T 900,110 L 900,320 Z"
            />
            <path
              className="animated-line animated-line-2"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              filter="url(#glow)"
              d="M 0,200 Q 100,220 200,170 T 400,200 T 600,140 T 750,160 T 900,110"
            />

            {}
            <path
              className="graph-fill"
              fill="url(#fillGrad)"
              d="M 0,320 L 0,230 Q 100,190 200,240 T 400,200 T 600,130 T 750,80 T 900,120 L 900,320 Z"
            />
            <path
              className="animated-line"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              filter="url(#glow)"
              d="M 0,230 Q 100,190 200,240 T 400,200 T 600,130 T 750,80 T 900,120"
            />

            {}
            <circle className="data-point" cx="750" cy="80" r="6" fill="#4facfe" filter="url(#glow)"/>
          </svg>
        </div>
      </div>

    </section>
  );
}