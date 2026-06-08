const cron = require('node-cron');
const axios = require('axios');
const Project = require('../models/Project');
const { fetchGithubData, getStargazersLocations } = require('./githubService');

const mettreAJourLesProjets = async () => {
    console.log("⚙️ [WORKER] Lancement de la mise à jour automatique...");

    try {
        const projetsEnBase = await Project.find();

        for (let i = 0; i < projetsEnBase.length; i++) {
            const nomDuProjet = projetsEnBase[i].full_name;
            console.log(`📡 Interrogation de GitHub pour ${nomDuProjet}...`);

            const nouvellesDonnees = await fetchGithubData(nomDuProjet);

            if (nouvellesDonnees) {
                await Project.updateOne(
                    { full_name: nomDuProjet },
                    {
                        $set: {
                            stargazers_count: nouvellesDonnees.stargazers_count,
                            forks_count: nouvellesDonnees.forks_count,
                            watchers_count: nouvellesDonnees.watchers_count,
                            open_issues_count: nouvellesDonnees.open_issues_count,
                            size: nouvellesDonnees.size,
                        },
                        $push: {
                            history: {
                                date: new Date(),
                                stars: nouvellesDonnees.stargazers_count,
                            }
                        }
                    }
                );
                console.log(`✅ ${nomDuProjet} mis à jour avec succès !`);
            }
        }
        console.log("🏁 [WORKER] Tous les projets sont à jour. Je retourne dormir.");

    } catch (erreur) {
        console.error("❌ [WORKER] Erreur critique :", erreur);
    }
};


async function updateProjectDemographics(nomComplet) {
    console.log(`Début de l'analyse démographique pour ${nomComplet}...`);
    
    // 1. On sépare le propriétaire et le nom (ex: "facebook" et "react")
    const [owner, repoName] = nomComplet.split('/');
    
    // 2. On récupère la liste des villes brutes depuis notre nouveau service GraphQL
    const villesBrutes = await getStargazersLocations(owner, repoName);
    
    // Ce dictionnaire va stocker nos totaux (ex: { "France": 12, "Morocco": 5 })
    const statistiquesPays = {}; 

    // 3. La boucle de traduction Ville -> Pays
    for (const ville of villesBrutes) {
        try {
            // L'astuce addressdetails=1 permet de récupérer le pays exact
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville)}&addressdetails=1`;
            
            // La fameuse pause d'1 seconde pour protéger ton IP !
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            
            const resp = await axios.get(url, {
                headers: { 'User-Agent': 'TechPulse-INPT-App' }
            });

            // Si Nominatim a trouvé la ville et qu'il y a bien un pays associé
            if (resp.data.length > 0 && resp.data[0].address && resp.data[0].address.country) {
                const pays = resp.data[0].address.country;
                
                // On ajoute +1 au compteur de ce pays (ou on l'initialise à 1)
                statistiquesPays[pays] = (statistiquesPays[pays] || 0) + 1;
            }
        } catch (err) {
            console.error(`Impossible de géocoder la ville : ${ville}`);
        }
    }

    // 4. On transforme notre dictionnaire en un tableau compatible avec notre modèle MongoDB
    const demographicsArray = Object.keys(statistiquesPays).map(nomPays => ({
        country: nomPays,
        count: statistiquesPays[nomPays]
    }));

    // 5. On sauvegarde le résultat final dans la base de données
    await Project.findOneAndUpdate(
        { full_name: nomComplet },
        { $set: { demographics: demographicsArray } }
    );

    console.log(`✅ Succès : Démographie mise à jour pour ${nomComplet} !`);
}

const demarrerWorker = () => {
    cron.schedule('0 0 * * *', mettreAJourLesProjets);

    console.log("⏰ Automatisme activé : Le serveur interrogera GitHub chaque jour à minuit.");
};

function initScheduler() {
    console.log("⏰ Planificateur de tâches (Cron Job) initialisé.");

    // Syntaxe Cron : '0 0 * * *' signifie "Tous les jours à minuit pile"
    // Pour tes tests de soutenance, tu peux mettre '0 */12 * * *' (toutes les 12 heures)
    cron.schedule('0 0 * * *', async () => {
        console.log("⚡ Exécution automatique du Cron Job de minuit...");
        
        try {
            // Récupérer tous les projets en BDD
            const projetsSuivis = await Project.find({});
            
            // On met à jour chaque projet un par un
            for (const projet of projetsSuivis) {
                await updateProjectDemographics(projet.full_name);
            }
            
            console.log("🏁 Toutes les démographies ont été mises à jour avec succès.");
        } catch (erreur) {
            console.error("Erreur lors de l'exécution du Cron planifié :", erreur);
        }
    });
}

module.exports = {
    demarrerWorker,
    initScheduler,
    updateProjectDemographics,
    mettreAJourLesProjets
};