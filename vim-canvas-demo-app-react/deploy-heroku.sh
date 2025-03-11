#!/bin/bash

# ScribeAI VIM Canvas App - Heroku Deployment Script
# This script helps deploy the application to Heroku

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}ScribeAI VIM Canvas App - Heroku Deployment Script${NC}"
echo "========================================================"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}Error: Heroku CLI is not installed.${NC}"
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
echo -e "${YELLOW}Checking Heroku login status...${NC}"
heroku whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "You need to log in to Heroku first."
    heroku login
fi

# Ask for app name
read -p "Enter your Heroku app name (leave blank to create a new app): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo -e "${YELLOW}Creating a new Heroku app...${NC}"
    heroku create
    APP_NAME=$(heroku apps:info | grep "=== " | cut -d' ' -f2)
else
    # Check if app exists
    heroku apps:info --app $APP_NAME &> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Creating Heroku app: $APP_NAME${NC}"
        heroku create $APP_NAME
    else
        echo -e "${GREEN}Using existing Heroku app: $APP_NAME${NC}"
    fi
fi

# Set environment variables
echo -e "${YELLOW}Setting up environment variables...${NC}"

# Read environment variables
read -p "Enter CLIENT_ID: " CLIENT_ID
read -p "Enter CLIENT_SECRET: " CLIENT_SECRET
read -p "Enter SCRIBEAI_API_KEY: " SCRIBEAI_API_KEY

# Set the REDIRECT_URL to the Heroku app URL
REDIRECT_URL="https://$APP_NAME.herokuapp.com"

# Set environment variables in Heroku
echo -e "${YELLOW}Setting environment variables in Heroku...${NC}"
heroku config:set CLIENT_ID="$CLIENT_ID" --app $APP_NAME
heroku config:set CLIENT_SECRET="$CLIENT_SECRET" --app $APP_NAME
heroku config:set REDIRECT_URL="$REDIRECT_URL" --app $APP_NAME
heroku config:set SCRIBEAI_API_KEY="$SCRIBEAI_API_KEY" --app $APP_NAME

# Add Heroku buildpacks
echo -e "${YELLOW}Adding Heroku buildpacks...${NC}"
heroku buildpacks:clear --app $APP_NAME
heroku buildpacks:add heroku/nodejs --app $APP_NAME
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static --app $APP_NAME

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Deploy to Heroku
echo -e "${YELLOW}Deploying to Heroku...${NC}"
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open the app
echo -e "${GREEN}Deployment complete! Opening the app...${NC}"
heroku open --app $APP_NAME

echo -e "${GREEN}Your app is now deployed at: https://$APP_NAME.herokuapp.com${NC}"
echo -e "${YELLOW}You can use this URL when submitting for review on getvim.com${NC}" 