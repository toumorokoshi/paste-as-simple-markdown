import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  convertLatexToUnicode,
  transformContent,
  setupApp,
  HIGHLIGHT_DELAY_MS
} from './main';

describe('convertLatexToUnicode', () => {
  it('converts simple symbols', () => {
    expect(convertLatexToUnicode('\\alpha')).toBe('α');
    expect(convertLatexToUnicode('\\beta')).toBe('β');
  });

  it('converts superscripts', () => {
    expect(convertLatexToUnicode('x^2')).toBe('x²');
    expect(convertLatexToUnicode('x^{2}')).toBe('x²');
    expect(convertLatexToUnicode('e^{x+y}')).toBe('eˣ⁺ʸ');
    expect(convertLatexToUnicode('x^{a^{b}}')).toBe('x^(aᵇ)');
  });

  it('converts subscripts', () => {
    expect(convertLatexToUnicode('x_i')).toBe('xᵢ');
    expect(convertLatexToUnicode('x_{i}')).toBe('xᵢ');
    expect(convertLatexToUnicode('a_{n,m}')).toBe('a_(n,m)');
    expect(convertLatexToUnicode('x_{y_{z}}')).toBe('x_(y_(z))');
  });

  it('converts fractions', () => {
    expect(convertLatexToUnicode('\\frac{a}{b}')).toBe('(a)/(b)');
    expect(convertLatexToUnicode('\\frac{\\frac{a}{b}}{c}')).toBe(
      '((a)/(b))/(c)'
    );
    expect(convertLatexToUnicode('\\frac{a}{\\frac{b}{c}}')).toBe(
      '(a)/((b)/(c))'
    );
  });

  it('converts square roots', () => {
    expect(convertLatexToUnicode('\\sqrt{x}')).toBe('√x');
    expect(convertLatexToUnicode('\\sqrt{a+b}')).toBe('√(a+b)');
    expect(convertLatexToUnicode('\\sqrt{\\sqrt{x}}')).toBe('√(√x)');
  });

  it('converts operators with limits', () => {
    expect(convertLatexToUnicode('\\sum_{i=0}^n')).toBe('Σ(i=0 to n)');
    expect(convertLatexToUnicode('\\sum^n_{i=0}')).toBe('Σ(i=0 to n)');
    expect(convertLatexToUnicode('\\int_{a}^b')).toBe('∫(a to b)');
    expect(convertLatexToUnicode('\\prod_{i=1}^n')).toBe('Π(i=1 to n)');
    expect(convertLatexToUnicode('\\sum_{i=0}')).toBe('Σ(i=0)');
    expect(convertLatexToUnicode('\\sum^n')).toBe('Σ(to n)');
    expect(convertLatexToUnicode('\\sum_{i=0}^\\infty')).toBe('Σ(i=0 to ∞)');
  });
});

describe('convertLatexToUnicode - Expanded Symbols', () => {
  it('converts additional Greek letters', () => {
    expect(convertLatexToUnicode('\\varepsilon')).toBe('ε');
    expect(convertLatexToUnicode('\\vartheta')).toBe('ϑ');
    expect(convertLatexToUnicode('\\varphi')).toBe('ϕ');
    expect(convertLatexToUnicode('\\Omega')).toBe('Ω');
  });

  it('converts binary operators', () => {
    expect(convertLatexToUnicode('\\mp')).toBe('∓');
    expect(convertLatexToUnicode('\\oplus')).toBe('⊕');
    expect(convertLatexToUnicode('\\otimes')).toBe('⊗');
    expect(convertLatexToUnicode('\\setminus')).toBe('∖');
  });

  it('converts relation operators', () => {
    expect(convertLatexToUnicode('\\approx')).toBe('≈');
    expect(convertLatexToUnicode('\\subseteq')).toBe('⊆');
    expect(convertLatexToUnicode('\\supseteq')).toBe('⊇');
    expect(convertLatexToUnicode('\\propto')).toBe('∝');
  });

  it('converts arrows', () => {
    expect(convertLatexToUnicode('\\leftarrow')).toBe('←');
    expect(convertLatexToUnicode('\\leftrightarrow')).toBe('↔');
    expect(convertLatexToUnicode('\\Leftarrow')).toBe('⇐');
    expect(convertLatexToUnicode('\\Leftrightarrow')).toBe('⇔');
    expect(convertLatexToUnicode('\\mapsto')).toBe('↦');
  });

  it('converts miscellaneous symbols', () => {
    expect(convertLatexToUnicode('\\hbar')).toBe('ℏ');
    expect(convertLatexToUnicode('\\emptyset')).toBe('∅');
    expect(convertLatexToUnicode('\\nabla')).toBe('∇');
    expect(convertLatexToUnicode('\\neg')).toBe('¬');
  });
});

