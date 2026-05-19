import { useState } from 'react';
import axios from 'axios';
import { Search, Star, GitFork, Code, ArrowLeftRight } from 'lucide-react';
import '../assets/styles/comparepage.css';

export default function ComparePage() {

    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');
    const [repoLeft, setRepoLeft] = useState(null);
    const [repoRight, setRepoRight] = useState(null);
    const [loading, setLoading] = useState({ left: false, right: false });

    async function chercher(side) {
        const mot = side === 'left' ? searchLeft : searchRight;
        if (!mot.trim()) return;

        setLoading(prev => ({ ...prev, [side]: true }));
        try {

            const apiUrl = import.meta.env.DEV 
                ? 'http://localhost:2500' 
                : '/_/backend';
            const resp = await axios.get(`${apiUrl}/api/projects/recherche/${encodeURIComponent(mot)}`);
            const premier = resp.data[0] || null;
            if (side === 'left') {
                setRepoLeft(premier)
            }
            else setRepoRight(premier);
        } catch (err) {
            console.error('Erreur recherche:', err);
        }
        setLoading(prev => ({ ...prev, [side]: false }));
    }

    // Build comparison rows when both repos are selected
    const metrics = repoLeft && repoRight ? [
        { label: 'Stars', icon: <Star size={18} />, left: repoLeft.stargazers_count, right: repoRight.stargazers_count },
        { label: 'Forks', icon: <GitFork size={18} />, left: repoLeft.forks_count, right: repoRight.forks_count },
        { label: 'Language', icon: <Code size={18} />, left: repoLeft.language || '—', right: repoRight.language || '—', isText: true },
    ] : [];

    function formatNumber(n) {
        if (typeof n !== 'number') return n;
        return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
    }

    return (
        <div className="compare-page">
            <h1 className="compare-title">
                <ArrowLeftRight size={28} />
                Repository Comparison
            </h1>
            <p className="compare-subtitle">Search and compare two repositories side by side</p>

            {/* Two search panels */}
            <div className="compare-panels">

                {/* Left panel */}
                <div className="compare-panel">
                    <div className="compare-search">
                        <Search size={16} />
                        <input
                            placeholder="Search first repo..."
                            value={searchLeft}
                            onChange={e => setSearchLeft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && chercher('left')}
                        />
                    </div>
                    {loading.left && <p className="compare-loading">Searching...</p>}
                    {repoLeft && (
                        <div className="compare-repo-card">
                            <img src={repoLeft.avatar_url} alt="" />
                            <h3>{repoLeft.full_name}</h3>
                            <p>{repoLeft.description}</p>
                        </div>
                    )}
                </div>

                <div className="compare-vs">VS</div>

                {/* Right panel */}
                <div className="compare-panel">
                    <div className="compare-search">
                        <Search size={16} />
                        <input
                            placeholder="Search second repo..."
                            value={searchRight}
                            onChange={e => setSearchRight(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && chercher('right')}
                        />
                    </div>
                    {loading.right && <p className="compare-loading">Searching...</p>}
                    {repoRight && (
                        <div className="compare-repo-card">
                            <img src={repoRight.avatar_url} alt="" />
                            <h3>{repoRight.full_name}</h3>
                            <p>{repoRight.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison table */}
            {metrics.length > 0 && (
                <div className="compare-table">
                    {metrics.map(m => {
                        const leftWins = !m.isText && m.left > m.right;
                        const rightWins = !m.isText && m.right > m.left;
                        return (
                            <div className="compare-row" key={m.label}>
                                <span className={`compare-value ${leftWins ? 'winner' : ''}`}>
                                    {formatNumber(m.left)}
                                </span>
                                <span className="compare-label">
                                    {m.icon} {m.label}
                                </span>
                                <span className={`compare-value ${rightWins ? 'winner' : ''}`}>
                                    {formatNumber(m.right)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
