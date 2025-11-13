/**
 * AutomationOrchestrator.js - High-level automation workflows
 * Coordinates complex multi-step browser tasks
 */

import { BrowserEngine } from './BrowserEngine.js';
import { PageAnalyzer } from './PageAnalyzer.js';

export class AutomationOrchestrator {
  constructor(options = {}) {
    this.engine = new BrowserEngine(options);
    this.analyzer = null;
    this.workflows = new Map();
  }

  /**
   * Initialize orchestrator
   */
  async initialize() {
    await this.engine.launch();
    this.analyzer = new PageAnalyzer(this.engine.page);
    console.log('✅ Automation Orchestrator initialized');
  }

  /**
   * Register a workflow
   */
  registerWorkflow(name, steps) {
    this.workflows.set(name, steps);
    console.log(`✅ Workflow registered: ${name}`);
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(workflowName, params = {}) {
    const workflow = this.workflows.get(workflowName);
    
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    console.log(`🚀 Executing workflow: ${workflowName}`);
    const results = [];

    for (const step of workflow) {
      try {
        console.log(`  ➡️ Step: ${step.action}`);
        const result = await this.executeStep(step, params);
        results.push({ step: step.action, success: true, result });
      } catch (error) {
        console.error(`  ❌ Step failed: ${step.action}`, error.message);
        results.push({ step: step.action, success: false, error: error.message });
        
        if (step.required !== false) {
          throw new Error(`Required step failed: ${step.action}`);
        }
      }
    }

    console.log(`✅ Workflow completed: ${workflowName}`);
    return results;
  }

  /**
   * Execute single step
   */
  async executeStep(step, params) {
    const { action, ...options } = step;

    switch (action) {
      case 'navigate':
        return await this.engine.navigate(options.url || params.url);

      case 'click':
        return await this.engine.click(options.selector);

      case 'type':
        return await this.engine.type(options.selector, options.text || params.text);

      case 'wait':
        return await this.engine.waitFor(options.selector, options.timeout);

      case 'screenshot':
        return await this.engine.screenshot(options);

      case 'extract':
        return await this.engine.extractPageData();

      case 'analyze':
        return await this.analyzer.analyzeStructure();

      case 'executeScript':
        return await this.engine.executeScript(options.script);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Monitor website for changes
   */
  async monitorWebsite(url, interval = 60000, callback) {
    console.log(`👁️ Starting website monitoring: ${url}`);
    
    const monitor = async () => {
      try {
        await this.engine.navigate(url);
        const data = await this.engine.extractPageData();
        const metrics = await this.analyzer.getPerformanceMetrics();

        if (callback) {
          callback({
            timestamp: new Date().toISOString(),
            url,
            data,
            metrics,
            status: 'up'
          });
        }
      } catch (error) {
        if (callback) {
          callback({
            timestamp: new Date().toISOString(),
            url,
            status: 'down',
            error: error.message
          });
        }
      }
    };

    // Initial check
    await monitor();

    // Set up recurring monitoring
    const intervalId = setInterval(monitor, interval);

    return {
      stop: () => {
        clearInterval(intervalId);
        console.log(`⏹️ Stopped monitoring: ${url}`);
      }
    };
  }

  /**
   * Competitor research automation
   */
  async competitorResearch(competitors) {
    console.log(`🔍 Starting competitor research for ${competitors.length} competitors`);
    const results = [];

    for (const competitor of competitors) {
      try {
        await this.engine.navigate(competitor.url);
        
        const data = {
          competitor: competitor.name,
          url: competitor.url,
          timestamp: new Date().toISOString(),
          pageData: await this.engine.extractPageData(),
          structure: await this.analyzer.analyzeStructure(),
          links: await this.analyzer.extractLinks(),
          performance: await this.analyzer.getPerformanceMetrics()
        };

        results.push(data);
        console.log(`  ✅ Analyzed: ${competitor.name}`);
      } catch (error) {
        console.error(`  ❌ Failed to analyze: ${competitor.name}`, error.message);
        results.push({
          competitor: competitor.name,
          url: competitor.url,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Quality assurance testing
   */
  async qaTest(testSuite) {
    console.log(`🧪 Running QA test suite: ${testSuite.name}`);
    const results = {
      name: testSuite.name,
      timestamp: new Date().toISOString(),
      tests: []
    };

    for (const test of testSuite.tests) {
      try {
        await this.engine.navigate(test.url);
        
        const testResult = {
          name: test.name,
          url: test.url,
          checks: []
        };

        // Check elements exist
        if (test.checkElements) {
          const elementChecks = await this.analyzer.checkElements(test.checkElements);
          testResult.checks.push({ type: 'elements', results: elementChecks });
        }

        // Check text content
        if (test.checkText) {
          const pageData = await this.engine.extractPageData();
          for (const textCheck of test.checkText) {
            const found = pageData.text.includes(textCheck);
            testResult.checks.push({ type: 'text', text: textCheck, found });
          }
        }

        // Performance checks
        if (test.checkPerformance) {
          const metrics = await this.analyzer.getPerformanceMetrics();
          testResult.checks.push({ type: 'performance', metrics });
        }

        testResult.passed = testResult.checks.every(check => 
          check.results ? Object.values(check.results).every(v => v) : check.found !== false
        );

        results.tests.push(testResult);
        console.log(`  ${testResult.passed ? '✅' : '❌'} Test: ${test.name}`);
      } catch (error) {
        console.error(`  ❌ Test failed: ${test.name}`, error.message);
        results.tests.push({
          name: test.name,
          passed: false,
          error: error.message
        });
      }
    }

    results.passed = results.tests.every(t => t.passed);
    return results;
  }

  /**
   * Close orchestrator
   */
  async close() {
    await this.engine.close();
    console.log('✅ Automation Orchestrator closed');
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      engine: this.engine.getStatus(),
      workflows: Array.from(this.workflows.keys())
    };
  }
}

export default AutomationOrchestrator;

