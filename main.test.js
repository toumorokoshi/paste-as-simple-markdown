import { describe, it, expect, beforeEach, vi } from 'vitest';
import { convertLatexToUnicode, transformContent, setupApp } from './main';

describe('convertLatexToUnicode', () => {
  it('converts simple symbols', () => {
    expect(convertLatexToUnicode('\\alpha')).toBe('α');
    expect(convertLatexToUnicode('\\beta')).toBe('β');
  });

  it('converts superscripts', () => {
    expect(convertLatexToUnicode('x^2')).toBe('x²');
    expect(convertLatexToUnicode('x^{2}')).toBe('x²');
    expect(convertLatexToUnicode('e^{x+y}')).toBe('e^(x+y)');
  });

  it('converts subscripts', () => {
    expect(convertLatexToUnicode('x_i')).toBe('xᵢ');
    expect(convertLatexToUnicode('x_{i}')).toBe('xᵢ');
    expect(convertLatexToUnicode('a_{n,m}')).toBe('a_(n,m)');
  });

  it('converts fractions', () => {
    expect(convertLatexToUnicode('\\frac{a}{b}')).toBe('(a)/(b)');
  });

  it('converts square roots', () => {
    expect(convertLatexToUnicode('\\sqrt{x}')).toBe('√(x)');
  });
});

describe('transformContent', () => {
  it('integrates html conversion and latex mapping', () => {
    const html = '<h1>Hello</h1><p>Value: $x^2$</p>';
    const result = transformContent(html);
    expect(result).toContain('# Hello');
    expect(result).toContain('Value: $x²$');
  });
});

/**
 * Mocks browser APIs for testing.
 */
const mockBrowserAPIs = () => {
  const store = new Map();
  const localStorageMock = {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => {
      store.set(key, value.toString());
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
  });
};

describe('IO Layer Integration - Content', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    document.body.innerHTML = `
      <header>
        <div id="header-actions">
          <button id="theme-toggle"><svg id="theme-toggle-icon"></svg></button>
          <button id="copy-btn">Copy</button>
        </div>
      </header>
      <main class="split-pane">
        <div id="markdown-output" contenteditable="true"></div>
        <div id="preview-area"></div>
      </main>
    `;
    setupApp();
  });

  it('updates markdown and preview on paste', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const previewArea = document.getElementById('preview-area');
    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: (type) => (type === 'text/html' ? '<b>Bold</b>' : '') },
    });
    markdownOutput.dispatchEvent(pasteEvent);
    expect(markdownOutput.textContent).toContain('**Bold**');
    expect(previewArea.innerHTML).toContain('<strong>Bold</strong>');
  });

  it('updates preview on manual input', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const previewArea = document.getElementById('preview-area');
    markdownOutput.textContent = '## New Heading';
    markdownOutput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(previewArea.innerHTML).toContain('<h2>New Heading</h2>');
  });

  it('copies content to clipboard on button click', async () => {
    const markdownOutput = document.getElementById('markdown-output');
    const copyBtn = document.getElementById('copy-btn');
    markdownOutput.textContent = 'Copied Text';
    copyBtn.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copied Text');
  });
});

describe('IO Layer Integration - Theme', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    document.body.innerHTML = `
      <header>
        <div id="header-actions">
          <button id="theme-toggle"><svg id="theme-toggle-icon"></svg></button>
          <button id="copy-btn">Copy</button>
        </div>
      </header>
      <main class="split-pane">
        <div id="markdown-output" contenteditable="true"></div>
        <div id="preview-area"></div>
      </main>
    `;
    setupApp();
  });

  it('toggles theme on theme button click', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    expect(html.getAttribute('data-theme')).toBe('light');
    themeToggle.click();
    expect(html.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    themeToggle.click();
    expect(html.getAttribute('data-theme')).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
