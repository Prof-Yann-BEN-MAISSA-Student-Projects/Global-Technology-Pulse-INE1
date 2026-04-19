require('dotenv').config(); 
const PORT = process.env.PORT || 2500;
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db'); 
const demarrerWorker = require('./services/worker'); 

const app = express();

connectDB(); 

app.use(cors()); 
app.use(express.json()); 

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

demarrerWorker(); 

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});