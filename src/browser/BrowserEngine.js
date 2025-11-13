/**
 * BrowserEngine.js - Core browser automation engine
 * Powers intelligent web interaction for AI agents
 * Built with Playwright for cross-browser support
 */

import { chromium, firefox, webkit } from 'playwright';

export class BrowserEngine {
  constructor(options = {}) {
    this.browserType = options.browserType || 'chromium';
    this.headless = options.headless !== false;
    this.timeout = options.timeout || 30000;
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Initialize browser instance
   */
  async launch() {
    try {
      const browserTypes = { chromium, firefox, webkit };
      const selectedBrowser = browserTypes[this.browserType];

      this.browser = await selectedBrowser.launch({
        headless: this.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });

      this.page = await this.context.newPage();
      this.page.setDefaultTimeout(this.timeout);

      console.log(`✅ Browser launched: ${this.browserType}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to launch browser:', error.message);
      throw error;
    }
  }

  /**
   * Navigate to URL
   */
  async navigate(url) {
    if (!this.page) throw new Error('Browser not initialized. Call launch() first.');
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      console.log(`✅ Navigated to: ${url}`);
      return true;
    } catch (error) {
      console.error('❌ Navigation failed:', error.message);
      throw error;
    }
  }

  /**
   * Extract page content and structure
   */
  async extractPageData() {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      const data = await this.page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          text: document.body.innerText.substring(0, 5000), // First 5000 chars
          links: Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.innerText,
            href: a.href
          })).slice(0, 50), // First 50 links
          images: Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt
          })).slice(0, 20), // First 20 images
          forms: Array.from(document.querySelectorAll('form')).length,
          buttons: Array.from(document.querySelectorAll('button')).length
        };
      });

      console.log(`✅ Extracted data from: ${data.title}`);
      return data;
    } catch (error) {
      console.error('❌ Failed to extract page data:', error.message);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async screenshot(options = {}) {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      const screenshot = await this.page.screenshot({
        path: options.path,
        fullPage: options.fullPage || false,
        type: options.type || 'png'
      });

      console.log(`✅ Screenshot captured: ${options.path || 'buffer'}`);
      return screenshot;
    } catch (error) {
      console.error('❌ Screenshot failed:', error.message);
      throw error;
    }
  }

  /**
   * Click element
   */
  async click(selector) {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      await this.page.click(selector);
      console.log(`✅ Clicked: ${selector}`);
      return true;
    } catch (error) {
      console.error('❌ Click failed:', error.message);
      throw error;
    }
  }

  /**
   * Type text into input
   */
  async type(selector, text) {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      await this.page.fill(selector, text);
      console.log(`✅ Typed into: ${selector}`);
      return true;
    } catch (error) {
      console.error('❌ Type failed:', error.message);
      throw error;
    }
  }

  /**
   * Wait for selector
   */
  async waitFor(selector, timeout = this.timeout) {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      await this.page.waitForSelector(selector, { timeout });
      console.log(`✅ Element found: ${selector}`);
      return true;
    } catch (error) {
      console.error('❌ Wait failed:', error.message);
      throw error;
    }
  }

  /**
   * Execute custom JavaScript
   */
  async executeScript(script) {
    if (!this.page) throw new Error('Browser not initialized.');

    try {
      const result = await this.page.evaluate(script);
      console.log(`✅ Script executed successfully`);
      return result;
    } catch (error) {
      console.error('❌ Script execution failed:', error.message);
      throw error;
    }
  }

  /**
   * Monitor page changes
   */
  async monitorChanges(callback) {
    if (!this.page) throw new Error('Browser not initialized.');

    this.page.on('domcontentloaded', () => {
      console.log('📊 DOM content loaded');
      if (callback) callback({ event: 'domcontentloaded' });
    });

    this.page.on('load', () => {
      console.log('📊 Page fully loaded');
      if (callback) callback({ event: 'load' });
    });

    this.page.on('console', msg => {
      console.log('📊 Browser console:', msg.text());
      if (callback) callback({ event: 'console', message: msg.text() });
    });
  }

  /**
   * Close browser
   */
  async close() {
    try {
      if (this.browser) {
        await this.browser.close();
        console.log('✅ Browser closed');
        this.browser = null;
        this.context = null;
        this.page = null;
      }
    } catch (error) {
      console.error('❌ Failed to close browser:', error.message);
    }
  }

  /**
   * Get browser status
   */
  getStatus() {
    return {
      isLaunched: this.browser !== null,
      browserType: this.browserType,
      headless: this.headless,
      currentUrl: this.page ? this.page.url() : null
    };
  }
}

export default BrowserEngine;

