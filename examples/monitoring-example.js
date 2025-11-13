/**
 * Monitoring Example - RindBrowser
 * Demonstrates website monitoring capabilities
 */

import { RindBrowserClient } from '../src/api/RindBrowserClient.js';

async function monitoringExample() {
  console.log('👁️  RindBrowser Monitoring Example\n');

  const client = new RindBrowserClient();

  try {
    // Initialize
    await client.initialize({ headless: true });
    console.log('✅ Browser initialized\n');

    // Start monitoring example.com
    console.log('📊 Starting website monitoring...');
    console.log('   Monitoring: https://example.com');
    console.log('   Check interval: 10 seconds');
    console.log('   Press Ctrl+C to stop\n');

    const monitor = await client.startMonitor(
      'https://example.com',
      10000, // Check every 10 seconds
      'example-monitor'
    );

    console.log('✅ Monitor started:', monitor.monitorId);
    console.log('   (Running in background on server)');

    // Let it run for 30 seconds
    console.log('\n⏳ Running for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Stop monitoring
    console.log('\n⏹️  Stopping monitor...');
    await client.stopMonitor('example-monitor');
    console.log('✅ Monitor stopped');

    // Cleanup
    await client.close();
    console.log('\n✅ Monitoring example completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

monitoringExample();

