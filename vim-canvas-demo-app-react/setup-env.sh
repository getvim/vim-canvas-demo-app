#!/bin/bash

# ScribeAI VIM Canvas App - Environment Setup Script
# This script helps set up environment variables for local development

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}ScribeAI VIM Canvas App - Environment Setup Script${NC}"
echo "========================================================"

# Check if .env and .dev.vars files already exist
if [ -f .env ] || [ -f .dev.vars ]; then
    echo -e "${YELLOW}Warning: .env or .dev.vars files already exist.${NC}"
    read -p "Do you want to overwrite them? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Read environment variables
echo -e "${YELLOW}Please enter your environment variables:${NC}"
read -p "Enter CLIENT_ID: " CLIENT_ID
read -p "Enter CLIENT_SECRET: " CLIENT_SECRET
read -p "Enter SCRIBEAI_API_KEY: " SCRIBEAI_API_KEY
REDIRECT_URL="http://localhost:8788"

# Create .env file
echo -e "${YELLOW}Creating .env file...${NC}"
cat > .env << EOF
VITE_SCRIBEAI_API_KEY=${SCRIBEAI_API_KEY}
EOF

# Create .dev.vars file
echo -e "${YELLOW}Creating .dev.vars file...${NC}"
cat > .dev.vars << EOF
CLIENT_ID=${CLIENT_ID}
CLIENT_SECRET=${CLIENT_SECRET}
REDIRECT_URL=${REDIRECT_URL}
EOF

echo -e "${GREEN}Environment setup complete!${NC}"
echo "You can now run 'npm run dev' to start the application." 