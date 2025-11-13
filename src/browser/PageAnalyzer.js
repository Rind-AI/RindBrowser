/**
 * PageAnalyzer.js - Intelligent page content analysis
 * Extracts meaningful data for AI processing
 */

export class PageAnalyzer {
  constructor(page) {
    this.page = page;
  }

  /**
   * Analyze page structure
   */
  async analyzeStructure() {
    return await this.page.evaluate(() => {
      const getElementCount = (selector) => document.querySelectorAll(selector).length;

      return {
        structure: {
          headings: {
            h1: getElementCount('h1'),
            h2: getElementCount('h2'),
            h3: getElementCount('h3'),
            h4: getElementCount('h4'),
            h5: getElementCount('h5'),
            h6: getElementCount('h6')
          },
          content: {
            paragraphs: getElementCount('p'),
            lists: getElementCount('ul, ol'),
            tables: getElementCount('table'),
            articles: getElementCount('article'),
            sections: getElementCount('section')
          },
          interactive: {
            links: getElementCount('a'),
            buttons: getElementCount('button'),
            inputs: getElementCount('input'),
            textareas: getElementCount('textarea'),
            selects: getElementCount('select'),
            forms: getElementCount('form')
          },
          media: {
            images: getElementCount('img'),
            videos: getElementCount('video'),
            audios: getElementCount('audio'),
            iframes: getElementCount('iframe')
          }
        },
        metadata: {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          keywords: document.querySelector('meta[name="keywords"]')?.content || '',
          author: document.querySelector('meta[name="author"]')?.content || '',
          viewport: document.querySelector('meta[name="viewport"]')?.content || ''
        }
      };
    });
  }

  /**
   * Extract main content
   */
  async extractMainContent() {
    return await this.page.evaluate(() => {
      // Try to find main content area
      const mainSelectors = ['main', 'article', '[role="main"]', '#content', '.content'];
      let mainElement = null;

      for (const selector of mainSelectors) {
        mainElement = document.querySelector(selector);
        if (mainElement) break;
      }

      const element = mainElement || document.body;

      return {
        text: element.innerText.substring(0, 10000),
        html: element.innerHTML.substring(0, 10000),
        headings: Array.from(element.querySelectorAll('h1, h2, h3')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.innerText
        }))
      };
    });
  }

  /**
   * Extract all links
   */
  async extractLinks() {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(link => ({
        text: link.innerText.trim(),
        href: link.href,
        title: link.title,
        target: link.target,
        isExternal: link.hostname !== window.location.hostname
      }));
    });
  }

  /**
   * Extract form data
   */
  async extractForms() {
    return await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('form')).map((form, index) => ({
        id: form.id || `form-${index}`,
        action: form.action,
        method: form.method,
        fields: Array.from(form.querySelectorAll('input, textarea, select')).map(field => ({
          type: field.type,
          name: field.name,
          id: field.id,
          placeholder: field.placeholder,
          required: field.required
        }))
      }));
    });
  }

  /**
   * Check for specific elements
   */
  async checkElements(selectors) {
    const results = {};
    
    for (const selector of selectors) {
      try {
        const exists = await this.page.$(selector) !== null;
        results[selector] = exists;
      } catch (error) {
        results[selector] = false;
      }
    }

    return results;
  }

  /**
   * Monitor element changes
   */
  async monitorElement(selector, callback) {
    await this.page.evaluate((sel) => {
      const observer = new MutationObserver((mutations) => {
        console.log('Element changed:', sel);
      });

      const element = document.querySelector(sel);
      if (element) {
        observer.observe(element, {
          attributes: true,
          childList: true,
          subtree: true
        });
      }
    }, selector);
  }

  /**
   * Extract performance metrics
   */
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const perfData = window.performance.timing;
      const navigation = window.performance.getEntriesByType('navigation')[0];

      return {
        loadTime: perfData.loadEventEnd - perfData.navigationStart,
        domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        responseTime: perfData.responseEnd - perfData.requestStart,
        resources: window.performance.getEntriesByType('resource').length,
        navigation: {
          type: navigation?.type || 'unknown',
          redirectCount: navigation?.redirectCount || 0
        }
      };
    });
  }
}

export default PageAnalyzer;

