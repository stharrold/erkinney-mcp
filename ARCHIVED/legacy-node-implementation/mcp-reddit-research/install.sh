#!/bin/bash

# Reddit Research MCP Bundle - Installation Script
# Automates installation and configuration

set -e  # Exit on error

echo "================================================"
echo "Reddit Research MCP Bundle - Installer"
echo "Version 1.0.0"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Error: Node.js not found${NC}"
    echo "Please install Node.js 18 or higher from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js found: ${NODE_VERSION}${NC}"

# Check Node.js version (should be 18+)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${YELLOW}⚠ Warning: Node.js version 18+ recommended (found v${NODE_MAJOR})${NC}"
fi

echo ""

# Install dependencies
echo "Installing dependencies..."
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Error: Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ IMPORTANT: Edit .env file and add your Reddit API credentials${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""

# Create exports directory
echo "Creating exports directory..."
mkdir -p exports
echo -e "${GREEN}✓ Created exports/ directory${NC}"

echo ""

# Test authentication (optional)
echo "Testing Reddit authentication..."
echo "(This requires valid credentials in .env file)"
echo ""

if node -e "import('./src/auth.js').then(m => m.createRedditClient()).then(() => { console.log('\x1b[32m✓ Authentication successful!\x1b[0m'); process.exit(0); }).catch(e => { console.error('\x1b[31m✗ Authentication failed:\x1b[0m', e.message); console.log('\x1b[33mℹ Make sure to add your Reddit credentials to .env\x1b[0m'); process.exit(1); })"; then
    echo ""
else
    echo ""
fi

echo "================================================"
echo "Installation Summary"
echo "================================================"
echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Reddit API credentials:"
echo "   Edit .env file and add:"
echo "   - REDDIT_CLIENT_ID"
echo "   - REDDIT_CLIENT_SECRET"
echo "   - REDDIT_USERNAME"
echo "   - REDDIT_PASSWORD"
echo ""
echo "   Get credentials from: https://www.reddit.com/prefs/apps"
echo ""
echo "2. Add MCP server to Claude Desktop:"
echo "   See: docs/CLAUDE_SETUP.md"
echo ""
echo "3. Restart Claude Desktop"
echo ""
echo "4. Test by asking Claude:"
echo "   'Get information about the pregnant subreddit'"
echo ""
echo "================================================"
echo "Documentation:"
echo "  - README.md - Main documentation"
echo "  - PRIVACY.md - Privacy and ethics"
echo "  - docs/CLAUDE_SETUP.md - Claude Desktop setup"
echo "  - examples/ - Usage examples"
echo ""
echo "Support:"
echo "  - Research: emkinney@iu.edu"
echo "  - Technical: samuel.harrold@gmail.com"
echo "================================================"