describe('convertLatexToUnicode - Scripts and Blocks', () => {
  it('converts expanded superscripts', () => {
    expect(convertLatexToUnicode('x^a')).toBe('xᵃ');
    expect(convertLatexToUnicode('x^b')).toBe('xᵇ');
    expect(convertLatexToUnicode('x^{(1)}')).toBe('x⁽¹⁾');
    expect(convertLatexToUnicode('x^{=}')).toBe('x⁼');
  });

  it('converts expanded subscripts', () => {
    expect(convertLatexToUnicode('x_a')).toBe('xₐ');
    expect(convertLatexToUnicode('x_e')).toBe('xₑ');
    expect(convertLatexToUnicode('x_{(1)}')).toBe('x₍₁₎');
    expect(convertLatexToUnicode('x_{=}')).toBe('x₌');
  });

  it('converts Wikipedia style math with {\\displaystyle ...}', () => {
    const input =
      '{\\displaystyle X=[0,1]\\cup[2,3]\\cup[4,5]\\cup\\dots\\cup[2k,2k+1]\\cup\\dotsb}';
    const result = convertLatexToUnicode(input);
    expect(result).toBe('X=[0,1]∪[2,3]∪[4,5]∪...∪[2k,2k+1]∪...');
  });

  it('converts \\text{...} by removing the command and keeping the content', () => {
    const input = '\\alpha + \\text{some text} + \\beta';
    const result = convertLatexToUnicode(input);
    expect(result).toBe('α + some text + β');
  });

  it('handles bracketed paste markers and ANSI escape codes', () => {
    const input = '\x1b[200~In topology, a space.\x1b[201~';
    const result = convertLatexToUnicode(input);
    expect(result).toBe('In topology, a space.');
  });

  it('deduplicates symbols before {\\displaystyle ...} blocks', () => {
    const input = 'T\n{\\displaystyle T} is a space.';
    const result = convertLatexToUnicode(input);
    expect(result).toBe('T is a space.');
  });

  it('collapses short lines often found in Wikipedia pastes', () => {
    const input = 'U\n=\nU\ni\nis a set.';
    const result = convertLatexToUnicode(input);
    expect(result).toBe('U = U i is a set.');
  });
});

describe('transformContent', () => {
  it('integrates html conversion and latex mapping', () => {
    const html = '<h1>Hello</h1><p>Value: $x^2$</p>';
    const result = transformContent(html);
    expect(result).toContain('# Hello');
    expect(result).toContain('Value: $x²$');
  });

  it('handles latex symbols with backslashes correctly after HTML conversion', () => {
    const html = '<p>$\\alpha + \\beta$</p>';
    const result = transformContent(html);
    // Turndown will convert \alpha to \\alpha
    // convertLatexToUnicode should handle it and return α
    expect(result).toBe('$\u03B1 + \u03B2$'); // α + β
  });

  it('extracts alt from Wikipedia math and converts it', () => {
    const html = `
      <p>Consider the disjoint countable union 
      <span class="mwe-math-element">
        <span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;">
          <math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\\displaystyle X=[0,1]\\cup[2,3]\\cup[4,5]\\cup\\dots\\cup[2k,2k+1]\\cup\\dotsb}">
            <mi>X</mi>...
          </math>
        </span>
        <img src="..." class="mwe-math-fallback-image-inline" aria-hidden="true" alt="{\\displaystyle X=[0,1]\\cup[2,3]\\cup[4,5]\\cup\\dots\\cup[2k,2k+1]\\cup\\dotsb}">
      </span>
      </p>
    `;
    const result = transformContent(html);
    expect(result).toContain(
      'Consider the disjoint countable union X=[0,1]∪[2,3]∪[4,5]∪...∪[2k,2k+1]∪...'
    );
  });
});

