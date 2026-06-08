const mongoose = require('mongoose');
const axios = require('axios');
const Project = require('./models/Project');
const connectDB = require('./config/db');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Configuration des recherches pour obtenir une base diversifiée et massive
const searchConfigs = [
  // Mobile
  { query: 'topic:mobile', domain: 'Mobile', country: 'Global' },
  { query: 'topic:mobile location:morocco', domain: 'Mobile', country: 'Maroc' },
  { query: 'topic:android location:france', domain: 'Mobile', country: 'France' },
  // Web
  { query: 'topic:web', domain: 'Web', country: 'Global' },
  { query: 'topic:react location:morocco', domain: 'Web', country: 'Maroc' },
  { query: 'topic:vue location:france', domain: 'Web', country: 'France' },
  // Database / SGBD
  { query: 'topic:database', domain: 'Database', country: 'Global' },
  { query: 'topic:nosql', domain: 'Database', country: 'Global' },
  { query: 'topic:database location:france', domain: 'Database', country: 'France' },
  { query: 'topic:sql location:morocco', domain: 'Database', country: 'Maroc' },
  // AI / Machine Learning
  { query: 'topic:machine-learning', domain: 'AI', country: 'Global' },
  { query: 'topic:deep-learning', domain: 'AI', country: 'Global' },
  { query: 'topic:artificial-intelligence location:france', domain: 'AI', country: 'France' },
  // Data Science
  { query: 'topic:data-science', domain: 'Data Science', country: 'Global' },
  { query: 'topic:data-analysis', domain: 'Data Science', country: 'Global' },
  // DevOps
  { query: 'topic:devops', domain: 'DevOps', country: 'Global' },
  { query: 'topic:docker', domain: 'DevOps', country: 'Global' },
  { query: 'topic:kubernetes location:france', domain: 'DevOps', country: 'France' }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchAndSeed = async () => {
  await connectDB();
  console.log("🚀 Connexion à MongoDB réussie. Début du Seeding Massif...");

  let totalInserted = 0;
  let totalUpdated = 0;

  for (const config of searchConfigs) {
    console.log(`\n🔍 Recherche GitHub: "${config.query}" (Domaine: ${config.domain}, Pays: ${config.country})`);
    
    try {
      // Requête à l'API GitHub Search (100 résultats max par page)
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(config.query)}&sort=stars&order=desc&per_page=100`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const repos = response.data.items;
      console.log(`✅ ${repos.length} dépôts trouvés. Insertion en base...`);

      for (const repo of repos) {
        // Préparer le document
        const projData = {
          full_name: repo.full_name,
          description: repo.description || "Aucune description",
          language: repo.language || "Unknown",
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          watchers_count: repo.watchers_count || repo.stargazers_count,
          open_issues_count: repo.open_issues_count || 0,
          avatar_url: repo.owner ? repo.owner.avatar_url : ""
        };

        let existing = await Project.findOne({ full_name: projData.full_name });

        if (existing) {
          // Met à jour les tags si nécessaire sans écraser les anciens
          if (!existing.domainTags.includes(config.domain)) existing.domainTags.push(config.domain);
          if (!existing.countryTags.includes(config.country)) existing.countryTags.push(config.country);
          await existing.save();
          totalUpdated++;
        } else {
          // Nouveau projet
          const newProj = new Project({
            ...projData,
            domainTags: [config.domain],
            countryTags: [config.country]
          });
          await newProj.save();
          totalInserted++;
        }
      }

    } catch (err) {
      console.error(`❌ Erreur lors de la recherche "${config.query}":`, err.response ? err.response.data.message : err.message);
    }

    // Pause de 4 secondes pour éviter le Rate Limit de GitHub (30 requêtes / minute)
    console.log("⏳ Pause de 4s pour respecter le Rate Limit GitHub...");
    await sleep(4000);
  }

  console.log(`\n🎉 SEEDING TERMINÉ !`);
  console.log(`Nouveaux projets insérés : ${totalInserted}`);
  console.log(`Projets mis à jour : ${totalUpdated}`);
  process.exit(0);
};

fetchAndSeed();
