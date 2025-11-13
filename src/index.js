/**
 * RindBrowser - Main Entry Point
 * AI-Powered Browser Automation Platform
 */

import { MCPServer } from './mcp/MCPServer.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

async function main() {
  console.log('🚀 Starting RindBrowser...');
  console.log('━'.repeat(50));
  
  // Create and start MCP server
  const server = new MCPServer({ port: PORT, host: HOST });
  
  await server.start();
  
  console.log('━'.repeat(50));
  console.log('✅ RindBrowser is ready!');
  console.log(`📊 Dashboard: http://${HOST}:${PORT}/health`);
  console.log(`🌐 Frontend: Open src/ui/dashboard.html in browser`);
  console.log('━'.repeat(50));
  console.log('\n📖 Quick Commands:');
  console.log('  POST /initialize    - Initialize browser');
  console.log('  POST /navigate      - Navigate to URL');
  console.log('  GET  /extract       - Extract page data');
  console.log('  GET  /analyze       - Analyze page structure');
  console.log('  POST /workflow/execute - Execute automation workflow');
  console.log('\n⌨️  Press Ctrl+C to stop\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down RindBrowser...');
    await server.stop();
    process.exit(0);
  });
}

main().catch(error => {
  console.error('❌ Failed to start RindBrowser:', error);
  process.exit(1);
});

