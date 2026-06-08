import React from 'react';
import { RadialBarChart, RadialBar, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import '../css/RadarSante.css';

export default function ChartRadialLabel({ projet }) {
  // Map project data to the radial chart structure using same keys
  const chartData = [
    { browser: 'stars', visitors: projet?.stargazers_count || 0, fill: 'var(--color-chrome)' },
    { browser: 'forks', visitors: projet?.forks_count || 0, fill: 'var(--color-safari)' },
    { browser: 'watchers', visitors: projet?.watchers_count || 0, fill: 'var(--color-firefox)' },
    { browser: 'issues', visitors: projet?.open_issues_count || 0, fill: 'var(--color-edge)' },
    { browser: 'size', visitors: Math.round((projet?.size || 0) / 1024) || 10, fill: 'var(--color-other)' }, // Size in MB
  ];

  return (
    <div className="radar-card flex flex-col" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ textAlign: 'center', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 className="radar-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Repository Radial Analysis</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Key Statistics Overview</p>
      </div>

      <div className="radar-glow-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height={230}>
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
            barSize={15}
          >
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
                      <p style={{ margin: 0, fontWeight: 600, textTransform: 'capitalize' }}>
                        {data.browser === 'size' ? 'Size' : data.browser}:{' '}
                        <span style={{ color: data.fill }}>
                          {data.visitors.toLocaleString()} {data.browser === 'size' ? 'MB' : ''}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <RadialBar dataKey="visitors" background={{ fill: 'rgba(255, 255, 255, 0.03)' }}>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={10}
                style={{ fontWeight: 600, fill: 'var(--text-color)' }}
              />
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        fontSize: '0.85rem',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--text-muted)' }}>
          Showing total metrics value for {projet?.name || 'repository'}
        </div>
      </div>
    </div>
  );
}
