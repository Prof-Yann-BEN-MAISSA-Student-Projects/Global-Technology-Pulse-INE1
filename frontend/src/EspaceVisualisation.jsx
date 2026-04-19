import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useLocation, useNavigate } from 'react-router-dom';

function EspaceVisualisation() {
    // 1. On crée la référence (le bac à sable)
    const svgRef = useRef();
    const navigate = useNavigate();

    const { projet } = useLocation().state;

    useEffect(() => {
        // 2. On dit à D3 de cibler notre bac à sable
        const svg = d3.select(svgRef.current);

        // 3. Juste pour tester : on peint le fond en gris clair
        svg.style("background-color", "#e9ecef");

        // Tout notre futur code "flashy" ira ici !

    }, []); // Le tableau vide signifie qu'on dessine une fois au chargement

    function retourner() {
        navigate(-1);
    }
    const fakeHistory = [
        { date: '2026-04-10', stars: 100 },
        { date: '2026-04-11', stars: 150 },
        { date: '2026-04-12', stars: 180 },
        { date: '2026-04-13', stars: 250 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Visualisation Avancée</h1>
            <ul style={{ marginBottom: '10px' }}>
                <img src={projet.avatar_url} alt={projet.full_name} width="80px" height="70px" ></img>
            </ul>
            <ul style={{ marginBottom: '10px' }}>
                <strong>{projet.full_name}</strong>
            </ul>
            <ul style={{ marginBottom: '10px' }}>
                Etoiles : {projet.stargazers_count}  ⭐
            </ul>
            <ul style={{ marginBottom: '10px' }}>
                Forks : {projet.forks_count} ✂️
            </ul>
            <ul style={{ marginBottom: '10px' }}>
                Language : {projet.language}  🖋️
            </ul>
            <LineChart data={fakeHistory} width="500px" height="200px" >
                <XAxis dataKey="date"></XAxis>
                <YAxis></YAxis>
                <Tooltip></Tooltip>
                <Line dataKey="stars" stroke="#00056d"></Line>
            </LineChart>
            <ul>
                <button className='btnRetour' onClick={() => { retourner() }}>Retour Accueil</button>
            </ul>
            {/* 4. On place le bac à sable sur l'écran */}
            <svg ref={svgRef} width="800" height="500"></svg>
        </div>
    );
}

export default EspaceVisualisation;