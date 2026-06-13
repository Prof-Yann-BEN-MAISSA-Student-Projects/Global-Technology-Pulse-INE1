<div align="center">

<img src="https://img.shields.io/badge/INPT-Institut%20National%20des%20Postes%20et%20T%C3%A9l%C3%A9communications-003087?style=for-the-badge&logoColor=white" alt="INPT"/>

# 🌐 TechPulse INPT

### *Visualize Open Source Activity — Track, Analyze, Compare.*

> A live GitHub analytics platform providing deep insights into the health, momentum, and global reach of open-source repositories — all in one place.

<br/>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

<br/>

```
📦 50,000+ Repositories   •   📈 2.4M+ Commits   •   🌍 180+ Countries
```

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Platform Preview](#-platform-preview)
  - [🏠 Homepage & Hero Section](#-homepage--hero-section)
  - [📊 Repository Analytics Dashboard](#-repository-analytics-dashboard)
  - [📈 Historical Evolution Chart](#-historical-evolution-chart)
  - [🌍 3D Contributor Globe](#-3d-contributor-globe)
  - [🕸️ Project Health Radar](#%EF%B8%8F-project-health-radar)
  - [🌸 Variable Metrics Pie Chart](#-variable-metrics-pie-chart)
  - [📊 Demographics Bar Chart](#-demographics-bar-chart)
  - [🎯 Radial Analysis Chart](#-radial-analysis-chart)
  - [⚔️ Repository Comparison](#%EF%B8%8F-repository-comparison)
  - [🔥 Trending Repositories](#-trending-repositories)
  - [💼 Professional Use Cases](#-professional-use-cases)
- [Key Features](#-key-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [License](#-license)

---

## 🔭 About The Project

**TechPulse INPT** is a full-stack web application developed at the *Institut National des Postes et Télécommunications* (INPT), Morocco. It serves as a real-time open-source intelligence platform, aggregating data from the GitHub API, OSSInsight, and OpenStreetMap/Nominatim to deliver rich, multi-dimensional analytics on any GitHub repository.

Unlike GitHub's native statistics — limited to a single repository at a time with no cross-project comparison — TechPulse INPT offers:

- 🔍 **Multi-source data aggregation** (GitHub REST, GitHub GraphQL, OSSInsight, Nominatim)
- 📊 **Six distinct interactive visualizations** per repository
- ⚖️ **Side-by-side comparison** of any two repositories with logarithmic normalization
- 🌍 **WebGL 3D globe** showing contributor geographic distribution
- 💼 **Domain & geography-based discovery** through professional scenario presets
- 🔄 **Automated nightly updates** via cron workers keeping all metrics fresh

---

## 🖼️ Platform Preview

### 🏠 Homepage & Hero Section

> *The landing page features an animated SVG pulse graph, real-time platform statistics, a trending repositories grid, and six curated domain collection cards.*

![Homepage & Hero Section](screenshots/homepage.png)

The Hero section displays:
- An **animated dual-line SVG graph** with gradient fills and glow effects, simulating live data streams
- **Stat cards** showing platform-wide coverage: 50K+ repos, 2.4M+ commits, 180+ countries
- **Floating orb background** with depth animations
- Staggered **fade-in collection cards** (AI & ML, Frontend, Cloud & DevOps, Mobile, Security, Backend) with hover glow effects and growth percentages

```
┌─────────────────────────────────────────────────────────┐
│  📈 Animated SVG Graph (pulse waveform)                 │
│                                                         │
│  [ 50K+ Repos ]  [ 2.4M Commits ]  [ 180+ Countries ]   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 🤖 AI/ML │ │ ⚛️ Front│ │ ☁️ Cloud │ │📱 Mobile│    │ 
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### 📊 Repository Analytics Dashboard

> *The most feature-rich page (465 lines). Provides a comprehensive analytics view for any GitHub repository, combining data from MongoDB cache, GitHub REST/GraphQL APIs, and OSSInsight.*

![Repository Analytics Dashboard](screenshots/repo-dashboard.png)

The dashboard presents:
- **Overview Banner** — repository avatar, full name (owner/repo), description, direct GitHub link
- **Stats Banner** — Stars ⭐, Forks 🍴, Primary Language, Activity Status — with colored icons
- Six analytics visualizations laid out in a responsive CSS Grid

---

### 📈 Historical Evolution Chart

> *Stacked area chart rendered with Recharts AreaChart. Displays monthly Issue Creators vs PR Creators (OSSInsight data) or Stars vs Forks (MongoDB history) over time.*

![Historical Evolution Chart](screenshots/chart-history.png)

**Data source:** OSSInsight `/issue_creators/history` and `/pull_request_creators/history` endpoints (primary), with fallback to MongoDB `history` array (Stars over time).

**Visual details:**
- Two overlapping gradient-filled area series (blue `#3b82f6` and purple `#a855f7`)
- Custom tooltip with formatted dates and formatted numbers
- `ResponsiveContainer` for fluid width adaptation
- X-axis with monthly tick labels, Y-axis with auto-scaled domain

```
Stars / Issues
    ▲
    │   ░░░░░░░░░░░░░░░
    │  ░░░░░░░░░░░░░░░░░░░░░
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░
    └──────────────────────────► time (months)
      2023       2024       2025
```

---

### 🌍 3D Contributor Globe

> *Interactive WebGL globe built with `react-globe.gl` (Three.js under the hood). Shows animated rings at contributor locations, with ring radius proportional to the percentage of contributors from each country.*

![3D Contributor Globe](screenshots/globe-3d.png)

**Data pipeline:**

```
OSSInsight /issue_creators/countries
        │
        ▼
Country code → 150+ entry coordinate dictionary
        │
        ▼
Ring data: { lat, lng, radius ∝ contributor % }
        │
        ▼
react-globe.gl ringsData renderer
        │ (fallback if OSSInsight returns no data)
        ▼
Backend /api/projects/:name/locations
→ Nominatim geocoding (1s/request, max 20 results)
```

**Visual details:**
- Auto-rotating dark Earth texture
- Pulsating animated rings at each contributor cluster
- Ring altitude and radius proportional to country contribution share
- Hover interaction showing country name and percentage

---

### 🕸️ Project Health Radar

> *Five-axis radar chart using Recharts RadarChart. Evaluates Stars, Forks, Watchers, Open Issues, and Repository Size — all normalized logarithmically to a [0–100] scale for fair comparison across metrics of vastly different magnitudes.*


![Project Health Radar](screenshots/radar-health.png)

**Normalization formula:**

```
score(val, max) = Math.min(100, Math.round(
  (Math.log(val + 1) / Math.log(max + 1)) × 100
))
```

This ensures a repository with 200K stars and one with 50 open issues are both represented meaningfully on the same pentagon.

**Visual details:**
- Neon glow effect via SVG `feGaussianBlur` filter on the polygon fill
- Dark background with grid lines at 25%, 50%, 75%, 100%
- Custom label rendering for each axis
- Gradient fill from `#3b82f6` (blue) to `#a855f7` (purple)

```
          Stars
            ★
           /|\
          / | \
   Size  /  |  \  Forks
        /   |   \
       /    |    \
 Issues    ───    Watchers
```

---

### 🌸 Variable Metrics Pie Chart

> *A "rose diagram" (Nightingale chart) rendered with Recharts PieChart. Each of the five sectors has a different outer radius, proportional to the logarithm of its metric value — encoding two dimensions simultaneously.*

![Variable Metrics Pie Chart](screenshots/pie-variable.png)

**Radius mapping:**

```javascript
getRadius(val) = 25 + (log10(val+1) / log10(maxVal+1)) × 65
// Maps values to radius bounds [25, 90]
```

**Sectors:** Stars, Forks, Watchers, Open Issues, Size (KB)

**Visual details:**
- Each sector has a unique color from the cyan-to-purple gradient palette
- Labels positioned outside each sector with connector lines
- Hovering a sector highlights its value in a custom tooltip
- The overall shape intuitively conveys the relative magnitude of each metric

---

### 📊 Demographics Bar Chart

> *Horizontal bar chart (Recharts BarChart) showing the top 5 countries by contributor count. Preceded by a CSS-only radar scanning animation during the 1–3 minute geocoding process.*

![Demographics Bar Chart](screenshots/demographics.png)

**Loading state:**
- A radar scan animation (`DemographicsContainer`) with rotating sweep line, range rings, and blinking dots indicates background geocoding is in progress
- Smooth transition to the bar chart once data is ready

**Visual details:**
- Horizontal bars with a gradient from `#06b6d4` (cyan) to `#a855f7` (purple) across the top 5 entries
- Country names on the Y-axis, contributor counts on the X-axis
- Responsive layout with formatted number labels

```
🇺🇸 United States  ████████████████████  4,821
🇬🇧 United Kingdom ██████████████        2,103
🇩🇪 Germany        ████████████          1,892
🇨🇳 China          ██████████            1,543
🇫🇷 France         ████████               987
```

---

### 🎯 Radial Analysis Chart

> *Concentric radial bar chart (Recharts RadialBarChart) representing all five repository metrics as independently sized arcs around a shared center point.*

![Radial Analysis Chart](screenshots/radial-bar.png)

**Visual details:**
- Five concentric arcs for Stars, Forks, Watchers, Issues, Size (MB)
- Each arc color-coded from the platform's primary palette
- Inline labels showing metric name and value at the arc endpoint
- Log-normalized values ensure all arcs are visible regardless of scale differences

---

### ⚔️ Repository Comparison

> *Side-by-side comparison of any two GitHub repositories. Features three synchronized visualizations: a head-to-head stats table, a custom SVG bar chart, and a dual-polygon radar chart.*

![Repository Comparison](screenshots/compare.png)

**Comparison metrics:** Stars, Forks, Watchers, Open Issues, Language, Contributors, Commits

**Three views:**

1. **Head-to-Head Table** — metric rows with winner highlighting (blue `#3b82f6` vs purple `#a855f7`)

2. **Metrics Bar Chart** — custom SVG-rendered grouped bars with interactive hover tooltips showing exact values

3. **Overall Performance Radar** — dual overlapping polygons on a 5-axis radar (Stars, Forks, Watchers, Issues, Size), both log-normalized to [0–100]

```
 Repo A (──)           Repo B (──)

               Stars
              ╱   ╲
         Size ╲   ╱ Forks
              ╱   ╲
       Issues ─────  Watchers
```

---

### 🔥 Trending Repositories

> *Paginated display of globally trending repositories sourced from the OSSInsight Hot Collections API. 10 repositories per page with smooth scroll-to-top on navigation.*

![Trending Repositories](screenshots/trending.png)

**Data source:** OSSInsight `/collections/hot/` endpoint — fetches up to ~60 unique repositories across multiple hot collection groups.

**Each repository card displays:**
- Repository avatar and full name (`owner/repo`)
- Description with 3-line clamp
- Primary language with color dot indicator
- Stars and forks count with formatted numbers
- Trend badge

---

### 💼 Professional Use Cases

> *Six pre-built professional scenarios filtering repositories by domain and geography, ideal for domain-specific technology discovery.*

![Professional Use Cases](screenshots/usecases.png)

| Scenario | Domain Filter | Geography |
|---|---|---|
| 📱 Développeur Mobile au Maroc | Mobile | 🇲🇦 Maroc |
| 🗄️ Architecte SGBD en France | Database | 🇫🇷 France |
| 🤖 Spécialiste Intelligence Artificielle | AI | 🌍 Global |
| 🌐 Ingénieur Web Fullstack | Web | 🌍 Global |
| 📉 Data Scientist | Data Science | 🌍 Global |
| ☁️ Expert DevOps & Cloud | DevOps | 🌍 Global |

Repositories are filtered via the `/api/projects/usecases/filter?domain=X&country=Y` endpoint, backed by `domainTags` and `countryTags` fields in MongoDB, sorted by stars descending.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 **Smart Search** | Search any GitHub repository by keyword — results cached in MongoDB for instant subsequent loads |
| 📊 **Multi-Chart Dashboard** | 6 distinct visualizations per repository: area chart, globe, radar, rose diagram, bar chart, radial chart |
| ⚖️ **Comparison Engine** | Log-normalized side-by-side comparison of any two repos across 7 dimensions |
| 🔥 **Trending Explorer** | Paginated trending repos from OSSInsight Hot Collections, updated in real time |
| 🌍 **3D Globe** | WebGL contributor globe with animated rings proportional to country contribution share |
| 💼 **Use Case Presets** | 6 professional scenario filters by domain + geography |
| 🌙 **Dark / Light Mode** | Real-time theme toggle via CSS variables — no page reload |
| 🔄 **Nightly Auto-Update** | Cron workers refresh metrics (stars, forks, issues) and demographics every midnight |
| 📱 **Responsive Design** | Fully adaptive across mobile (< 768px), tablet, and desktop (> 1024px) |
| ⚡ **Cache-First Strategy** | Repo data fetched from GitHub on first visit, then served from MongoDB for <2s responses |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| **React.js** | 19.2.7 | Core UI — functional components, hooks |
| **Vite** | 8.0.9 | Build tool — HMR, ES modules, fast bundling |
| **React Router DOM** | 7.15.0 | Client-side routing (9 routes) |
| **Recharts** | 2.15.4 | AreaChart, RadarChart, BarChart, PieChart, RadialBarChart |
| **react-globe.gl** | 2.37.1 | WebGL 3D interactive globe |
| **D3.js** | 7.9.0 | Data-driven document manipulation |
| **Axios** | 1.15.2 | HTTP client for API calls |
| **Lucide React** | 1.16.0 | Icon library |
| **Vanilla CSS** | — | Custom design system — CSS variables, dark/light themes |

### Backend

| Technology | Version | Role |
|---|---|---|
| **Node.js** | LTS | Server-side JavaScript runtime |
| **Express.js** | 5.2.1 | REST API framework |
| **Mongoose** | 9.4.1 | MongoDB ODM — schema validation, CRUD |
| **node-cron** | 4.2.1 | Scheduled nightly data update workers |
| **Axios** | 1.15.0 | Outbound calls to GitHub, OSSInsight, Nominatim |
| **dotenv** | 17.4.1 | Environment variable management |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing middleware |

### Database & Deployment

| Technology | Role |
|---|---|
| **MongoDB Atlas** | Cloud NoSQL database — repos, history, demographics |
| **Vercel** | Monorepo deployment — frontend at `/`, backend at `/_/backend` |

### External APIs

| API | Usage |
|---|---|
| **GitHub REST API v3** | Repo metadata, contributors, search |
| **GitHub GraphQL API v4** | Stargazer locations (paginated, up to 500/repo) |
| **OSSInsight API** | Hot collections, issue/PR history, country distribution |
| **Nominatim OSM** | Geocoding location strings → lat/lon coordinates |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        User Browser (React SPA)                     │
│                                                                     │
│  HomePage  RepoDetails  ComparePage  TrendingPage  UseCasesPage ... │
│       │          │            │            │              │         │
│       └──────────┴────────────┴────────────┴──────────────┘         │
│                              │                                      │
│              ┌───────────────┴───────────────────┐                  │
│              │           Axios HTTP Client       │                  │
│              └───────────────┬───────────────────┘                  │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
         ┌─────────────────────┴────────────────────┐
         │                                          │
         ▼                                          ▼
┌─────────────────────┐                  ┌────────────────────┐
│  Express.js Backend │                  │  OSSInsight API    │
│  (Node.js :2500)    │                  │  (direct client)   │
│                     │                  │  - hot collections │
│  MVC + Service Layer│                  │  - history charts  │
│                     │                  │  - country data    │
└────────┬────────────┘                  └────────────────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────────┐        ┌──────────────────────────┐
│ MongoDB Atlas│        │     External APIs        │
│              │        │                          │
│ - Projects   │        │  GitHub REST API v3      │
│ - history[]  │        │  GitHub GraphQL API v4   │
│ - demograph[]│        │  Nominatim OSM           │
│ - domainTags │        │                          │
│ - countryTags│        └──────────────────────────┘
└──────────────┘
         ▲
         │
┌────────┴──────────────┐
│   node-cron Workers   │
│   (daily @ midnight)  │
│                       │
│  demarrerWorker()     │
│  → update metrics     │
│  → append history[]   │
│                       │
│  initScheduler()      │
│  → GraphQL stargazers │
│  → Nominatim geocode  │
│  → update demographics│
└───────────────────────┘
```

### Project Structure

```
Tech-Pulse-INPT/
├── backend/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Business logic (8 API handlers)
│   ├── models/            # Mongoose schema (Project)
│   ├── routes/            # Express route definitions
│   ├── services/
│   │   ├── githubService.js   # GitHub REST + GraphQL
│   │   └── worker.js          # Cron jobs + Nominatim geocoding
│   ├── seedMassive.js     # Bulk seeding (18 queries, 6 domains)
│   ├── seedUseCases.js    # Curated use-case data
│   └── server.js          # Express entry point
├── frontend/
│   ├── src/
│   │   ├── pages/         # 9 page-level components
│   │   ├── components/    # 12 reusable UI components
│   │   ├── css/           # Component-specific stylesheets
│   │   └── App.jsx        # Root component + routing
│   └── index.html
└── vercel.json            # Monorepo deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A **GitHub Personal Access Token** (increases rate limit from 60 to 5,000 req/hour)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/AlaeeddineAmrani/Tech-Pulse-INPT.git
cd Tech-Pulse-INPT
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
PORT=2500
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/techpulse
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**5. Seed the database** *(optional but recommended)*

```bash
cd backend
node services/initializeDB.js    # Seeds 15 popular repos + OSSInsight hot
node seedMassive.js              # Bulk seeding across 6 domains (18 queries)
node seedUseCases.js             # 6 curated use-case repos
```

**6. Start the application**

Backend (port 2500):
```bash
cd backend
npm run dev
```

Frontend (port 5173):
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

Base URL: `/api/projects`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | All projects (excluding history for performance) |
| `GET` | `/recherche/:motCle` | Proxy search → GitHub Search API |
| `GET` | `/trending` | Top 6 trending repos (OSSInsight) |
| `GET` | `/trending-paginated` | Paginated trending (`?page=1&limit=10`) |
| `GET` | `/usecases/filter` | Filter by tags (`?domain=AI&country=Global`) |
| `GET` | `/:nom/locations` | Geocoded contributor locations (lat/lon) |
| `GET` | `/:nom` | Single repo — MongoDB cache or GitHub fallback |
| `POST` | `/` | Create a new project document |

**Error format:**
```json
{ "message": "Repository not found", "details": "..." }
```

---

## 👥 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add YourFeature"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open** a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 👨‍💻 Authors

<table>
  <tr>
    <td align="center">
      <b>AMRANI Alaeeddine</b><br/>
      <a href="https://github.com/AlaeeddineAmrani">@AlaeeddineAmrani</a>
    </td>
    <td align="center">
      <b>ELMARRHOUB Anas</b><br/>
      <a href="https://github.com/AnasElmarrhoub">@AnasElmarrhoub</a>
    </td>
  </tr>
</table>

**Supervised by:** Yann Ben Maissa — INPT

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 📧 Contact

**Project Repository:** [https://github.com/AlaeeddineAmrani/Tech-Pulse-INPT](https://github.com/AlaeeddineAmrani/Tech-Pulse-INPT)

---

<div align="center">

Made with ❤️ at **INPT — Institut National des Postes et Télécommunications**, Rabat, Morocco

*Année académique 2025/2026*

</div>