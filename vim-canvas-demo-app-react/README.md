# ScribeAI VIM Canvas Demo App

## Setup

### Environment Variables

This application requires several environment variables to be set up. We've provided a setup script to simplify this process:

```bash
# Make the script executable (if not already)
chmod +x setup-env.sh

# Run the setup script
./setup-env.sh
```

Alternatively, you can manually create the following files:

1. `.env` - For the ScribeAI API key:
```
VITE_SCRIBEAI_API_KEY=your_scribeai_api_key_here
```

2. `.dev.vars` - For Cloudflare Workers environment variables:
```
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URL=http://localhost:8788
```

Example files are provided as `.env.example` and `.dev.vars.example`.

## Deployment

### Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

This will start the application at http://localhost:5173 with the API server running at http://localhost:8788.

### Heroku Deployment

This application can be deployed to Heroku for submission to getvim.com. We've provided a deployment script to simplify the process:

```bash
# Make the script executable (if not already)
chmod +x deploy-heroku.sh

# Run the deployment script
./deploy-heroku.sh
```

For detailed deployment instructions, see [HEROKU_DEPLOYMENT.md](./HEROKU_DEPLOYMENT.md).

## Submitting for Review

After deploying your application to Heroku, you can submit it for review on getvim.com. We've provided a guide to help you through the submission process:

[SUBMISSION_GUIDE.md](./SUBMISSION_GUIDE.md) 