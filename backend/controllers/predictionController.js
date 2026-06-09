const predictionService = require('../services/predictionService');
const Prediction = require('../models/Prediction');

async function getPrediction(req, res) {
  const { repoId } = req.params;
  const decodedRepoId = decodeURIComponent(repoId);
  try {
    const prediction = await predictionService.getPrediction(decodedRepoId);
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction data not found for this repository' });
    }
    res.json(prediction);
  } catch (err) {
    console.error('Error fetching prediction:', err.message);
    res.status(500).json({ error: 'Failed to retrieve repository prediction' });
  }
}

async function getTrending(req, res) {
  const { category, limit, sortBy } = req.query;
  const parsedLimit = parseInt(limit, 10) || 10;
  try {
    const count = await Prediction.countDocuments();
    if (count === 0) {
      console.log('[PredictionController] No predictions cache found. Computing initial predictions...');
      await predictionService.computePredictions();
    }
    
    const trending = await predictionService.getTrendingRepos(category, parsedLimit, sortBy);
    res.json(trending);
  } catch (err) {
    console.error('Error fetching trending predictions:', err.message);
    res.status(500).json({ error: 'Failed to retrieve trending predictions' });
  }
}

async function refreshPredictions(req, res) {
  try {
    await predictionService.computePredictions();
    res.json({ message: 'Predictions successfully updated' });
  } catch (err) {
    console.error('Error refreshing predictions:', err.message);
    res.status(500).json({ error: 'Failed to recompute predictions' });
  }
}

module.exports = {
  getPrediction,
  getTrending,
  refreshPredictions
};