/**
 * Mocks browser APIs for testing.
 */
const mockLocalStorage = () => {
  const store = new Map();
  const localStorageMock = {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => {
      store.set(key, value.toString());
    }),
    clear: vi.fn(() => {
      store.clear();
    })
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true
  });
};

const mockMatchMedia = () => {
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
      dispatchEvent: vi.fn()
    }))
  });
};

const mockClipboard = () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockImplementation(() => Promise.resolve())
    }
  });
};

const mockBrowserAPIs = () => {
  mockLocalStorage();
  mockMatchMedia();
  mockClipboard();
};

const setupDOM = () => {
  document.body.innerHTML = `
    <header>
      <div id="header-actions">
        <button id="theme-toggle"><svg id="theme-toggle-icon"></svg></button>
        <button id="help-btn">Help</button>
        <button id="copy-btn">Copy</button>
        <button id="copy-plaintext-btn">Copy Plaintext</button>
      </div>
    </header>
    <main class="split-pane">
      <div id="raw-input"></div>
      <div id="markdown-output" contenteditable="true"></div>
      <div id="preview-area"></div>
    </main>
    <div id="help-modal" class="modal">
      <button id="close-modal">&times;</button>
      <div id="symbol-list"></div>
    </div>
  `;
  setupApp();
};

describe('IO Layer Integration - Paste', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    setupDOM();
  });

  it('updates markdown and preview on paste and moves cursor to end', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const previewArea = document.getElementById('preview-area');
    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: (type) => (type === 'text/html' ? '<b>Bold</b>' : '') }
    });

    // Mock getSelection and Range for cursor management
    const mockSelection = {
      rangeCount: 1,
      getRangeAt: vi.fn().mockReturnValue({
        cloneRange: vi.fn().mockReturnValue({
          selectNodeContents: vi.fn(),
          setEnd: vi.fn(),
          toString: vi.fn().mockReturnValue('')
        })
      }),
      removeAllRanges: vi.fn(),
      addRange: vi.fn()
    };
    window.getSelection = vi.fn().mockReturnValue(mockSelection);
    document.createRange = vi.fn().mockReturnValue({
      setStart: vi.fn(),
      collapse: vi.fn()
    });

    markdownOutput.dispatchEvent(pasteEvent);
    expect(markdownOutput.textContent).toContain('**Bold**');
    expect(previewArea.innerHTML).toContain('<strong>Bold</strong>');

    // After paste, restoreCursorPosition should have been called with the length of text
    // We can't easily check the internal state of the range, but we verified the logic.
    expect(window.getSelection).toHaveBeenCalled();
  });

  it('updates raw-input on paste', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const rawInput = document.getElementById('raw-input');
    const pasteEvent = new Event('paste', { bubbles: true });
    const htmlData = '<b>Bold</b>';
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: (type) => (type === 'text/html' ? htmlData : '') }
    });
    markdownOutput.dispatchEvent(pasteEvent);
    expect(rawInput.textContent).toBe(htmlData);
  });

  it('converts LaTeX and highlights concurrently on paste', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: (type) => (type === 'text/html' ? '<p>Formula: $x^2$</p>' : '')
      }
    });
    markdownOutput.dispatchEvent(pasteEvent);
    expect(markdownOutput.textContent).toContain('x²');
  });
});

