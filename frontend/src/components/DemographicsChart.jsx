import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function DemographicsChart({ data }) {
    // Si la data n'est pas encore là ou si elle est vide
    if (!data || data.length === 0) {
        return <p style={{ color: '#8892b0' }}>No demographic data available.</p>;
    }

    // On trie pour avoir les plus gros pays en premier, et on ne garde que le Top 5
    const top5Countries = [...data]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Un dégradé de couleurs cyber/néon pour tes barres
    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7', '#d946ef'];

    return (
        <div>
            <h1 className="chart-title">Stars par Pays</h1>
            <div style={{ width: '100%', height: 250 }}>
                
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Countries} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide /> {/* On cache l'axe X pour un style plus épuré */}
                        <YAxis 
                            dataKey="country" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }} 
                            width={100}
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#3b82f6', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {top5Countries.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DemographicsChart;