import React from 'react';
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import '../css/RadarSante.css';



function normaliser(valeur, max) {
  if (!valeur || valeur <= 0) return 0;
  return Math.min(100, Math.round((Math.log(valeur + 1) / Math.log(max + 1)) * 100));
}

export default function RadarSanteProjet({ projet }) {
  
  const data = [
    { axis: 'Stars', value: normaliser(projet?.stargazers_count, 300000) },
    { axis: 'Forks', value: normaliser(projet?.forks_count, 80000) },
    { axis: 'Watchers', value: normaliser(projet?.watchers_count, 50000) },
    { axis: 'Issues', value: normaliser(projet?.open_issues_count, 10000) },
    { axis: 'Repo Size', value: normaliser(projet?.size, 4000000) },
  ];

  return (
    <div className="radar-card">
      <h3 className="radar-title">Project Health</h3>
      <div className="radar-glow-wrapper">

        {}
        <svg width="0" height="0">
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            {}
            <PolarGrid stroke="rgba(129, 140, 248, 0.18)" />

            {}
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: 'var(--text-color)', fontSize: 12, fontWeight: 500 }}
            />

            {}
            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />

            {}
            <Radar
              dataKey="value"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.15}
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
              style={{ filter: 'url(#neon-glow)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