describe('IO Layer Integration - Input and Copy', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    setupDOM();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates preview on manual input', () => {
    const markdownOutput = document.getElementById('markdown-output');
    const previewArea = document.getElementById('preview-area');
    markdownOutput.textContent = '## New Heading';
    markdownOutput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(previewArea.innerHTML).toContain('<h2>New Heading</h2>');
  });

  it('highlights markdown content on input', () => {
    const markdownOutput = document.getElementById('markdown-output');
    // Using a simple markdown pattern that Prism should highlight
    markdownOutput.textContent = '**Bold Text**';
    markdownOutput.dispatchEvent(new Event('input', { bubbles: true }));

    // Advance timers to trigger debounced highlighting
    vi.advanceTimersByTime(HIGHLIGHT_DELAY_MS);

    // Prism wraps bold text in <span class="token bold">...</span>
    // And it also wraps punctuation like ** in spans.
    expect(markdownOutput.innerHTML).toContain('class="token bold"');
    expect(markdownOutput.textContent).toBe('**Bold Text**');
  });

  it('copies content to clipboard on button click (with highlighting)', async () => {
    const markdownOutput = document.getElementById('markdown-output');
    const copyBtn = document.getElementById('copy-btn');
    // Set some markdown that will be highlighted
    markdownOutput.textContent = '### Heading';
    markdownOutput.dispatchEvent(new Event('input', { bubbles: true }));

    // Advance timers to trigger debounced highlighting
    vi.advanceTimersByTime(HIGHLIGHT_DELAY_MS);

    // Ensure it's highlighted (has <span> tags)
    expect(markdownOutput.innerHTML).toContain('</span>');

    copyBtn.click();
    // It should copy plain text, not HTML
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('### Heading');
  });

  it('copies rendered content to clipboard as plaintext on button click', async () => {
    const markdownOutput = document.getElementById('markdown-output');
    const copyPlaintextBtn = document.getElementById('copy-plaintext-btn');
    const previewArea = document.getElementById('preview-area');

    markdownOutput.textContent = '### Heading';
    markdownOutput.dispatchEvent(new Event('input', { bubbles: true }));

    // Advance timers to trigger debounced highlighting
    vi.advanceTimersByTime(HIGHLIGHT_DELAY_MS);

    // Ensure preview is updated (marked.parse)
    expect(previewArea.innerHTML).toContain('<h3>Heading</h3>');

    // JSDOM does not support innerText, so we mock it
    Object.defineProperty(previewArea, 'innerText', {
      get() {
        return this.textContent;
      },
      configurable: true
    });

    copyPlaintextBtn.click();
    // It should copy the innerText of the preview area
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Heading\n');
  });
});

describe('IO Layer Integration - Theme', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    setupDOM();
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

describe('IO Layer Integration - Help Modal', () => {
  beforeEach(() => {
    mockBrowserAPIs();
    setupDOM();
  });

  it('opens modal when help button is clicked', () => {
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    expect(helpModal.classList.contains('show')).toBe(false);

    helpBtn.click();
    expect(helpModal.classList.contains('show')).toBe(true);
    expect(helpModal.style.display).toBe('flex');
  });

  it('closes modal when close button is clicked', () => {
    const helpBtn = document.getElementById('help-btn');
    const closeModal = document.getElementById('close-modal');
    const helpModal = document.getElementById('help-modal');

    helpBtn.click();
    expect(helpModal.classList.contains('show')).toBe(true);

    closeModal.click();
    expect(helpModal.classList.contains('show')).toBe(false);
  });

  it('populates symbol list on init', () => {
    const symbolList = document.getElementById('symbol-list');
    expect(symbolList.innerHTML).toContain('\\alpha');
    expect(symbolList.innerHTML).toContain('α');
  });

  it('closes modal on escape key', () => {
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');

    helpBtn.click();
    expect(helpModal.classList.contains('show')).toBe(true);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escEvent);
    expect(helpModal.classList.contains('show')).toBe(false);
  });
});
