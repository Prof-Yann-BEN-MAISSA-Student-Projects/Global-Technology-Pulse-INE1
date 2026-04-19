const Project = require('../models/Project.js');

async function getProjects(req, res){
    try{
        const projects = await Project.find({}, {history: 0});
        res.status(200).json(projects);
    } catch (erreur) {
        console.error("Erreur lors du GET :", erreur);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

async function getOneProject(req, res) { 
    const projet = await Project.findOne({ full_name: req.params.nomDuProjet });
    res.json(projet);
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
    createProject
}