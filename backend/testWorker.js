const mongoose = require('mongoose');
const { updateProjectDemographics } = require('./services/worker');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("🔌 Connecté à MongoDB pour le test.");
        
        
        await updateProjectDemographics('facebook/react');
        
        console.log("🏁 Test terminé avec succès !");
        process.exit(0); 
    })
    .catch(err => {
        console.error("Erreur de connexion :", err);
        process.exit(1);
    });