const mongoose = require('mongoose');
const Project = require('./models/Project');
const connectDB = require('./config/db');
require('dotenv').config();

const useCasesProjects = [
  {
    full_name: "facebook/react-native",
    description: "A framework for building native applications using React",
    language: "JavaScript",
    stargazers_count: 110500,
    forks_count: 23600,
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    domainTags: ["Mobile"],
    countryTags: ["Maroc", "Global"]
  },
  {
    full_name: "flutter/flutter",
    description: "Flutter makes it easy and fast to build beautiful apps for mobile and beyond",
    language: "Dart",
    stargazers_count: 155000,
    forks_count: 26000,
    avatar_url: "https://avatars.githubusercontent.com/u/14101776?v=4",
    domainTags: ["Mobile"],
    countryTags: ["Global"]
  },
  {
    full_name: "mongodb/mongo",
    description: "The MongoDB Database",
    language: "C++",
    stargazers_count: 24000,
    forks_count: 9000,
    avatar_url: "https://avatars.githubusercontent.com/u/45120?v=4",
    domainTags: ["Database", "NoSQL"],
    countryTags: ["France", "Global"]
  },
  {
    full_name: "redis/redis",
    description: "Redis is an in-memory database that persists on disk",
    language: "C",
    stargazers_count: 61000,
    forks_count: 22000,
    avatar_url: "https://avatars.githubusercontent.com/u/1529926?v=4",
    domainTags: ["Database", "NoSQL"],
    countryTags: ["Global"]
  },
  {
    full_name: "meta-llama/llama3",
    description: "The official Meta Llama 3 GitHub site",
    language: "Python",
    stargazers_count: 15000,
    forks_count: 1200,
    avatar_url: "https://avatars.githubusercontent.com/u/140040514?v=4",
    domainTags: ["AI", "LLM"],
    countryTags: ["Global"]
  },
  {
    full_name: "openai/gpt-3",
    description: "GPT-3: Language Models are Few-Shot Learners",
    language: "Python",
    stargazers_count: 19000,
    forks_count: 4000,
    avatar_url: "https://avatars.githubusercontent.com/u/14957082?v=4",
    domainTags: ["AI", "LLM"],
    countryTags: ["Global"]
  }
];

const seedDB = async () => {
  await connectDB();
  console.log("Connected to MongoDB for seeding...");

  for (let projData of useCasesProjects) {
    try {
      let existing = await Project.findOne({ full_name: projData.full_name });
      if (existing) {
        // Mettre à jour les tags si le projet existe déjà
        existing.domainTags = projData.domainTags;
        existing.countryTags = projData.countryTags;
        await existing.save();
        console.log(`Updated tags for ${projData.full_name}`);
      } else {
        const newProj = new Project(projData);
        await newProj.save();
        console.log(`Created new project ${projData.full_name}`);
      }
    } catch (err) {
      console.error(`Error with project ${projData.full_name}:`, err.message);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
};

seedDB();
