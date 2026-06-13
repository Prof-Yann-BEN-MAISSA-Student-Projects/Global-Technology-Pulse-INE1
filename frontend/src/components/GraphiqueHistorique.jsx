import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import '../css/GraphiqueHistorique.css';

export default function GraphiqueHistorique({ donnees, starsCount, forksCount, nomProjet, prediction }) {
  const [ossData, setOssData] = useState(null);
  const [loading, setLoading] = useState(false);

  
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

  
  let dataToRender = [];
  let hasOss = false;

  if (ossData && ossData.length >= 2) {
    dataToRender = ossData.map(d => ({
      date: d.date,
      val1: d.val1, 
      val2: d.val2, 
      predictedStars: null
    }));
    hasOss = true;
  } else if (donnees && donnees.length >= 2) {
    dataToRender = [...donnees].map(d => ({
      date: d.date ? new Date(d.date).toISOString().split('T')[0] : '',
      val1: d.stars || d.etoiles || 0, 
      val2: d.forks || 0,              
      predictedStars: null
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  
  if (prediction && prediction.predictedStars30d && dataToRender.length >= 2) {
    const latestPoint = dataToRender[dataToRender.length - 1];
    
    latestPoint.predictedStars = latestPoint.val1;

    try {
      const lastDate = new Date(latestPoint.date);
      const predDate = new Date(lastDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const predDateStr = predDate.toISOString().split('T')[0];

      dataToRender.push({
        date: predDateStr,
        val1: null,
        val2: null,
        predictedStars: prediction.predictedStars30d
      });
    } catch (e) {
      console.error("Error setting predicted date:", e);
    }
  }

  
  let dateRangeText = "Unknown period";
  if (dataToRender.length >= 2) {
    try {
      
      const lastActualIndex = prediction && prediction.predictedStars30d ? dataToRender.length - 2 : dataToRender.length - 1;
      const firstDate = new Date(dataToRender[0].date);
      const lastDate = new Date(dataToRender[lastActualIndex].date);
      const options = { month: 'long', year: 'numeric' };
      dateRangeText = `${firstDate.toLocaleDateString('en-US', options)} - ${lastDate.toLocaleDateString('en-US', options)}`;
    } catch (e) {
      console.error("Error formatting date range", e);
    }
  }

  if (loading) {
    return (
      <div className="graph-hist" style={{ height: '390px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading history from OSSInsight...</p>
      </div>
    );
  }

  if (dataToRender.length < 2) {
    return (
      <div className="graph-hist" style={{ height: '390px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Insufficient historical data to plot evolution</p>
      </div>
    );
  }

  return (
    <div className="graph-hist flex flex-col" style={{ width: '100%' }}>
      {}
      <div style={{ width: '100%', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>
        <h3 className="graph-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
          {hasOss ? (
            <>Historical Evolution: Issue Creators vs PR Creators</>
          ) : (
            <>Historical Evolution: Stars vs Forks</>
          )}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
          {hasOss 
            ? "Monthly comparison of the number of issue creators and pull request creators"
            : "Cumulative progression of the number of stars and forks of the repository"
          }
        </p>
      </div>

      {}
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
                  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
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
                        {new Date(payload[0].payload.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                      {payload.map((item, idx) => {
                        if (item.value === null || item.value === undefined) return null;
                        return (
                          <p key={idx} style={{ margin: 0, padding: '2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }}></span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.name}:</span>
                            <strong style={{ color: 'var(--text-color)' }}>{item.value.toLocaleString()}</strong>
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              name={hasOss ? "PR Creators" : "Forks"}
              dataKey="val2"
              type="natural"
              fill="var(--chart-2)"
              fillOpacity={0.25}
              stroke="var(--chart-2)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              name={hasOss ? "Issue Creators" : "Stars"}
              dataKey="val1"
              type="natural"
              fill="var(--chart-1)"
              fillOpacity={0.25}
              stroke="var(--chart-1)"
              strokeWidth={2}
              stackId="a"
            />
            <Line
              name="Predicted trajectory"
              dataKey="predictedStars"
              stroke="#ff7300"
              strokeDasharray="5 5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#ff7300' }}
              connectNulls={false}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  {payload.map((entry, index) => {
                    return (
                      <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: entry.dataKey === 'predictedStars' ? '0%' : '50%',
                          backgroundColor: entry.color,
                          display: 'inline-block'
                        }}></span>
                        {entry.value}
                      </span>
                    );
                  })}
                </div>
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {}
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
