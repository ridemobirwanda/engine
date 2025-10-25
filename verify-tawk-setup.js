#!/usr/bin/env node

/**
 * Tawk.to Setup Verification Script
 * Run this script to verify your Tawk.to integration is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Tawk.to Setup...\n');

const checks = {
  passed: [],
  warnings: [],
  failed: []
};

// Check 1: index.html has CSP headers
console.log('1️⃣  Checking index.html for CSP headers...');
try {
  const indexPath = path.join(__dirname, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('Content-Security-Policy')) {
    if (indexContent.includes('ws:') && indexContent.includes('wss:')) {
      checks.passed.push('✅ CSP headers found with WebSocket support');
    } else {
      checks.warnings.push('⚠️  CSP found but missing ws:/wss: for WebSockets');
    }
  } else {
    checks.failed.push('❌ No CSP headers found in index.html');
  }
  
  if (indexContent.includes('embed.tawk.to')) {
    checks.passed.push('✅ Tawk.to preconnect links found');
  } else {
    checks.warnings.push('⚠️  No Tawk.to preconnect links (optional)');
  }
} catch (error) {
  checks.failed.push('❌ Could not read index.html: ' + error.message);
}

// Check 2: TawkChat component exists and has correct IDs
console.log('2️⃣  Checking TawkChat component...');
try {
  const tawkChatPath = path.join(__dirname, 'src', 'components', 'TawkChat.tsx');
  const tawkChatContent = fs.readFileSync(tawkChatPath, 'utf8');
  
  if (tawkChatContent.includes('68d3e2e9a5528e1923b79293')) {
    checks.passed.push('✅ Property ID configured in TawkChat');
  } else {
    checks.failed.push('❌ Property ID not found in TawkChat');
  }
  
  if (tawkChatContent.includes('1j5tqsot9')) {
    checks.passed.push('✅ Widget ID configured in TawkChat');
  } else {
    checks.failed.push('❌ Widget ID not found in TawkChat');
  }
  
  if (tawkChatContent.includes('window.Tawk_API')) {
    checks.passed.push('✅ Tawk API integration found');
  } else {
    checks.failed.push('❌ Tawk API integration missing');
  }
} catch (error) {
  checks.failed.push('❌ Could not read TawkChat component: ' + error.message);
}

// Check 3: No duplicate loading in main.tsx
console.log('3️⃣  Checking for duplicate Tawk.to loading...');
try {
  const mainPath = path.join(__dirname, 'src', 'main.tsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  
  if (mainContent.includes('embed.tawk.to') && mainContent.includes('createElement')) {
    checks.failed.push('❌ Duplicate Tawk.to loading detected in main.tsx');
  } else {
    checks.passed.push('✅ No duplicate loading in main.tsx');
  }
} catch (error) {
  checks.warnings.push('⚠️  Could not read main.tsx: ' + error.message);
}

// Check 4: Service worker properly configured
console.log('4️⃣  Checking service worker configuration...');
try {
  const swPath = path.join(__dirname, 'public', 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  if (swContent.includes('embed.tawk.to') && swContent.includes('va.tawk.to')) {
    checks.passed.push('✅ Service worker allows Tawk.to domains');
  } else {
    checks.failed.push('❌ Service worker missing Tawk.to domains');
  }
  
  if (swContent.includes('tawk.link')) {
    checks.passed.push('✅ Service worker includes tawk.link domain');
  } else {
    checks.warnings.push('⚠️  Service worker missing tawk.link (optional)');
  }
} catch (error) {
  checks.warnings.push('⚠️  Could not read sw.js: ' + error.message);
}

// Check 5: App.tsx imports TawkChat
console.log('5️⃣  Checking App.tsx integration...');
try {
  const appPath = path.join(__dirname, 'src', 'App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (appContent.includes('TawkChat')) {
    checks.passed.push('✅ TawkChat imported in App.tsx');
  } else {
    checks.failed.push('❌ TawkChat not imported in App.tsx');
  }
  
  if (appContent.includes('<TawkChat')) {
    checks.passed.push('✅ TawkChat component rendered in App');
  } else {
    checks.failed.push('❌ TawkChat component not rendered');
  }
} catch (error) {
  checks.failed.push('❌ Could not read App.tsx: ' + error.message);
}

// Check 6: Test page exists
console.log('6️⃣  Checking test page...');
try {
  const testPath = path.join(__dirname, 'public', 'test-tawk.html');
  if (fs.existsSync(testPath)) {
    checks.passed.push('✅ Test page available at /test-tawk.html');
  } else {
    checks.warnings.push('⚠️  Test page not found (optional)');
  }
} catch (error) {
  checks.warnings.push('⚠️  Could not check test page: ' + error.message);
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS');
console.log('='.repeat(60) + '\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED CHECKS (' + checks.passed.length + '):\n');
  checks.passed.forEach(check => console.log('  ' + check));
  console.log('');
}

if (checks.warnings.length > 0) {
  console.log('⚠️  WARNINGS (' + checks.warnings.length + '):\n');
  checks.warnings.forEach(check => console.log('  ' + check));
  console.log('');
}

if (checks.failed.length > 0) {
  console.log('❌ FAILED CHECKS (' + checks.failed.length + '):\n');
  checks.failed.forEach(check => console.log('  ' + check));
  console.log('');
}

console.log('='.repeat(60));

// Summary
const total = checks.passed.length + checks.warnings.length + checks.failed.length;
const score = Math.round((checks.passed.length / total) * 100);

console.log('\n📈 SCORE: ' + score + '% (' + checks.passed.length + '/' + total + ' checks passed)\n');

if (checks.failed.length === 0) {
  console.log('🎉 All critical checks passed! Your Tawk.to integration is ready.\n');
  console.log('📋 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Visit: http://localhost:21201');
  console.log('   3. Test: http://localhost:21201/test-tawk.html');
  console.log('   4. Look for chat widget in bottom-right corner\n');
} else {
  console.log('⚠️  Some checks failed. Please review the failed checks above.\n');
  console.log('📖 For help, see TAWK_FIX_COMPLETE.md\n');
}

process.exit(checks.failed.length > 0 ? 1 : 0);


