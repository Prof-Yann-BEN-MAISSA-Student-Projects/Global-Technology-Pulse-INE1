const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    avatar_url: String,
    full_name: { type: String, required: true, unique: true },
    description: String,
    language: String,
    stargazers_count: Number,
    forks_count: Number,
    watchers_count: Number,
    open_issues_count: Number,
    size: Number,
    contributors_url: String,
    history: [{
        date: { type: Date, default: Date.now },
        stars: Number
    }],
    demographics: [{
        country: String,
        count: Number
    }],
    domainTags: [String],
    countryTags: [String]
}, { timestamps: true });



module.exports = mongoose.model('Project', projectSchema);