import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DemographicsContainer.css';

import DemographicsChart from './DemographicsChart.jsx';

const DemographicsContainer = ({ nomProjet, onDataLoaded }) => {
  const [status, setStatus] = useState('processing');
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDemographics = async () => {
      console.log(`[Demographics] Lancement de l'analyse pour ${nomProjet}...`);
      try {
        // Appel de la vraie API (GET synchrone lourd au lieu du setInterval)
        const response = await axios.get(`http://localhost:2500/api/projects/${encodeURIComponent(nomProjet)}/locations`);

        if (isMounted) {
          setStatus('ready');

          // On aggrége les localisations par pays pour le graphique
          const countryCounts = {};
          response.data.forEach((item, idx) => {
            const countryName = item.country || `Localisation ${idx + 1}`;
            countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
          });

          const formattedData = Object.keys(countryCounts).map((key) => ({
            country: key,
            count: countryCounts[key]
          }));

          setData({ projet: nomProjet, stats: formattedData });
          if (onDataLoaded) onDataLoaded(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des localisations :", error);
        if (isMounted) {
          // On peut gérer un état 'error' ou repasser en 'ready' avec liste vide
          setStatus('ready');
          setData({ projet: nomProjet, stats: [] });
        }
      }
    };

    if (status === 'processing') {
      fetchDemographics();
    }

    return () => {
      isMounted = false;
    };
  }, [nomProjet, status]);

  return (
    <div className="demographics-container">
      {status === 'processing' ? (
        <div className="radar-wrapper fade-in">
          {/* Animation CSS pure du radar */}
          <div className="radar">
            <div className="radar-v-line"></div>
            <div className="radar-circle-inner"></div>
          </div>
          <p className="console-text">
            &gt; Satellite Analysis in progress...<span className="blink">_</span>
            <br />
            <span className="sub-text">(This can take till 3 minutes)</span>
          </p>
        </div>
      ) : (
        <div className="chart-wrapper fade-in">
          <DemographicsChart data={data?.stats} />
        </div>
      )}
    </div>
  );
};

export default DemographicsContainer;
