// 1. Les imports
const { fetchGithubData } = require('./githubService.js'); 
const Project = require('../models/Project.js');
const connectDB = require('../config/db.js');
require('dotenv').config();

const tabProjects = ["facebook/react", "vuejs/vue", "angular/angular", "twbs/bootstrap", "tailwindlabs/tailwindcss", "nodejs/node", "expressjs/express", "django/django", "spring-projects/spring-boot", "laravel/laravel", "tensorflow/tensorflow", "facebook/react-native", "torvalds/linux", "microsoft/vscode", "microsoft/TypeScript", "kubernetes/kubernetes"];

async function initialiserBaseDeDonnees() {
    try {
        await connectDB();
        console.log("⏳ Début de la récupération des données GitHub...");

        for(let i = 0; i < tabProjects.length; i++) {
            const nomDuProjet = tabProjects[i];
            console.log(`Traitement de ${nomDuProjet}...`);

            const data = await fetchGithubData(nomDuProjet);
            
            if (data) {
                await Project.create(data);
                console.log(`✅ ${nomDuProjet} sauvegardé avec succès !`);
            }
        }

        console.log("🎉 Initialisation terminée ! Tu peux vérifier Atlas.");
        process.exit(); 

    } catch (erreur) {
        console.error("❌ Une erreur globale est survenue :", erreur);
        process.exit(1);
    }
}

initialiserBaseDeDonnees();