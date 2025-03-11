# Deploying ScribeAI VIM Canvas App to Heroku

This document provides instructions for deploying the ScribeAI VIM Canvas application to Heroku.

## Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Git installed
3. Node.js and npm installed
4. A Heroku account

## Deployment Steps

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create a new Heroku app

```bash
heroku create scribeai-vim-canvas
```

Or use a custom name:

```bash
heroku create your-app-name
```

### 3. Set environment variables

Set the required environment variables in Heroku:

```bash
heroku config:set CLIENT_ID=your_client_id
heroku config:set CLIENT_SECRET=your_client_secret
heroku config:set REDIRECT_URL=https://your-app-name.herokuapp.com
heroku config:set SCRIBEAI_API_KEY=your_scribeai_api_key
```

### 4. Deploy to Heroku

From the root of the project:

```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
git push heroku main
```

If you're using a different branch:

```bash
git push heroku your-branch:main
```

### 5. Open the deployed app

```bash
heroku open
```

## Troubleshooting

### Viewing logs

```bash
heroku logs --tail
```

### Restarting the app

```bash
heroku restart
```

### Checking environment variables

```bash
heroku config
```

## Important Notes

1. The application uses Cloudflare Workers for serverless functions. On Heroku, we're using Wrangler to serve the built application.
2. Make sure your REDIRECT_URL matches your Heroku app URL.
3. The static.json file configures the Heroku static buildpack to handle SPA routing.

## Updating the Deployment

To update your deployed application:

```bash
git add .
git commit -m "Update application"
git push heroku main
```

## Submitting for Review on getvim.com

After successful deployment, you can submit your application for review on getvim.com using the deployed Heroku URL. 