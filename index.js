import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const streamlitPort = process.env.STREAMLIT_PORT || 8501;
const nodePort = process.env.NODE_PORT || 3000;

// Function to start Streamlit server
const startStreamlit = () => {
  exec(`streamlit run finaldeployment_colored.py`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Streamlit: ${error}`);
      return;
    }
    console.log(stdout);
  });
};

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Route to start Streamlit server
app.get('/start-streamlit', (req, res) => {
  startStreamlit();
  res.send('Streamlit server started');
});

// Proxy middleware to forward requests to Streamlit server
app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:${streamlitPort}`,
    changeOrigin: true,
  })
);

// Start Express server
app.listen(nodePort, () => {
  console.log(`Node.js server is running on http://localhost:${nodePort}`);
});
