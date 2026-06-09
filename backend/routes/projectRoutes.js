const express = require('express');
const router = express.Router();

const projectController = require('../controllers/ProjectController');
const predictionController = require('../controllers/predictionController');

router.get('/', projectController.getProjects);
router.get('/recherche/:motCle', projectController.searchApi);
router.get('/trending', projectController.getTrendingProjects);
router.get('/trending-paginated', projectController.getTrendingPaginated);
router.get('/usecases/filter', projectController.filterByTags);
router.get('/predictions/trending', predictionController.getTrending);
router.post('/predictions/refresh', predictionController.refreshPredictions);
router.get('/predictions/:repoId', predictionController.getPrediction);
router.get('/:nomDuProjet/locations', projectController.getProfiles);
router.get('/:nomDuProjet', projectController.getOneProject);

router.post('/', projectController.createProject);

module.exports = router;