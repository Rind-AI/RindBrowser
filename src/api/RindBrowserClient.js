/**
 * RindBrowserClient.js - Client library for RindBrowser API
 * Simple interface for AI agents to control browser automation
 */

import axios from 'axios';

export class RindBrowserClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:3001';
    this.timeout = options.timeout || 30000;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Check server health
   */
  async health() {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Initialize browser
   */
  async initialize(options = {}) {
    const response = await this.client.post('/initialize', { options });
    return response.data;
  }

  /**
   * Navigate to URL
   */
  async navigate(url) {
    const response = await this.client.post('/navigate', { url });
    return response.data;
  }

  /**
   * Extract page data
   */
  async extract() {
    const response = await this.client.get('/extract');
    return response.data;
  }

  /**
   * Analyze page structure
   */
  async analyze() {
    const response = await this.client.get('/analyze');
    return response.data;
  }

  /**
   * Click element
   */
  async click(selector) {
    const response = await this.client.post('/click', { selector });
    return response.data;
  }

  /**
   * Type text into element
   */
  async type(selector, text) {
    const response = await this.client.post('/type', { selector, text });
    return response.data;
  }

  /**
   * Take screenshot
   */
  async screenshot(fullPage = false) {
    const response = await this.client.post('/screenshot', 
      { fullPage },
      { responseType: 'arraybuffer' }
    );
    return response.data;
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(workflowNameOrSteps, params = {}) {
    if (typeof workflowNameOrSteps === 'string') {
      // Execute registered workflow by name
      const response = await this.client.post('/workflow/execute', {
        workflowName: workflowNameOrSteps,
        params
      });
      return response.data;
    } else {
      // Execute inline workflow steps
      const response = await this.client.post('/workflow/execute', {
        steps: workflowNameOrSteps,
        params
      });
      return response.data;
    }
  }

  /**
   * Register workflow
   */
  async registerWorkflow(name, steps) {
    const response = await this.client.post('/workflow/register', {
      name,
      steps
    });
    return response.data;
  }

  /**
   * Start monitoring website
   */
  async startMonitor(url, interval = 60000, monitorId = null) {
    const id = monitorId || `monitor-${Date.now()}`;
    const response = await this.client.post('/monitor/start', {
      url,
      interval,
      monitorId: id
    });
    return { ...response.data, monitorId: id };
  }

  /**
   * Stop monitoring
   */
  async stopMonitor(monitorId) {
    const response = await this.client.post('/monitor/stop', { monitorId });
    return response.data;
  }

  /**
   * Competitor research
   */
  async competitorResearch(competitors) {
    const response = await this.client.post('/research/competitors', {
      competitors
    });
    return response.data;
  }

  /**
   * QA testing
   */
  async qaTest(testSuite) {
    const response = await this.client.post('/qa/test', { testSuite });
    return response.data;
  }

  /**
   * Get status
   */
  async status() {
    const response = await this.client.get('/status');
    return response.data;
  }

  /**
   * Close browser
   */
  async close() {
    const response = await this.client.post('/close');
    return response.data;
  }

  /**
   * Helper: Complete workflow for page analysis
   */
  async analyzePage(url) {
    await this.navigate(url);
    const [extract, analyze] = await Promise.all([
      this.extract(),
      this.analyze()
    ]);
    
    return {
      url,
      timestamp: new Date().toISOString(),
      ...extract.data,
      ...analyze.analysis
    };
  }

  /**
   * Helper: Login workflow
   */
  async login(url, usernameSelector, username, passwordSelector, password, submitSelector) {
    const steps = [
      { action: 'navigate', url },
      { action: 'type', selector: usernameSelector, text: username },
      { action: 'type', selector: passwordSelector, text: password },
      { action: 'click', selector: submitSelector },
      { action: 'wait', selector: 'body', timeout: 5000 }
    ];

    return await this.executeWorkflow(steps);
  }

  /**
   * Helper: Form fill workflow
   */
  async fillForm(formData) {
    const steps = formData.map(field => ({
      action: 'type',
      selector: field.selector,
      text: field.value
    }));

    return await this.executeWorkflow(steps);
  }
}

export default RindBrowserClient;

