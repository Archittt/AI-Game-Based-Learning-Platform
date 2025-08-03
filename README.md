# AI‑Game‑Based‑Learning‑Platform

An interactive learning platform leveraging AI‑powered game mechanics to enhance education through play.

## 🚀 Overview

This project explores how AI-driven game environments can support learning by:

- Presenting educational content as gamified challenges.
- Integrating AI agents to adapt scenarios in real-time.
- Measuring learner progress via game interactions.
- Supporting multiplayer or solo play with intelligent feedback.

## 🎮 Features

- **Game Modules**: Multiple educational scenarios (e.g., math puzzles, coding challenges, vocabulary drills) presented as in-game tasks.
- **AI Adaptivity**: Difficulty, pacing, and content dynamically adjusted using AI or heuristic logic.
- **Progress Tracking**: Automatic tracking of user performance, scores, and learning curves.
- **Analytics Dashboard**: Insights into performance trends and content effectiveness.
- **Multiplayer/Multimodal**: Optional support for collaborative or competitive play.

## 📁 Repository Structure

```
/AI for All/               --> All Frontend Files (HTML/CSS/JS)
/controllers/              --> Business logic for each route
/controllers/Analytics/    --> Analytics-specific controllers
/middlewares/              --> Custom middleware (authentication)
/models/                   --> Mongoose schemas (MongoDB)
/routes/                   --> All route definitions
/socket/                   --> WebSocket handlers
/utils/                    --> Utility functions (e.g. JWT)
/.env                      --> Environment variables
/db.js                     --> MongoDB connection setup
/server.js                 --> Main server entry point
/package.json              --> Node.js project config and dependencies
/README.md — this file
```

## 🔍 Detailed File Navigation
### ✅ Entry Points
- server.js: Initializes the Express app, connects to MongoDB, sets up middlewares, routes, and socket listeners.
- db.js: Handles connection to MongoDB using Mongoose.

### 🛠 Middleware
- /middlewares/authenticate.js: Middleware to verify JWT tokens and protect routes.

###🗂️ Controllers
- authController.js: Handles login, registration, and JWT issuance.
- aiModuleController.js: Manages AI module-related logic.
- dashboardController.js: Logic for populating user dashboard data.
- quizChallengeController.js: Creates and evaluates quiz challenges.

### Analytics Controllers:
  - engagementController.js – Tracks and serves user engagement metrics
  - outcomesController.js – Manages learning outcomes
  - progressController.js – Tracks user/module progress

###🧠 Models
- userModel.js – User details and credentials
- AlModule.js – Stores AI learning modules
- ChatSession.js – History of user-AI chats
- Reward.js – Rewards and badges
- XPLog.js – Experience points and level tracking
- gameProgress.js – Tracks mini-game progress
- mission.js – Missions assigned to users
- module.js – Learning modules structure
- quizAttemptModel.js – Quiz submissions
- UserEngagement.js – Analytics on user actions

### 📡 Routes
- authRoutes.js → Login/Register
- dashboard.js → Dashboard metrics
- ailntegrationRoutes.js → AI modules, they use API endpoints provided by the AIML team
- quizChallengeRoutes.js → Quizzes
- leaderboard Routes.js → Leaderboards
- moduleRoutes.js, modules.js → Learning modules
- analyticsRoutes.js → Engagement and progress APIs
- gameRoutes.js → Game-related endpoints
- rewardRoutes.js → Reward points/badges
- chatBotRoutes.js → Chatbot interaction
- mission.js → User missions

### 🔌 WebSockets
- chatSocket.js → Real-time chatbot messaging
- gameSocket.js → Live game interactions
- notifySocket.js → Real-time notifications to user

### 🔧 Utilities
- jwtUtils.js → JWT token creation and verification

###🌐 Frontend
- /AI for All/: Contains the client-side code (HTML, CSS, JavaScript), connected to the backend through REST APIs and WebSockets.


## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) v14+ and NPM  
- Python 3 (For AIML Backend)

## ⚙️ Installation

```bash
git clone https://github.com/Archittt/AI-Game-Based-Learning-Platform.git
cd AI-Game-Based-Learning-Platform
npm install              # Front-end or engine setup
pip install -r requirements.txt   # Python dependencies
```

## 🚀Usage

### Install dependencies
```
npm install
```
### Start server
```
npm start    
```

## 🧠 Workflow

- Launch the platform.
- Choose a learning category (e.g., geography quiz).
- AI agent generates a set of challenges tailored to skill level.
- User answers through game interaction.
- Platform immediately provides feedback & adapts next set of tasks.

## ⚙️ Configuration
- Modify ```.env``` to customize:
- Learning objectives and thresholds
- AI difficulty calibration
- User authentication and session behavior
- UI themes and accessibility options

## 🛣️ Roadmap

- Expand AI modules for richer adaptivity
- Add support for multiplayer collaborative gameplay
- Integrate LLM or NLP modules for open-ended question support
- Mobile deployment (iOS/Android)
- Gamified rewards, badges, and leaderboards

## 📊 Flow Diagrams

### Authentication Flow
<img width="825" height="762" alt="image" src="https://github.com/user-attachments/assets/87137689-3085-467d-af36-1e828932e65c" />

### Dashboard and Module Access
<img width="825" height="762" alt="image" src="https://github.com/user-attachments/assets/e4b9946b-5194-4e40-9c44-e546d78dbb1f" />

### Quiz Flow
<img width="860" height="931" alt="image" src="https://github.com/user-attachments/assets/d0278eef-cd61-4a23-b903-326d3fe57fc4" />

### Real-time Chat (WebSocket) Flow
<img width="825" height="762" alt="image" src="https://github.com/user-attachments/assets/680851d9-34b5-40aa-933b-242972f76ffc" />

### Analytics Flow
<img width="825" height="631" alt="image" src="https://github.com/user-attachments/assets/e0d8285f-a97e-4e6c-a429-e3f90d50a8ac" />


## 🤝 Contributing
Contributions welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests to refine logic or add features
- Propose educational scenarios or modules

Please follow the coding style and include tests for new features.
