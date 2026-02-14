#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if name was provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Please provide your name${NC}"
    echo -e "${YELLOW}Usage: npm run create-branch <your-name>${NC}"
    echo -e "${YELLOW}Example: npm run create-branch ivan${NC}"
    exit 1
fi

STUDENT_NAME=$1
BRANCH_NAME="student/$STUDENT_NAME"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Creating Student Branch${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if branch already exists
if git show-ref --quiet refs/heads/"$BRANCH_NAME"; then
    echo -e "${YELLOW}⚠️  Branch '$BRANCH_NAME' already exists${NC}"
    echo -e "${YELLOW}Switching to existing branch...${NC}"
    git checkout "$BRANCH_NAME"
else
    echo -e "${BLUE}Creating new branch: $BRANCH_NAME${NC}"
    git checkout -b "$BRANCH_NAME"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Branch created successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to create branch${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Ready to Start!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}You are now on branch: ${YELLOW}$BRANCH_NAME${NC}"
echo ""
echo -e "${BLUE}Workflow:${NC}"
echo -e "  1. Read module README"
echo -e "  2. Study examples"
echo -e "  3. Complete exercises"
echo -e "  4. Run tests: ${YELLOW}npm test -- <module-name>${NC}"
echo -e "  5. Commit your work: ${YELLOW}git add . && git commit -m \"Completed <module>\"${NC}"
echo -e "  6. Check progress: ${YELLOW}npm run check-progress${NC}"
echo ""
echo -e "${BLUE}Good luck! 🎓${NC}"
