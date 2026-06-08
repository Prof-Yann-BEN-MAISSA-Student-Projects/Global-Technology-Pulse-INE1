const mongoose = require('mongoose');
const { updateProjectDemographics } = require('./services/worker');
require('dotenv').config();

// On se connecte à MongoDB juste pour le test
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("🔌 Connecté à MongoDB pour le test.");
        
        // On lance notre fameux worker sur un gros projet !
        await updateProjectDemographics('facebook/react');
        
        console.log("🏁 Test terminé avec succès !");
        process.exit(0); // On ferme le script
    })
    .catch(err => {
        console.error("Erreur de connexion :", err);
        process.exit(1);
    });