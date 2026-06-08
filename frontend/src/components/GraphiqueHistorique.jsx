import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import '../css/GraphiqueHistorique.css';

export default function GraphiqueHistorique({ donnees, starsCount, forksCount, nomProjet }) {
  const svgRef = useRef(null);
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
        
        const finalData = Object.values(merged).sort((a,b) => new Date(a.date) - new Date(b.date));
        
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

  useEffect(() => {
    if (loading) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Priorité à OSSInsight, sinon fallback sur 'donnees' de la base
    let dataToRender = [];
    let isOss = false;

    if (ossData && ossData.length >= 2) {
      dataToRender = ossData.map(d => ({
        date: new Date(d.date),
        etoiles: d.val1,
        forks: d.val2
      }));
      isOss = true;
    } else if (donnees && donnees.length >= 2) {
      dataToRender = donnees.map(d => ({
        date: new Date(d.date),
        etoiles: d.stars || d.etoiles || 0,
        forks: d.forks || 0
      })).sort((a, b) => a.date - b.date);
    }

    if (dataToRender.length < 2) {
      svg.append("text")
         .attr("x", 350)
         .attr("y", 175)
         .attr("text-anchor", "middle")
         .style("fill", "#64748b")
         .style("font-size", "14px")
         .text("Données historiques insuffisantes pour tracer une évolution");
      return;
    }

    const largeur = 700;
    const hauteur = 350;
    const marges = { haut: 40, droite: 65, bas: 45, gauche: 65 };
    const largeurInterne = largeur - marges.gauche - marges.droite;
    const hauteurInterne = hauteur - marges.haut - marges.bas;

    const g = svg.append("g")
      .attr("transform", `translate(${marges.gauche},${marges.haut})`);

    // --- ÉCHELLE X (Temps) ---
    const echelleX = d3.scaleTime()
      .domain(d3.extent(dataToRender, d => d.date))
      .range([0, largeurInterne]);

    // --- ÉCHELLE Y GAUCHE ---
    const minStars = d3.min(dataToRender, d => d.etoiles);
    const maxStars = d3.max(dataToRender, d => d.etoiles);
    const echelleYStars = d3.scaleLinear()
      .domain([Math.min(0, minStars * 0.95), maxStars * 1.05])
      .range([hauteurInterne, 0]);

    // --- ÉCHELLE Y DROITE ---
    const minForks = d3.min(dataToRender, d => d.forks);
    const maxForks = d3.max(dataToRender, d => d.forks);
    const echelleYForks = d3.scaleLinear()
      .domain([Math.min(0, minForks * 0.90), maxForks * 1.05])
      .range([hauteurInterne, 0]);

    // --- AXES ---
    g.append("g")
      .attr("transform", `translate(0,${hauteurInterne})`)
      .call(d3.axisBottom(echelleX).ticks(6).tickFormat(d3.timeFormat("%b %Y")))
      .attr("color", "#64748b")
      .style("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(echelleYStars).ticks(5).tickFormat(d => {
        if (d >= 1000) return (d / 1000).toFixed(1) + "k";
        return d;
      }))
      .attr("color", "#eab308")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .call(g => g.select(".domain").remove());

    g.append("g")
      .attr("transform", `translate(${largeurInterne},0)`)
      .call(d3.axisRight(echelleYForks).ticks(5).tickFormat(d => {
        if (d >= 1000) return (d / 1000).toFixed(1) + "k";
        return d;
      }))
      .attr("color", "#3b82f6")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .call(g => g.select(".domain").remove());

    // --- COURBES ---
    const ligneStars = d3.line()
      .x(d => echelleX(d.date))
      .y(d => echelleYStars(d.etoiles))
      .curve(d3.curveMonotoneX);

    const ligneForks = d3.line()
      .x(d => echelleX(d.date))
      .y(d => echelleYForks(d.forks))
      .curve(d3.curveMonotoneX);

    // Animation
    const animerLigne = (chemin) => {
      const node = chemin.node();
      if (!node) return;
      const longueur = node.getTotalLength();
      chemin
        .attr("stroke-dasharray", `${longueur} ${longueur}`)
        .attr("stroke-dashoffset", longueur)
        .transition().duration(2000).ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);
    };

    const pathStars = g.append("path")
      .datum(dataToRender)
      .attr("fill", "none")
      .attr("stroke", "#eab308")
      .attr("stroke-width", 2.5)
      .attr("d", ligneStars);
    animerLigne(pathStars);

    const pathForks = g.append("path")
      .datum(dataToRender)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2.5)
      .attr("d", ligneForks);
    animerLigne(pathForks);

  }, [starsCount, forksCount, donnees, ossData, loading]);

  const hasOss = ossData && ossData.length >= 2;

  return (
    <div className='graph-hist'>
      <h3 className='graph-title' style={{ textAlign: 'center', fontSize: '1.15rem', marginBottom: '1rem' }}>
        {hasOss ? (
          <>Évolution Historique : <span style={{color: '#eab308'}}>Créateurs Issues</span> vs <span style={{color: '#3b82f6'}}>Créateurs PRs</span></>
        ) : (
          <>Évolution : <span style={{color: '#eab308'}}>Étoiles</span> vs <span style={{color: '#3b82f6'}}>Forks</span></>
        )}
      </h3>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '4rem' }}>Chargement de l'historique depuis OSSInsight...</p>
      ) : (
        <svg ref={svgRef} viewBox="0 0 700 350" style={{ width: '100%', maxWidth: '700px', height: 'auto' }} />
      )}
    </div>
  );
}
