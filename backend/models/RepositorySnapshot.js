const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  repoId: { type: String, required: true, index: true }, // e.g., "facebook/react"
  repoName: String,
  owner: String,
  date: { type: Date, required: true, default: Date.now },
  stars: Number,
  forks: Number,
  commits: Number,
  issuesOpened: Number,
  language: String
});

// Compound index for fast queries
snapshotSchema.index({ repoId: 1, date: -1 });

module.exports = mongoose.model('RepositorySnapshot', snapshotSchema);
