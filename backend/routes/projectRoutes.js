const express = require('express');
const router = express.Router();

const projectController = require('../controllers/ProjectController');

router.get('/', projectController.getProjects);
router.get('/recherche/:motCle', projectController.searchApi);
router.get('/trending', projectController.getTrendingProjects);
router.get('/trending-paginated', projectController.getTrendingPaginated);
router.get('/usecases/filter', projectController.filterByTags);
router.get('/:nomDuProjet/locations', projectController.getProfiles)
router.get('/:nomDuProjet', projectController.getOneProject);


router.post('/', projectController.createProject);

module.exports = router;