# RindBrowser Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Clone & Install

```bash
git clone https://github.com/Rind-AI/RindBrowser.git
cd RindBrowser
npm install
```

### Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MCP Server running at http://localhost:3001
```

### Step 3: Open the Dashboard

Open `src/ui/dashboard.html` in your web browser.

### Step 4: Run Your First Automation

In the dashboard:
1. Click "Initialize Browser"
2. Enter a URL (e.g., https://example.com)
3. Click "Navigate"
4. Click "Extract Data"

🎉 You just automated your first browser task!

---

## 📖 Next Steps

### Run Example Scripts

```bash
# Basic usage
node examples/basic-usage.js

# Workflows
node examples/workflow-example.js

# Monitoring
node examples/monitoring-example.js

# QA Testing
node examples/qa-testing-example.js
```

### Use the JavaScript Client

```javascript
import { RindBrowserClient } from './src/api/RindBrowserClient.js';

const client = new RindBrowserClient();
await client.initialize();
await client.navigate('https://example.com');
const data = await client.extract();
console.log(data);
```

### Use with AI Agents

RindBrowser is designed to work with:
- Claude CLI
- Gemini CLI  
- Codex CLI
- GitHub Copilot

Simply provide them with the API endpoint: `http://localhost:3001`

---

## 🛠️ Common Use Cases

### 1. Website Monitoring
Monitor website uptime and changes automatically.

### 2. Competitor Research
Analyze competitor websites and extract data.

### 3. QA Testing
Automate quality assurance testing workflows.

### 4. Data Extraction
Extract structured data from web pages.

### 5. Task Automation
Automate repetitive browser tasks.

---

## 📚 Learn More

- [API Documentation](./API.md)
- [Architecture Guide](./ARCHITECTURE.md) (to be created)
- [Contributing Guide](../README.md)

---

## 🆘 Troubleshooting

**Browser won't start?**
- Make sure Playwright is installed: `npx playwright install`

**Server won't start?**
- Check if port 3001 is available
- Try a different port: `PORT=3002 npm run dev`

**Connection refused?**
- Make sure server is running: `npm run dev`
- Check firewall settings

---

## 💡 Tips

1. Use `headless: false` during development to see the browser
2. Check the Activity Log in dashboard for debugging
3. Use workflows for complex multi-step tasks
4. Monitor websites at reasonable intervals (60+ seconds)

---

**Built for Emperor's Digital Empire**

