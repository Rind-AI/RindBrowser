/**
 * Workflow Example - RindBrowser
 * Demonstrates automation workflows
 */

import { RindBrowserClient } from '../src/api/RindBrowserClient.js';

async function workflowExample() {
  console.log('🤖 RindBrowser Workflow Example\n');

  const client = new RindBrowserClient();

  try {
    // Initialize
    await client.initialize({ headless: false });
    console.log('✅ Browser initialized\n');

    // Example 1: Simple navigation workflow
    console.log('📋 Workflow 1: Multi-page Navigation');
    const navigationWorkflow = [
      { action: 'navigate', url: 'https://example.com' },
      { action: 'extract' },
      { action: 'navigate', url: 'https://example.org' },
      { action: 'extract' }
    ];

    const navResults = await client.executeWorkflow(navigationWorkflow);
    console.log('✅ Visited pages:', navResults.results.length);

    // Example 2: Page analysis workflow
    console.log('\n📋 Workflow 2: Complete Page Analysis');
    const analysisWorkflow = [
      { action: 'navigate', url: 'https://github.com' },
      { action: 'wait', selector: 'body', timeout: 3000 },
      { action: 'extract' },
      { action: 'analyze' },
      { action: 'screenshot', path: './examples/github-screenshot.png', fullPage: false }
    ];

    const analysisResults = await client.executeWorkflow(analysisWorkflow);
    console.log('✅ Analysis complete, screenshot saved');

    // Example 3: Competitor research
    console.log('\n📋 Workflow 3: Competitor Research');
    const competitors = [
      { name: 'Example.com', url: 'https://example.com' },
      { name: 'Example.org', url: 'https://example.org' }
    ];

    const research = await client.competitorResearch(competitors);
    console.log('✅ Analyzed competitors:', research.results.length);
    research.results.forEach(r => {
      console.log(`   - ${r.competitor}: ${r.pageData?.title || 'N/A'}`);
    });

    // Cleanup
    await client.close();
    console.log('\n✅ Workflow example completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

workflowExample();

