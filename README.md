# 🌐 TechPulse INPT

> **Visualize Open Source Activity.** Track, analyze, and compare GitHub repositories with real-time metrics, contributor insights, and trend detection — all in one place.

![TechPulse INPT Banner](https://via.placeholder.com/1200x400?text=TechPulse+INPT+-+GitHub+Analytics+Platform) ## 📖 About The Project

TechPulse INPT is a live GitHub analytics platform designed for developers, researchers, and open-source enthusiasts. It provides deep insights into the health, momentum, and global reach of open-source projects. By aggregating data from millions of commits and thousands of repositories, TechPulse allows users to discover trending tech stacks, compare repository performance head-to-head, and visualize contributor locations on an interactive 3D globe.

## ✨ Key Features

* **Live Metrics Tracking:** Analyze real-time statistics across 50K+ tracked repositories and 2.4M+ commits.
* **Deep Dive Analytics:** View detailed metrics for individual repositories including stars, forks, open issues, language breakdowns, and activity status.
* **Repository Comparison:** Go head-to-head with side-by-side comparisons (e.g., React vs. Linux) featuring radar charts for project health and bar charts for key metrics.
* **Trending & Hot Collections:** Discover the most popular projects gaining momentum right now, categorized by domains like AI & Machine Learning, Frontend Frameworks, Cloud & DevOps, and Security.
* **Global Contributor Mapping:** Visualize where a project's contributors are located around the world using an interactive 3D globe.
* **Historical Evolution:** Track the growth of a repository over time with interactive line charts comparing stars and forks.

## 🛠️ Tech Stack

This project is built utilizing a modern, full-stack architecture:

* **Frontend:** React.js, Recharts / Chart.js (for analytics visualization), React Globe (for 3D mapping).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB.
* **External APIs:** GitHub REST/GraphQL API for fetching real-time repository and user data.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js installed on your machine
* A GitHub Personal Access Token (for API rate limits)
* MongoDB running locally or via MongoDB Atlas

### Installation

1. Clone the repository
   ```bash
   git clone [https://github.com/your-username/techpulse-inpt.git](https://github.com/your-username/techpulse-inpt.git)

2. Navigate into the project directory
   ```bash
   cd techpulse-inpt

3. Install NPM packages for both client and server
   ```bash
   npm install
   cd client && npm install

4. Create a .env file in the root directory and enter your API keys and Database URI:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GITHUB_API_TOKEN=your_github_personal_access_token

5. Run the application (development mode)
   ```bash
   npm run dev


## 👥 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

## 📄 License
Distributed under the MIT License. See LICENSE for more information.

## 📧 Contact
Project Link: https://github.com/AlaeeddineAmrani/techpulse-inpt
