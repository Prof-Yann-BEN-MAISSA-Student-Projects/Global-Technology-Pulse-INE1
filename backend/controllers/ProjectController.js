const axios = require('axios');
const Project = require('../models/Project.js');
require('dotenv').config();

async function getProjects(req, res){
    try{
        const projects = await Project.find({}, {history: 0});
        res.status(200).json(projects);
    } catch (erreur) {
        console.error("Erreur lors du GET :", erreur);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

async function getProfiles(req, res){
    try{
        const nomComplet = decodeURIComponent(req.params.nomDuProjet);
        const urlGithub = `https://api.github.com/repos/${nomComplet}/contributors?per_page=100`;

        const resp = await axios.get(urlGithub, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json' 
            }
        });

        const contributors = resp.data;
        const coordonneesFinales = [];

        for (const contributor of contributors){
            const userResp = await axios.get(contributor.url, {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json' 
                }
            }); 
            
            const user = userResp.data;

            if (user.location != null){
                const loca = user.location;
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loca)}`;
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const resp = await axios.get(url, {
                    headers: { 'User-Agent': 'TechPulse-INPT-App' }
                });
                
                const location = resp.data;
                if (location.length != 0){
                    const lat = location[0].lat;
                    const lon = location[0].lon;
                    const finalLocation = {lat, lon};
                    coordonneesFinales.push(finalLocation);
                }
            }
            
            if (coordonneesFinales.length == 20){
                break;
            }
        }
        res.status(200).json(coordonneesFinales);
        
    } catch(err){
        console.error("Erreur dans getProfiles :", err.message);
        res.status(400).json({ message: "Erreur lors du GET", details: err.message });
    }
}

async function getOneProject(req, res) { 
    try {
        const nomComplet = decodeURIComponent(req.params.nomDuProjet);
        const projet = await Project.findOne({ full_name: nomComplet });
        
        if (!projet) {
            return res.status(404).json({ message: "Projet introuvable dans la base de données." });
        }
        
        res.status(200).json(projet);
    } catch (erreur) {
        console.error("Erreur lors de la récupération du projet :", erreur);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

async function searchApi(req, res){
    try{
        const motCle = req.params.motCle;
        const url = `https://api.github.com/search/repositories?q=${motCle}`;

        const resp = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json' 
            }
        });
                
        const projectList = resp.data.items;

        const finalProjectsList = projectList.map(projet => ({
            full_name: projet.full_name,
            description: projet.description,
            language: projet.language,
            stargazers_count: projet.stargazers_count,
            forks_count: projet.forks_count,
            watchers_count: projet.watchers_count,
            open_issues_count: projet.open_issues_count,
            avatar_url: projet.owner?.avatar_url
        }));
        
        res.status(200).json(finalProjectsList);
    }
    catch(e){
        console.error("Erreur lors du GET searchApi :", e);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

async function createProject(req, res) {
    try {
        const nouveauProjet = new Project(req.body);
        const projetSauvegarde = await nouveauProjet.save();
        res.status(201).json(projetSauvegarde);
    } catch (erreur) {
        console.error("Erreur lors du POST :", erreur);
        res.status(400).json({ message: "Erreur lors de la création", details: erreur.message });
    }
}

module.exports = {
    getProjects,
    getOneProject,
    getProfiles,
    searchApi,
    createProject
}