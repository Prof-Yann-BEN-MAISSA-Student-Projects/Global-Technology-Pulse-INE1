const express = require('express');
const router = express.Router();

const projectController = require('../controllers/ProjectController');

router.get('/', projectController.getProjects);
router.get('/:nomDuProjet', projectController.getOneProject);

router.post('/', projectController.createProject);

module.exports = router;