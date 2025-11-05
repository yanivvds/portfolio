// Simple development server that runs both React app and API
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// Start the React development server
console.log('🚀 Starting React development server...');
const reactProcess = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3001' }
});

// Proxy API requests to Vercel's dev server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => {
    console.log('🚨 API proxy error:', err.message);
    res.status(500).json({
      response: "API server not running. Please start with: npm run dev:api",
      followUpQuestions: ["How do I start the API server?"],
      interactiveElement: {
        type: 'contact',
        content: 'Development Help',
        metadata: {
          contacts: [{
            id: "docs",
            title: "Check README",
            subtitle: "Development setup instructions",
            value: "See README.md for setup",
            link: "#"
          }]
        }
      }
    });
  }
}));

// Start API server on port 3002
console.log('🤖 Starting API development server...');
const apiProcess = spawn('npx', ['vercel', 'dev', '--port', '3002', '--listen', '127.0.0.1:3002'], {
  stdio: 'inherit',
  shell: true
});

// Start the proxy server
app.listen(PORT, () => {
  console.log(`🌐 Development proxy server running on http://localhost:${PORT}`);
  console.log(`📱 React app available at http://localhost:${PORT}`);
  console.log(`🔧 API available at http://localhost:${PORT}/api/*`);
  console.log(`⚠️  Make sure to run: npm run dev:api`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  reactProcess.kill();
  apiProcess.kill();
  process.exit(0);
});
