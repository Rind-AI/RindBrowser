/**
 * QA Testing Example - RindBrowser
 * Demonstrates automated quality assurance testing
 */

import { RindBrowserClient } from '../src/api/RindBrowserClient.js';

async function qaTestingExample() {
  console.log('🧪 RindBrowser QA Testing Example\n');

  const client = new RindBrowserClient();

  try {
    // Initialize
    await client.initialize({ headless: false });
    console.log('✅ Browser initialized\n');

    // Define test suite
    const testSuite = {
      name: 'Example.com QA Test Suite',
      tests: [
        {
          name: 'Homepage loads correctly',
          url: 'https://example.com',
          checkElements: ['h1', 'p', 'a'],
          checkText: ['Example Domain'],
          checkPerformance: true
        },
        {
          name: 'Has proper navigation',
          url: 'https://example.com',
          checkElements: ['body', 'html', 'head']
        }
      ]
    };

    console.log('🧪 Running QA test suite:', testSuite.name);
    console.log('   Tests to run:', testSuite.tests.length);
    console.log('');

    // Execute tests
    const results = await client.qaTest(testSuite);

    // Display results
    console.log('📊 Test Results:');
    console.log('   Overall:', results.results.passed ? '✅ PASSED' : '❌ FAILED');
    console.log('');

    results.results.tests.forEach((test, index) => {
      console.log(`   Test ${index + 1}: ${test.name}`);
      console.log(`   Status: ${test.passed ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (test.checks) {
        test.checks.forEach(check => {
          if (check.type === 'elements') {
            console.log(`     - Elements: ${JSON.stringify(check.results)}`);
          } else if (check.type === 'performance') {
            console.log(`     - Load time: ${check.metrics.loadTime}ms`);
          }
        });
      }
      console.log('');
    });

    // Cleanup
    await client.close();
    console.log('✅ QA testing example completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

qaTestingExample();

