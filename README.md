# Project TB Celik

This project is a continuation of the below github project.  
https://github.com/wanyinggg/Tuberculosis  
This project focuses of adding the features of infographics, videos and the addition of games to the Tuberculosis web platform.  

## Prerequisites
Before you begin, ensure you have installed:
- Node.js (version 18.16.1)
- npm/yarn (version 0.40.1)

## Installation

1. Clone the repository
```bash
git clone https://github.com/YenSiang99/Tuberculosis.git
```

2. Install dependencies
```bash
cd frontend && npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps
```

3. Set up environment variables
- A set of `.env.development` and `.env.production` files are present in the /frontend directory and /backend directory 
- You can take a look into the .env.development when you are building in your local.
- Otherwise, the configuration in .env.production in /frontend and /backend have already been setup to suit the configuration on the server. 

## Running the Application on your local
- Open two terminals.
- To run frontend, run the below command
```bash
cd frontend
npm run start
```
- To run backend, runt he below command
```bash
cd frontend
npm run start
```

### Production Build
- After you have pushed the code to your github, running the below command.
```bash
git add .
git commit -m "Some commit message"
git push origin main
```
- Go to the jenkins website, and build the frontend or backend based on your needs.
- http://srv621803.hstgr.cloud:8080/login?from=%2F

## Project Structure

```
Project/
├── frontend/                  # React frontend application
│   ├── node_modules/         # Frontend dependencies
│   ├── public/               # Videos and infographics data are stored here
│   ├── src/                  # Source code directory
│   │   ├── assets/          # Cover and logo
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context for state management
│   │   ├── css/            # CSS/SCSS style files
│   │   ├── layout/         # Layout components. One for authentication, and after login. One for TBInfo
│   │   ├── locales/        # Internationalization files, used for static language translation
│   │   ├── pages/          # Page components/routes
│   │   ├── utils/          # Utility functions and helpers
│   │   ├── App.css         # Main application styles
│   │   ├── App.js          # Main application component
│   │   ├── index.css       # Global styles
│   │   └── index.js        # Application entry point
│   ├── .env.development    # Development environment variables
│   ├── .env.production     # Production environment variables
│   └── .gitignore         # Git ignore rules
│
├── backend/                  # Node.js/Express backend application
│   ├── controllers/        # Route controllers/business logic
│   ├── media/             # Uploaded files and media storage
│   ├── middlewares/       # Express middlewares, used for authentication
│   ├── models/            # Database models
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility function, mainly for sending email
│   ├── .env.development   # Development environment variables
│   ├── .env.production    # Production environment variables
│   ├── Dockerfile         # Docker container configuration
│   ├── Jenkinsfile        # Jenkins CI/CD pipeline configuration
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Server entry point
```

## Available Scripts

- `npm run start` - Runs the app in development mode (this is what is mainly used for this project)
- `npm run test` - Runs the app in test suite (not used anymore)
- `npm run build` - Builds the app for production (not used anymore after the jenkins pipeline is built)


## Additional Notes
- None
