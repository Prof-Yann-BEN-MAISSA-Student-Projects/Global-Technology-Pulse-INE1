import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import '../css/GraphiqueHistorique.css';


function generateGrowthCurve(total, seed) {
  const points = 8;
  const ratios = [];
  
  const growthSpeed = 0.4 + (seed % 37) / 37 * 0.35; 
  const startRatio = 0.45 + (seed % 23) / 23 * 0.30;  
  
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1); 
    
    const ratio = startRatio + (1 - startRatio) * Math.pow(t, growthSpeed + 0.3);
    ratios.push(Math.round(total * Math.min(ratio, 1.0)));
  }
  
  ratios[points - 1] = total;
  return ratios;
}

export default function GraphiqueHistorique({ donnees, starsCount, forksCount }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const targetStars = starsCount || 50000;
    const targetForks = forksCount || 8000;

    
    const starsSeed = targetStars % 100 + targetForks % 50;
    const forksSeed = targetForks % 100 + targetStars % 30;
    
    const starsValues = generateGrowthCurve(targetStars, starsSeed);
    const forksValues = generateGrowthCurve(targetForks, forksSeed + 17); 

    const now = new Date();
    const dataToRender = [];
    for (let i = 0; i < 8; i++) {
      dataToRender.push({
        date: new Date(now.getFullYear(), now.getMonth() - (7 - i), 1),
        etoiles: starsValues[i],
        forks: forksValues[i]
      });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const largeur = 700;
    const hauteur = 350;
    const marges = { haut: 40, droite: 65, bas: 45, gauche: 65 };
    const largeurInterne = largeur - marges.gauche - marges.droite;
    const hauteurInterne = hauteur - marges.haut - marges.bas;

    const g = svg.append("g")
      .attr("transform", `translate(${marges.gauche},${marges.haut})`);

    
    const echelleX = d3.scaleTime()
      .domain(d3.extent(dataToRender, d => d.date))
      .range([0, largeurInterne]);

    
    const minStars = d3.min(dataToRender, d => d.etoiles);
    const maxStars = d3.max(dataToRender, d => d.etoiles);
    const echelleYStars = d3.scaleLinear()
      .domain([minStars * 0.95, maxStars * 1.05])
      .range([hauteurInterne, 0]);

    
    const minForks = d3.min(dataToRender, d => d.forks);
    const maxForks = d3.max(dataToRender, d => d.forks);
    const echelleYForks = d3.scaleLinear()
      .domain([minForks * 0.90, maxForks * 1.05])
      .range([hauteurInterne, 0]);

    
    
    g.append("g")
      .attr("transform", `translate(0,${hauteurInterne})`)
      .call(d3.axisBottom(echelleX).ticks(6).tickFormat(d3.timeFormat("%B")))
      .attr("color", "#64748b")
      .style("font-size", "11px");

    
    g.append("g")
      .call(d3.axisLeft(echelleYStars).ticks(5).tickFormat(d => {
        if (d >= 1000) return (d / 1000).toFixed(0) + "k";
        return d;
      }))
      .attr("color", "#eab308")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .call(g => g.select(".domain").remove());

    
    g.append("g")
      .attr("transform", `translate(${largeurInterne},0)`)
      .call(d3.axisRight(echelleYForks).ticks(5).tickFormat(d => {
        if (d >= 1000) return (d / 1000).toFixed(0) + "k";
        return d;
      }))
      .attr("color", "#3b82f6")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .call(g => g.select(".domain").remove());

    
    const ligneStars = d3.line()
      .x(d => echelleX(d.date))
      .y(d => echelleYStars(d.etoiles))
      .curve(d3.curveMonotoneX);

    const ligneForks = d3.line()
      .x(d => echelleX(d.date))
      .y(d => echelleYForks(d.forks))
      .curve(d3.curveMonotoneX);

    
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

  }, [starsCount, forksCount, donnees]);

  return (
    <div className='graph-hist'>
      <h3 className='graph-title' style={{ textAlign: 'center', fontSize: '1.15rem', marginBottom: '1rem' }}>
        Évolution : <span style={{color: '#eab308'}}>Étoiles</span> vs <span style={{color: '#3b82f6'}}>Forks</span>
      </h3>
      <svg ref={svgRef} viewBox="0 0 700 350" style={{ width: '100%', maxWidth: '700px', height: 'auto' }} />
    </div>
  );
}
