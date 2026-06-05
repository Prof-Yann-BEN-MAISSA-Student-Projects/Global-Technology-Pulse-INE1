import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../css/RadarSante.css';

export default function RepoHistogram({ projet }) {
  const data = [
    { name: 'Stars', value: projet?.stargazers_count || 0, color: '#eab308' },
    { name: 'Forks', value: projet?.forks_count || 0, color: '#3b82f6' },
    { name: 'Watchers', value: projet?.watchers_count || 0, color: '#10b981' },
    { name: 'Issues', value: projet?.open_issues_count || 0, color: '#ef4444' }
  ];

  return (
    <div className="radar-card">
      <h3 className="radar-title">Repository Metrics</h3>
      <div className="radar-glow-wrapper" style={{ padding: '20px' }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="var(--text-color)" tick={{ fill: 'var(--text-muted)' }} />
            <YAxis stroke="var(--text-color)" tick={{ fill: 'var(--text-muted)' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
              itemStyle={{ color: 'var(--text-color)', fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
