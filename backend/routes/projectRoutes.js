const express = require('express');
const router = express.Router();

const projectController = require('../controllers/ProjectController');

router.get('/', projectController.getProjects);
router.get('/recherche/:motCle', projectController.searchApi);
router.get('/:nomDuProjet/locations', projectController.getProfiles)
router.get('/:nomDuProjet', projectController.getOneProject);


router.post('/', projectController.createProject);

module.exports = router;