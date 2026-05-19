const cron = require('node-cron');
const Project = require('../models/Project');
const { fetchGithubData } = require('./githubService');

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


const demarrerWorker = () => {
    cron.schedule('0 0 * * *', mettreAJourLesProjets);

    console.log("⏰ Automatisme activé : Le serveur interrogera GitHub chaque jour à minuit.");
};

module.exports = demarrerWorker;