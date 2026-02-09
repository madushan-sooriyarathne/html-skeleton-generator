#!/bin/bash

# Script to create GitHub repository and push code
# Usage: ./push-to-github.sh [GITHUB_TOKEN]

set -e

REPO_NAME="html-skeleton-generator"
GITHUB_USER="madushan-sooriyarathne"
REPO_DESCRIPTION="Generate loading skeleton components from HTML instantly"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GitHub Repository Setup${NC}"
echo "=================================="

# Check if token is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: GitHub token not provided${NC}"
    echo ""
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "To create a token:"
    echo "1. Go to https://github.com/settings/tokens/new"
    echo "2. Give it a name like 'html-skeleton-generator-deploy'"
    echo "3. Select scopes: 'repo' (full control of private repositories)"
    echo "4. Click 'Generate token'"
    echo "5. Copy the token and run: ./push-to-github.sh YOUR_TOKEN"
    exit 1
fi

GITHUB_TOKEN=$1

echo -e "${BLUE}📝 Creating GitHub repository...${NC}"

# Create repository using GitHub API
RESPONSE=$(curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{
        \"name\": \"$REPO_NAME\",
        \"description\": \"$REPO_DESCRIPTION\",
        \"private\": false,
        \"auto_init\": false
    }")

# Check if repository was created successfully
if echo "$RESPONSE" | grep -q '"html_url"'; then
    echo -e "${GREEN}✅ Repository created successfully!${NC}"
    REPO_URL=$(echo "$RESPONSE" | grep -o '"html_url": "[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}   $REPO_URL${NC}"
else
    if echo "$RESPONSE" | grep -q "name already exists"; then
        echo -e "${BLUE}ℹ️  Repository already exists, continuing...${NC}"
        REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME"
    else
        echo -e "${RED}❌ Error creating repository:${NC}"
        echo "$RESPONSE" | grep -o '"message": "[^"]*' | cut -d'"' -f4
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}📤 Pushing code to GitHub...${NC}"

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "Updating existing remote..."
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
else
    echo "Adding new remote..."
    git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
fi

# Push to GitHub
if git push -u origin main; then
    echo -e "${GREEN}✅ Code pushed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to push code${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
echo "=================================="
echo ""
echo "Your repository is live at:"
echo -e "${BLUE}$REPO_URL${NC}"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Add topics: nextjs, typescript, tailwindcss, shadcn-ui"
echo "3. Deploy to Vercel: https://vercel.com/new"
echo ""
echo "To deploy to Vercel:"
echo "  vercel --prod"
echo ""
