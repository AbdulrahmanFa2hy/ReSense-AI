import express from 'express';
import { exec } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const streamlitApp = 'finaldeployment_colored.py';
const streamlitPort = 8501;
const nodePort = 3000;

// Function to start Streamlit server
const startStreamlit = () => {
  exec(`streamlit run ${streamlitApp}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Streamlit: ${error}`);
      return;
    }
    console.log(stdout);
  });
};

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
  startStreamlit();
});
