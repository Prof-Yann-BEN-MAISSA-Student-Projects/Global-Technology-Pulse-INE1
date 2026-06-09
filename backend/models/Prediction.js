const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  repoId: { type: String, required: true, unique: true },
  repoName: String,
  language: String,
  computedAt: { type: Date, default: Date.now },
  momentumScore: { type: Number, min: 0, max: 1 },
  trendClass: { type: String, enum: ['RISING_STAR', 'STABLE', 'DECLINING', 'INSUFFICIENT_DATA'] },
  predictedStars30d: Number,
  currentStars: Number,
  slope: Number,
  velocityStars: Number,
  velocityForks: Number,
  velocityCommits: Number,
  velocityIssues: Number,
  normalizedVelocities: {
    stars: Number,
    forks: Number,
    commits: Number,
    issues: Number
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
