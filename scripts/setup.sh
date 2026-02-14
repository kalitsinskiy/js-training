#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  JS/TS Fullstack Training Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check Node.js version
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"

# Check npm version
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm version: $NPM_VERSION${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencies installed successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Check Git configuration
echo -e "${BLUE}Checking Git configuration...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    exit 1
fi

GIT_USER=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Git user not configured${NC}"
    echo -e "${YELLOW}Please configure Git with your name and email:${NC}"
    echo -e "${YELLOW}  git config --global user.name \"Your Name\"${NC}"
    echo -e "${YELLOW}  git config --global user.email \"your.email@example.com\"${NC}"
else
    echo -e "${GREEN}✓ Git user: $GIT_USER <$GIT_EMAIL>${NC}"
fi
echo ""

# Run a quick test to verify setup
echo -e "${BLUE}Running verification tests...${NC}"
npm test -- --testPathPattern=01-variables --silent 2>/dev/null || true
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Create your student branch:"
echo -e "     ${YELLOW}npm run create-branch <your-name>${NC}"
echo ""
echo -e "  2. Start with the first module:"
echo -e "     ${YELLOW}cd modules/01-javascript-basics/01-variables${NC}"
echo -e "     ${YELLOW}cat README.md${NC}"
echo ""
echo -e "  3. Run examples:"
echo -e "     ${YELLOW}node examples/let-const.js${NC}"
echo ""
echo -e "  4. Complete exercises and test:"
echo -e "     ${YELLOW}npm test -- 01-variables${NC}"
echo ""
echo -e "  5. Check your progress:"
echo -e "     ${YELLOW}npm run check-progress${NC}"
echo ""
echo -e "${BLUE}Happy learning! 🚀${NC}"
