# SysDevGuide: Engineering Playbook

An interactive, curated learning tool containing system design patterns, .NET architecture cheat sheets, DSA techniques, and an exploration of the AI Engineering shift. 

This project was built to transform a standard developer portfolio into a high-value, dynamic knowledge base.

## Tech Stack
- **Framework:** React + TypeScript via [Vite](https://vitejs.dev/)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Styling:** Pure CSS (Vanilla) with CSS Variables for Dark Mode/Glassmorphism

---

## 🚀 Running Locally

To run this application on your local machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16 or higher is recommended).

### 1. Install Dependencies
Open your terminal in the root directory of this project and run:

```bash
npm install
```

### 2. Start the Development Server
Once the dependencies are installed, start the local development server:

```bash
npm run dev
```

The application will now be running. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

---

## 🛠 Building for Production

To create a production-ready build:

```bash
npm run build
```
This will compile the TypeScript, bundle the assets, and output static files into the `dist` directory. 

To preview the production build locally:
```bash
npm run preview
```

## Adding New Content
The playbook's data is currently stored directly within the React components located in the `src/views/` directory. 
- To add a new System Design pattern, edit `src/views/SystemDesignView.tsx`.
- To add a new DSA pattern, edit `src/views/DSAView.tsx`.
- Hot-module-reloading (HMR) is enabled, so any saves will instantly reflect in your browser.
