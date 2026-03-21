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

describe('IO Layer Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <button id="copy-btn">Copy</button>
      </header>
      <main class="split-pane">
        <div id="markdown-output" contenteditable="true"></div>
        <div id="preview-area"></div>
      </main>
    `;

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    setupApp();
  });

  it('updates markdown and preview on paste', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const previewArea = document.getElementById('preview-area');

    const pasteEvent = new Event('paste', { bubbles: true });
    pasteEvent.clipboardData = {
      getData: (type) => {
        if (type === 'text/html') return '<b>Bold</b>';
        return '';
      },
    };

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
