/**
 * Basic Usage Example - RindBrowser
 * Shows basic browser automation operations
 */

import { RindBrowserClient } from '../src/api/RindBrowserClient.js';

async function basicExample() {
  console.log('🚀 RindBrowser Basic Usage Example\n');

  // Create client
  const client = new RindBrowserClient({
    baseURL: 'http://localhost:3001'
  });

  try {
    // 1. Check server health
    console.log('1. Checking server health...');
    const health = await client.health();
    console.log('   ✅ Server is', health.status);

    // 2. Initialize browser
    console.log('\n2. Initializing browser...');
    await client.initialize({ headless: false });
    console.log('   ✅ Browser initialized');

    // 3. Navigate to website
    console.log('\n3. Navigating to example.com...');
    await client.navigate('https://example.com');
    console.log('   ✅ Navigation complete');

    // 4. Extract page data
    console.log('\n4. Extracting page data...');
    const data = await client.extract();
    console.log('   ✅ Title:', data.data.title);
    console.log('   ✅ Links found:', data.data.links.length);

    // 5. Analyze page structure
    console.log('\n5. Analyzing page structure...');
    const analysis = await client.analyze();
    console.log('   ✅ Headings:', JSON.stringify(analysis.analysis.structure.headings));
    console.log('   ✅ Interactive elements:', JSON.stringify(analysis.analysis.structure.interactive));

    // 6. Close browser
    console.log('\n6. Closing browser...');
    await client.close();
    console.log('   ✅ Browser closed');

    console.log('\n✅ Example completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure RindBrowser server is running: npm run dev');
  }
}

// Run example
basicExample();

