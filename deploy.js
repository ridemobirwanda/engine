#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying dist folder to GitHub...');
console.log('=====================================\n');

// Configuration
const GITHUB_REPO = 'https://github.com/mobiride123/engine50.git';
const BRANCH = 'gh-pages'; // GitHub Pages branch
const DIST_FOLDER = 'dist';

try {
  // Step 1: Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');

  // Step 2: Check if dist folder exists
  if (!fs.existsSync(DIST_FOLDER)) {
    throw new Error('Dist folder not found. Build failed.');
  }

  // Step 3: Initialize git in dist folder (if not already)
  console.log('🔧 Setting up git in dist folder...');
  
  // Create a temporary directory for deployment
  const tempDir = 'temp-deploy';
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir);

  // Copy dist contents to temp directory
  execSync(`xcopy "${DIST_FOLDER}" "${tempDir}" /E /I /H /Y`, { stdio: 'inherit' });

  // Initialize git in temp directory
  process.chdir(tempDir);
  
  try {
    execSync('git init', { stdio: 'inherit' });
  } catch (error) {
    console.log('Git already initialized');
  }

  // Add remote origin
  try {
    execSync(`git remote add origin ${GITHUB_REPO}`, { stdio: 'inherit' });
  } catch (error) {
    execSync(`git remote set-url origin ${GITHUB_REPO}`, { stdio: 'inherit' });
  }

  // Step 4: Add all files
  console.log('📁 Adding files to git...');
  execSync('git add .', { stdio: 'inherit' });

  // Step 5: Commit changes
  console.log('💾 Committing changes...');
  const commitMessage = `Deploy: ${new Date().toISOString()}`;
  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  } catch (error) {
    console.log('No changes to commit');
  }

  // Step 6: Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  try {
    execSync(`git push -f origin main:${BRANCH}`, { stdio: 'inherit' });
  } catch (error) {
    // Try alternative branch names
    try {
      execSync(`git push -f origin HEAD:${BRANCH}`, { stdio: 'inherit' });
    } catch (error2) {
      execSync(`git push -f origin master:${BRANCH}`, { stdio: 'inherit' });
    }
  }

  // Step 7: Cleanup
  process.chdir('..');
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('\n🎉 Deployment successful!');
  console.log(`📱 Your site should be available at: https://mobiride123.github.io/engine50/`);
  console.log('\n✨ Deployment completed successfully!');

} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
