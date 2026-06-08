import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../css/GraphiqueHistorique.css';

export default function GraphiqueHistorique({ donnees, starsCount, forksCount, nomProjet }) {
  const [ossData, setOssData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch OSSInsight historical data (Issue & PR creators)
  useEffect(() => {
    if (!nomProjet || !nomProjet.includes('/')) return;
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const [author, repo] = nomProjet.split('/');
        
        const [issuesRes, prsRes] = await Promise.all([
          axios.get(`https://api.ossinsight.io/v1/repos/${encodeURIComponent(author)}/${encodeURIComponent(repo)}/issue_creators/history/`),
          axios.get(`https://api.ossinsight.io/v1/repos/${encodeURIComponent(author)}/${encodeURIComponent(repo)}/pull_request_creators/history/`)
        ]);
        
        const issuesData = issuesRes?.data?.data?.rows || [];
        const prsData = prsRes?.data?.data?.rows || [];
        
        const merged = {};
        issuesData.forEach(d => {
          if (!merged[d.date]) merged[d.date] = { date: d.date, val1: 0, val2: 0 };
          merged[d.date].val1 += parseInt(d.issue_creators || 0, 10);
        });
        prsData.forEach(d => {
          if (!merged[d.date]) merged[d.date] = { date: d.date, val1: 0, val2: 0 };
          merged[d.date].val2 += parseInt(d.pull_request_creators || 0, 10);
        });
        
        const finalData = Object.values(merged).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (isMounted && finalData.length >= 2) {
          setOssData(finalData);
        }
      } catch (err) {
        console.log("OSSInsight History non accessible pour ce dépôt.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHistory();
    
    return () => { isMounted = false; };
  }, [nomProjet]);

  // Priority to OSSInsight data, fallback to database history data
  let dataToRender = [];
  let hasOss = false;

  if (ossData && ossData.length >= 2) {
    dataToRender = ossData.map(d => ({
      date: d.date,
      val1: d.val1, // Issues
      val2: d.val2  // PRs
    }));
    hasOss = true;
  } else if (donnees && donnees.length >= 2) {
    dataToRender = [...donnees].map(d => ({
      date: d.date ? new Date(d.date).toISOString().split('T')[0] : '',
      val1: d.stars || d.etoiles || 0, // Stars
      val2: d.forks || 0               // Forks
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Calculate dynamic date range text for the footer
  let dateRangeText = "Période inconnue";
  if (dataToRender.length >= 2) {
    try {
      const firstDate = new Date(dataToRender[0].date);
      const lastDate = new Date(dataToRender[dataToRender.length - 1].date);
      const options = { month: 'long', year: 'numeric' };
      dateRangeText = `${firstDate.toLocaleDateString('fr-FR', options)} - ${lastDate.toLocaleDateString('fr-FR', options)}`;
    } catch (e) {
      console.error("Error formatting date range", e);
    }
  }

  if (loading) {
    return (
      <div className="graph-hist" style={{ height: '390px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Chargement de l'historique depuis OSSInsight...</p>
      </div>
    );
  }

  if (dataToRender.length < 2) {
    return (
      <div className="graph-hist" style={{ height: '390px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Données historiques insuffisantes pour tracer une évolution</p>
      </div>
    );
  }

  return (
    <div className="graph-hist flex flex-col" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ width: '100%', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>
        <h3 className="graph-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
          {hasOss ? (
            <>Évolution Historique : Créateurs Issues vs Créateurs PRs</>
          ) : (
            <>Évolution Historique : Étoiles vs Forks</>
          )}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
          {hasOss 
            ? "Comparaison mensuelle du nombre de contributeurs d'issues et de pull requests"
            : "Progression cumulée du nombre d'étoiles et de forks du dépôt"
          }
        </p>
      </div>

      {/* Area Chart Container */}
      <div style={{ width: '100%', height: 260, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataToRender}
            margin={{
              left: 5,
              right: 5,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--border-color)" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              tickFormatter={(value) => {
                if (!value) return '';
                try {
                  const d = new Date(value);
                  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                } catch {
                  return value;
                }
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              tickFormatter={(val) => {
                if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
                return val;
              }}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
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
                      <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                        {new Date(payload[0].payload.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </p>
                      {payload.map((item, idx) => (
                        <p key={idx} style={{ margin: 0, padding: '2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                          <span style={{ color: 'var(--text-muted)' }}>{item.name}:</span>
                          <strong style={{ color: 'var(--text-color)' }}>{item.value.toLocaleString()}</strong>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              name={hasOss ? "Créateurs PRs" : "Forks"}
              dataKey="val2"
              type="natural"
              fill="var(--chart-2)"
              fillOpacity={0.25}
              stroke="var(--chart-2)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              name={hasOss ? "Créateurs Issues" : "Étoiles"}
              dataKey="val1"
              type="natural"
              fill="var(--chart-1)"
              fillOpacity={0.25}
              stroke="var(--chart-1)"
              strokeWidth={2}
              stackId="a"
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  {payload.map((entry, index) => (
                    <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color, display: 'inline-block' }}></span>
                      {entry.value}
                    </span>
                  ))}
                </div>
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.85rem'
      }}>
        <div style={{ color: 'var(--text-muted)' }}>
          {dateRangeText}
        </div>
      </div>
    </div>
  );
}
