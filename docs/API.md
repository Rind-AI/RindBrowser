# RindBrowser API Documentation

## Overview

RindBrowser provides a RESTful API and JavaScript client for AI-powered browser automation.

## Server Endpoints

### Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T...",
  "orchestrator": "initialized"
}
```

---

### Initialize Browser
```
POST /initialize
```

Initialize browser instance.

**Request Body:**
```json
{
  "options": {
    "browserType": "chromium",
    "headless": false,
    "timeout": 30000
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Browser initialized",
  "status": { ... }
}
```

---

### Navigate
```
POST /navigate
```

Navigate to URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

---

### Extract Page Data
```
GET /extract
```

Extract page content and metadata.

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Page Title",
    "url": "https://...",
    "text": "Page content...",
    "links": [...],
    "images": [...]
  }
}
```

---

### Analyze Page Structure
```
GET /analyze
```

Analyze page structure and elements.

**Response:**
```json
{
  "success": true,
  "analysis": {
    "structure": {
      "headings": { "h1": 1, "h2": 3 },
      "content": { "paragraphs": 10 },
      "interactive": { "links": 25 }
    }
  }
}
```

---

### Click Element
```
POST /click
```

Click page element.

**Request Body:**
```json
{
  "selector": "button#submit"
}
```

---

### Type Text
```
POST /type
```

Type text into input field.

**Request Body:**
```json
{
  "selector": "input[name='email']",
  "text": "user@example.com"
}
```

---

### Take Screenshot
```
POST /screenshot
```

Capture page screenshot.

**Request Body:**
```json
{
  "fullPage": false
}
```

Returns PNG image data.

---

### Execute Workflow
```
POST /workflow/execute
```

Execute automation workflow.

**Request Body:**
```json
{
  "steps": [
    { "action": "navigate", "url": "https://example.com" },
    { "action": "click", "selector": "button" },
    { "action": "extract" }
  ],
  "params": {}
}
```

---

### Start Monitoring
```
POST /monitor/start
```

Start website monitoring.

**Request Body:**
```json
{
  "url": "https://example.com",
  "interval": 60000,
  "monitorId": "monitor-1"
}
```

---

### Competitor Research
```
POST /research/competitors
```

Analyze competitor websites.

**Request Body:**
```json
{
  "competitors": [
    { "name": "Competitor A", "url": "https://..." }
  ]
}
```

---

### QA Testing
```
POST /qa/test
```

Run quality assurance tests.

**Request Body:**
```json
{
  "testSuite": {
    "name": "Test Suite",
    "tests": [
      {
        "name": "Test 1",
        "url": "https://...",
        "checkElements": ["h1", "p"]
      }
    ]
  }
}
```

---

## JavaScript Client

### Installation

```javascript
import { RindBrowserClient } from './src/api/RindBrowserClient.js';
```

### Usage

```javascript
const client = new RindBrowserClient({
  baseURL: 'http://localhost:3001'
});

// Initialize
await client.initialize();

// Navigate
await client.navigate('https://example.com');

// Extract data
const data = await client.extract();

// Close
await client.close();
```

### Available Methods

- `health()` - Check server health
- `initialize(options)` - Initialize browser
- `navigate(url)` - Navigate to URL
- `extract()` - Extract page data
- `analyze()` - Analyze page structure
- `click(selector)` - Click element
- `type(selector, text)` - Type text
- `screenshot(fullPage)` - Take screenshot
- `executeWorkflow(steps, params)` - Execute workflow
- `registerWorkflow(name, steps)` - Register workflow
- `startMonitor(url, interval, id)` - Start monitoring
- `stopMonitor(id)` - Stop monitoring
- `competitorResearch(competitors)` - Analyze competitors
- `qaTest(testSuite)` - Run QA tests
- `status()` - Get status
- `close()` - Close browser

---

## Workflow Actions

Available actions for workflows:

- `navigate` - Navigate to URL
- `click` - Click element
- `type` - Type text
- `wait` - Wait for element
- `screenshot` - Take screenshot
- `extract` - Extract page data
- `analyze` - Analyze structure
- `executeScript` - Run JavaScript

---

## Error Handling

All endpoints return errors in format:

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP status codes:
- `200` - Success
- `500` - Server error

