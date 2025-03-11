import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Environment variables
const PORT = process.env.PORT || 8788;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL || 'http://localhost:8788';
const VIM_AUTHORIZE_ENDPOINT = process.env.VIM_AUTHORIZE_ENDPOINT || 'https://auth.vim.com/authorize';
const VIM_TOKEN_ENDPOINT = process.env.VIM_TOKEN_ENDPOINT || 'https://auth.vim.com/oauth/token';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.get('/api/launch', (req, res) => {
  const launchId = req.query.launch_id;
  const vimOrgId = req.query.vim_organization_id;
  console.log(`Launch request received with launch_id: ${launchId}, vim_organization_id: ${vimOrgId}`);
  console.log(`Query params:`, req.query);
  
  // Make sure the redirect URL ends with a trailing slash if it doesn't already
  let redirectUrl = REDIRECT_URL;
  if (!redirectUrl.endsWith('/')) {
    redirectUrl += '/';
  }
  
  const authorizeUrl = `${VIM_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=openid%20profile%20email${launchId ? `&launch_id=${launchId}` : ''}`;
  console.log(`Redirecting to: ${authorizeUrl}`);
  res.redirect(authorizeUrl);
});

app.post('/api/token', async (req, res) => {
  try {
    console.log('Token request received:', req.body);
    const { code } = req.body;
    
    if (!code) {
      console.error('No authorization code provided');
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Make sure the redirect URL ends with a trailing slash if it doesn't already
    let redirectUrl = REDIRECT_URL;
    if (!redirectUrl.endsWith('/')) {
      redirectUrl += '/';
    }

    console.log(`Exchanging code for token with VIM_TOKEN_ENDPOINT: ${VIM_TOKEN_ENDPOINT}`);
    const tokenResponse = await fetch(VIM_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUrl
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(tokenResponse.status).json(tokenData);
    }

    console.log('Token exchange successful');
    res.json(tokenData);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a route to handle the redirect from the VIM authorization endpoint
app.get('/', (req, res) => {
  const code = req.query.code;
  console.log('Received redirect from VIM authorization endpoint with code:', code);
  
  if (code) {
    console.log('Authorization code received, rendering index.html');
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 