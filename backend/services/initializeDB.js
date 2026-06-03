// 1. Les imports
const axios = require('axios');
const { fetchGithubData } = require('./githubService.js'); 
const Project = require('../models/Project.js');
const connectDB = require('../config/db.js');
require('dotenv').config();

const tabProjectsDefault = [
    "facebook/react", "vuejs/vue", "angular/angular", "twbs/bootstrap", 
    "tailwindlabs/tailwindcss", "nodejs/node", "expressjs/express", 
    "django/django", "spring-projects/spring-boot", "laravel/laravel", 
    "tensorflow/tensorflow", "facebook/react-native", "torvalds/linux", 
    "microsoft/vscode", "kubernetes/kubernetes"
];

async function initialiserBaseDeDonnees() {
    try {
        await connectDB();
        console.log("⏳ Début de la récupération des dépôts populaires depuis OSSInsight...");
        
        let reposToFetch = [...tabProjectsDefault];
        
        try {
            const hotResponse = await axios.get('https://api.ossinsight.io/v1/collections/hot/', {
                headers: { 'Accept': 'application/json' }
            });
            
            if (hotResponse.data && hotResponse.data.data && hotResponse.data.data.rows) {
                const hotRepos = hotResponse.data.data.rows.map(item => item.repo_name).filter(Boolean);
                console.log(`🔥 Récupéré ${hotRepos.length} dépôts "hot" depuis OSSInsight.`);
                reposToFetch = [...reposToFetch, ...hotRepos];
            }
        } catch (err) {
            console.error("⚠️ Impossible de contacter OSSInsight API, utilisation de la liste par défaut :", err.message);
        }
        
        // Supprimer les doublons
        const uniqueProjects = [...new Set(reposToFetch)];
        console.log(`📊 Nombre total de projets uniques à traiter : ${uniqueProjects.length}`);
        console.log("⏳ Début de la récupération des données GitHub...");

        for (let i = 0; i < uniqueProjects.length; i++) {
            const nomDuProjet = uniqueProjects[i];
            console.log(`[${i + 1}/${uniqueProjects.length}] Traitement de ${nomDuProjet}...`);

            try {
                // Éviter de surcharger l'API GitHub et prévenir le rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const data = await fetchGithubData(nomDuProjet);
                
                if (data) {
                    await Project.updateOne(
                        { full_name: nomDuProjet },
                        { 
                            $set: data,
                            $setOnInsert: {
                                history: [{
                                    date: new Date(),
                                    stars: data.stargazers_count
                                }]
                            }
                        },
                        { upsert: true }
                    );
                    console.log(`   ✅ ${nomDuProjet} sauvegardé avec succès !`);
                }
            } catch (err) {
                console.error(`   ❌ Erreur sur ${nomDuProjet} :`, err.message);
            }
        }

        console.log("🎉 Initialisation et mise à jour terminées ! Tu peux vérifier Atlas.");
        process.exit(0); 

    } catch (erreur) {
        console.error("❌ Une erreur globale est survenue :", erreur);
        process.exit(1);
    }
}

initialiserBaseDeDonnees();