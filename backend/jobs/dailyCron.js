const cron = require('node-cron');
const { collectDailySnapshots, computePredictions } = require('../services/predictionService');

function initPredictionJobs() {
  console.log("⏰ [Prediction Cron] Initializing popularity prediction cron jobs...");
  
  
  cron.schedule('0 0 * * *', async () => {
    console.log("⚡ [Prediction Cron] Running daily snapshot collection job...");
    await collectDailySnapshots();
  });

  
  cron.schedule('0 1 * * *', async () => {
    console.log("⚡ [Prediction Cron] Running daily predictions update job...");
    await computePredictions();
  });
  
  console.log("✅ [Prediction Cron] Prediction jobs successfully scheduled.");
}

module.exports = {
  initPredictionJobs
};
