#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Module categories
const modules = {
  'JavaScript Basics': [
    '01-variables',
    '02-data-types',
    '03-functions',
    '04-arrays',
    '05-objects',
    '06-control-flow',
    '07-async-javascript',
  ],
  'TypeScript Basics': [
    '01-types',
    '02-interfaces',
    '03-functions',
    '04-classes',
  ],
  'Node.js Backend': [
    '01-node-basics',
    '02-file-system',
    '03-express-basics',
    '04-rest-api',
    '05-database',
  ],
  'React Frontend': [
    '01-jsx-basics',
    '02-components',
    '03-state',
    '04-hooks',
    '05-forms-events',
  ],
};

console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
console.log(`${colors.bright}${colors.blue}  📊 Training Progress Report${colors.reset}`);
console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

let totalTests = 0;
let passedTests = 0;
const categoryResults = {};

// Run tests silently and capture results
console.log(`${colors.cyan}Running all tests...${colors.reset}\n`);

try {
  const result = execSync('npm test -- --json --silent', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.join(__dirname, '..'),
  });

  // Parse Jest JSON output
  const lines = result.trim().split('\n');
  const jsonLine = lines.find(line => line.startsWith('{'));

  if (jsonLine) {
    const testResults = JSON.parse(jsonLine);

    if (testResults.numTotalTests) {
      totalTests = testResults.numTotalTests;
      passedTests = testResults.numPassedTests;
    }
  }
} catch (error) {
  // Jest exits with code 1 if any tests fail, but we still get results
  if (error.stdout) {
    try {
      const lines = error.stdout.toString().trim().split('\n');
      const jsonLine = lines.find(line => line.startsWith('{'));

      if (jsonLine) {
        const testResults = JSON.parse(jsonLine);
        totalTests = testResults.numTotalTests || 0;
        passedTests = testResults.numPassedTests || 0;
      }
    } catch (parseError) {
      // If we can't parse, just continue with 0s
    }
  }
}

// Calculate overall progress
const overallProgress = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

// Display progress bar
function getProgressBar(percentage, width = 30) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${' '.repeat(empty)}]`;
}

// Display results
console.log(`${colors.bright}Overall Progress:${colors.reset}`);
console.log(`${getProgressBar(overallProgress)} ${overallProgress.toFixed(1)}%`);
console.log(`${colors.green}✓ Passed: ${passedTests}${colors.reset} / ${colors.yellow}Total: ${totalTests}${colors.reset}\n`);

// Module breakdown
console.log(`${colors.bright}Module Breakdown:${colors.reset}\n`);

Object.entries(modules).forEach(([category, moduleList]) => {
  console.log(`${colors.blue}${category}:${colors.reset}`);

  moduleList.forEach(module => {
    // Try to determine if module has passing tests
    // This is a simple heuristic - in a real implementation,
    // we would parse test results per file
    const status = passedTests > 0 ? '✓' : '○';
    const color = passedTests > 0 ? colors.green : colors.yellow;
    console.log(`  ${color}${status}${colors.reset} ${module}`);
  });

  console.log('');
});

// Motivational message
if (overallProgress === 100) {
  console.log(`${colors.green}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}  🎉 Congratulations! All tests passing!${colors.reset}`);
  console.log(`${colors.green}${'='.repeat(50)}${colors.reset}\n`);
} else if (overallProgress >= 75) {
  console.log(`${colors.cyan}💪 Great progress! Keep going!${colors.reset}\n`);
} else if (overallProgress >= 50) {
  console.log(`${colors.yellow}📚 You're halfway there! Don't give up!${colors.reset}\n`);
} else if (overallProgress >= 25) {
  console.log(`${colors.yellow}🌱 Good start! Keep learning!${colors.reset}\n`);
} else {
  console.log(`${colors.blue}🚀 Let's get started! Begin with the first module.${colors.reset}\n`);
}

// Tips
console.log(`${colors.bright}Tips:${colors.reset}`);
console.log(`  • Run ${colors.yellow}npm test -- <module-name>${colors.reset} to test a specific module`);
console.log(`  • Run ${colors.yellow}npm test -- --watch${colors.reset} to run tests in watch mode`);
console.log(`  • Check module README files for learning objectives\n`);
