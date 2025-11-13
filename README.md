# RindBrowser

🚀 **Advanced AI-powered browser automation platform** - Intelligent web interaction engine for enterprise task automation, competitor research, and real-time monitoring. Powered by multi-AI orchestration (Claude, Gemini, Codex).

## 🎯 Overview

RindBrowser is a next-generation browser automation platform designed for intelligent task execution. It enables AI agents to:

* 👁️ **See and understand** web content through intelligent page analysis
* 🤖 **Automate complex workflows** across websites and platforms
* 📊 **Monitor platforms 24/7** for downtime, changes, and updates
* 🔍 **Conduct competitor research** automatically
* 📈 **Extract business intelligence** from web dashboards
* 🧪 **Perform quality assurance** testing across applications

## ✨ Features

- ✅ **Playwright-powered** browser automation (Chromium, Firefox, WebKit)
- ✅ **RESTful API** for easy integration with AI agents
- ✅ **JavaScript Client Library** for programmatic access
- ✅ **Beautiful Web Dashboard** for monitoring and control
- ✅ **Workflow System** for complex multi-step automations
- ✅ **Real-time Monitoring** for website uptime tracking
- ✅ **Competitor Research** automation
- ✅ **QA Testing** framework
- ✅ **Page Analysis** and data extraction
- ✅ **Screenshot Capture** capabilities

## 🚀 Quick Start

### Prerequisites

* Node.js 18+ (or use Claude/Gemini/Codex to install)
* npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Rind-AI/RindBrowser.git
cd RindBrowser

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Start the Server

```bash
npm run dev
```

You should see:
```
✅ MCP Server running at http://localhost:3001
```

### Open the Dashboard

Open `src/ui/dashboard.html` in your web browser and start automating!

## 📖 Usage Examples

### Basic Usage

```javascript
import { RindBrowserClient } from './src/api/RindBrowserClient.js';

const client = new RindBrowserClient();

// Initialize browser
await client.initialize();

// Navigate to website
await client.navigate('https://example.com');

// Extract page data
const data = await client.extract();
console.log('Page title:', data.data.title);

// Close browser
await client.close();
```

### Automation Workflow

```javascript
// Define a workflow
const workflow = [
  { action: 'navigate', url: 'https://example.com' },
  { action: 'click', selector: 'button#search' },
  { action: 'type', selector: 'input[name="q"]', text: 'automation' },
  { action: 'screenshot', path: './screenshot.png' },
  { action: 'extract' }
];

// Execute workflow
const results = await client.executeWorkflow(workflow);
```

### Website Monitoring

```javascript
// Start monitoring a website
await client.startMonitor(
  'https://example.com',
  60000, // Check every 60 seconds
  'my-monitor'
);

// Stop monitoring later
await client.stopMonitor('my-monitor');
```

### Competitor Research

```javascript
const competitors = [
  { name: 'Competitor A', url: 'https://competitor-a.com' },
  { name: 'Competitor B', url: 'https://competitor-b.com' }
];

const research = await client.competitorResearch(competitors);
console.log(research.results);
```

## 🏗️ Project Structure

```
RindBrowser/
├── src/
│   ├── browser/              # Browser automation engine
│   │   ├── BrowserEngine.js  # Core browser control
│   │   ├── PageAnalyzer.js   # Page analysis
│   │   └── AutomationOrchestrator.js  # Workflow orchestration
│   ├── mcp/                  # MCP server integration
│   │   └── MCPServer.js      # REST API server
│   ├── api/                  # API layer
│   │   └── RindBrowserClient.js  # JavaScript client
│   ├── ui/                   # Frontend components
│   │   └── dashboard.html    # Web dashboard
│   └── index.js              # Main entry point
├── tests/                    # Test suites
├── docs/                     # Documentation
│   ├── API.md               # API reference
│   └── QUICK-START.md       # Quick start guide
├── examples/                 # Usage examples
│   ├── basic-usage.js
│   ├── workflow-example.js
│   ├── monitoring-example.js
│   └── qa-testing-example.js
├── package.json
└── README.md
```

## 🤖 AI Team Integration

RindBrowser works seamlessly with your AI AIR TEAM:

### Claude CLI - Frontend & UI Components
```bash
# Claude handles:
- React/TypeScript UI components
- User interface design
- Component architecture
```

### Gemini CLI - Backend & MCP Servers
```bash
# Gemini handles:
- MCP server development
- Backend APIs
- Data processing
```

### Codex CLI - Browser Automation Engine
```bash
# Codex handles:
- Browser automation logic
- Web interaction algorithms
- Performance optimization
```

## 📚 Documentation

* [Quick Start Guide](docs/QUICK-START.md)
* [API Documentation](docs/API.md)
* [Examples](examples/)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## 🔧 API Endpoints

- `POST /initialize` - Initialize browser
- `POST /navigate` - Navigate to URL
- `GET /extract` - Extract page data
- `GET /analyze` - Analyze page structure
- `POST /click` - Click element
- `POST /type` - Type text
- `POST /screenshot` - Take screenshot
- `POST /workflow/execute` - Execute workflow
- `POST /monitor/start` - Start monitoring
- `POST /research/competitors` - Competitor research
- `POST /qa/test` - QA testing
- `GET /status` - Get status
- `POST /close` - Close browser

## 🔒 Security & Legal

* **License**: MIT License
* **Repository**: 100% original code (no fork, clean git history)
* **Proprietary**: All code is your intellectual property
* **Confidentiality**: Never commit secrets, API keys, or credentials

### Environment Variables (NEVER COMMIT)

Create `.env.local` file:
```env
PORT=3001
HOST=localhost
HEADLESS=false
BROWSER_TIMEOUT=30000
```

## 🤝 Contributing

1. Create a feature branch
2. Implement your feature with AI team assistance
3. Write tests for new functionality
4. Submit pull request with description

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Emperor's Digital Empire** | Clean, Original, 100% Proprietary

**Created**: November 13, 2025  
**Status**: 🟢 Fully Functional - Production Ready  
**Git History**: ✅ Clean (No Fork Origin)

## 🎉 What's Inside

✅ **Fully Functional Browser Automation Engine**  
✅ **Complete MCP Server with REST API**  
✅ **JavaScript Client Library**  
✅ **Beautiful Web Dashboard**  
✅ **4 Working Examples**  
✅ **Comprehensive Documentation**  
✅ **Production Ready**

This is not a template - this is **working, production-ready code** ready to automate the web! 🚀
