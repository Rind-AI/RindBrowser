/**
 * MCPServer.js - Model Context Protocol server
 * Enables AI agents (Claude, Gemini, etc.) to control browser automation
 */

import express from 'express';
import cors from 'cors';
import { AutomationOrchestrator } from '../browser/AutomationOrchestrator.js';

export class MCPServer {
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.host = options.host || 'localhost';
    this.app = express();
    this.orchestrator = null;
    this.activeMonitors = new Map();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`📨 ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        orchestrator: this.orchestrator ? 'initialized' : 'not initialized'
      });
    });

    // Initialize browser
    this.app.post('/initialize', async (req, res) => {
      try {
        if (this.orchestrator) {
          await this.orchestrator.close();
        }
        
        this.orchestrator = new AutomationOrchestrator(req.body.options || {});
        await this.orchestrator.initialize();
        
        res.json({
          success: true,
          message: 'Browser initialized',
          status: this.orchestrator.getStatus()
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Navigate to URL
    this.app.post('/navigate', async (req, res) => {
      try {
        this.ensureInitialized();
        await this.orchestrator.engine.navigate(req.body.url);
        
        res.json({
          success: true,
          message: `Navigated to ${req.body.url}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Extract page data
    this.app.get('/extract', async (req, res) => {
      try {
        this.ensureInitialized();
        const data = await this.orchestrator.engine.extractPageData();
        
        res.json({
          success: true,
          data
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Analyze page structure
    this.app.get('/analyze', async (req, res) => {
      try {
        this.ensureInitialized();
        const analysis = await this.orchestrator.analyzer.analyzeStructure();
        
        res.json({
          success: true,
          analysis
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Click element
    this.app.post('/click', async (req, res) => {
      try {
        this.ensureInitialized();
        await this.orchestrator.engine.click(req.body.selector);
        
        res.json({
          success: true,
          message: `Clicked ${req.body.selector}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Type text
    this.app.post('/type', async (req, res) => {
      try {
        this.ensureInitialized();
        await this.orchestrator.engine.type(req.body.selector, req.body.text);
        
        res.json({
          success: true,
          message: `Typed into ${req.body.selector}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Take screenshot
    this.app.post('/screenshot', async (req, res) => {
      try {
        this.ensureInitialized();
        const screenshot = await this.orchestrator.engine.screenshot({
          type: 'png',
          fullPage: req.body.fullPage || false
        });
        
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Execute workflow
    this.app.post('/workflow/execute', async (req, res) => {
      try {
        this.ensureInitialized();
        
        if (req.body.steps) {
          // Execute inline workflow
          const results = [];
          for (const step of req.body.steps) {
            const result = await this.orchestrator.executeStep(step, req.body.params || {});
            results.push({ step: step.action, result });
          }
          
          res.json({
            success: true,
            results
          });
        } else if (req.body.workflowName) {
          // Execute registered workflow
          const results = await this.orchestrator.executeWorkflow(
            req.body.workflowName,
            req.body.params || {}
          );
          
          res.json({
            success: true,
            results
          });
        } else {
          throw new Error('Either steps or workflowName required');
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Register workflow
    this.app.post('/workflow/register', async (req, res) => {
      try {
        this.ensureInitialized();
        this.orchestrator.registerWorkflow(req.body.name, req.body.steps);
        
        res.json({
          success: true,
          message: `Workflow registered: ${req.body.name}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Start monitoring
    this.app.post('/monitor/start', async (req, res) => {
      try {
        this.ensureInitialized();
        const { url, interval, monitorId } = req.body;
        
        if (this.activeMonitors.has(monitorId)) {
          throw new Error(`Monitor already exists: ${monitorId}`);
        }

        const monitor = await this.orchestrator.monitorWebsite(
          url,
          interval || 60000,
          (data) => {
            console.log(`📊 Monitor ${monitorId}:`, data.status);
            // In production, this would push to websocket or webhook
          }
        );

        this.activeMonitors.set(monitorId, monitor);
        
        res.json({
          success: true,
          message: `Monitor started: ${monitorId}`,
          url,
          interval
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Stop monitoring
    this.app.post('/monitor/stop', (req, res) => {
      try {
        const { monitorId } = req.body;
        const monitor = this.activeMonitors.get(monitorId);
        
        if (!monitor) {
          throw new Error(`Monitor not found: ${monitorId}`);
        }

        monitor.stop();
        this.activeMonitors.delete(monitorId);
        
        res.json({
          success: true,
          message: `Monitor stopped: ${monitorId}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Competitor research
    this.app.post('/research/competitors', async (req, res) => {
      try {
        this.ensureInitialized();
        const results = await this.orchestrator.competitorResearch(req.body.competitors);
        
        res.json({
          success: true,
          results
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // QA Testing
    this.app.post('/qa/test', async (req, res) => {
      try {
        this.ensureInitialized();
        const results = await this.orchestrator.qaTest(req.body.testSuite);
        
        res.json({
          success: true,
          results
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get status
    this.app.get('/status', (req, res) => {
      res.json({
        success: true,
        initialized: this.orchestrator !== null,
        status: this.orchestrator ? this.orchestrator.getStatus() : null,
        activeMonitors: Array.from(this.activeMonitors.keys())
      });
    });

    // Close browser
    this.app.post('/close', async (req, res) => {
      try {
        if (this.orchestrator) {
          await this.orchestrator.close();
          this.orchestrator = null;
        }
        
        res.json({
          success: true,
          message: 'Browser closed'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Ensure orchestrator is initialized
   */
  ensureInitialized() {
    if (!this.orchestrator) {
      throw new Error('Orchestrator not initialized. Call /initialize first.');
    }
  }

  /**
   * Start MCP server
   */
  async start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, this.host, () => {
        console.log(`✅ MCP Server running at http://${this.host}:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop MCP server
   */
  async stop() {
    if (this.orchestrator) {
      await this.orchestrator.close();
    }

    for (const monitor of this.activeMonitors.values()) {
      monitor.stop();
    }

    if (this.server) {
      this.server.close();
      console.log('✅ MCP Server stopped');
    }
  }
}

export default MCPServer;

