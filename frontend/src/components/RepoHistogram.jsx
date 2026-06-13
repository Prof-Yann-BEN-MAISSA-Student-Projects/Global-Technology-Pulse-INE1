import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../css/RadarSante.css';

export default function RepoHistogram({ projet }) {
  
  const rawData = [
    { name: 'Stars', value: projet?.stargazers_count || 0, color: '#4caefe' },
    { name: 'Forks', value: projet?.forks_count || 0, color: '#3dc3e8' },
    { name: 'Watchers', value: projet?.watchers_count || 0, color: '#2dd9db' },
    { name: 'Issues', value: projet?.open_issues_count || 0, color: '#1feeaf' },
    { name: 'Size (KB)', value: projet?.size || 0, color: '#0ff3a0' }
  ];

  
  const maxVal = Math.max(...rawData.map(d => d.value), 1);
  const getRadius = (val) => {
    if (val <= 0) return 25;
    const ratio = Math.log10(val + 1) / Math.log10(maxVal + 1);
    return 25 + ratio * 65; 
  };

  
  const numSectors = rawData.length;
  const angleSize = 360 / numSectors;

  return (
    <div className="radar-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 className="radar-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' }}>
        Repository Metrics (Variable Pie)
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 1rem 0' }}>
        Proportional Area & Value Comparison
      </p>
      
      <div className="radar-glow-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      color: 'var(--text-color)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>
                        <span style={{ color: payload[0].color }}>●</span> {payload[0].name}:{' '}
                        <strong style={{ color: 'var(--text-color)' }}>{payload[0].value.toLocaleString()}</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {rawData.map((item, index) => {
              const startAngle = 90 - index * angleSize;
              const endAngle = 90 - (index + 1) * angleSize;
              const radius = getRadius(item.value);
              
              
              const sectorData = [{ name: item.name, value: item.value, color: item.color }];

              return (
                <Pie
                  key={item.name}
                  data={sectorData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  startAngle={startAngle}
                  endAngle={endAngle}
                  innerRadius={15}
                  outerRadius={radius}
                  stroke="var(--bg-color)"
                  strokeWidth={2}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                    
                    const RADIAN = Math.PI / 180;
                    const radiusOffset = outerRadius + 15;
                    const x = cx + radiusOffset * Math.cos(-midAngle * RADIAN);
                    const y = cy + radiusOffset * Math.sin(-midAngle * RADIAN);
                    
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="var(--text-muted)"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={10}
                        fontWeight={600}
                      >
                        {name.split(' ')[0]}
                      </text>
                    );
                  }}
                >
                  <Cell fill={item.color} />
                </Pie>
              );
            })}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {rawData.map((item) => (
            <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
