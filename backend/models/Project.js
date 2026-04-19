const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    avatar_url: String,
    full_name: { type: String, required: true, unique: true },
    description: String,
    language: String,
    stargazers_count: Number,
    forks_count: Number,
    history: [{
        date: { type: Date, default: Date.now },
        stars: Number
    }]
}, { timestamps: true }); 



module.exports = mongoose.model('Project', projectSchema);