import TurndownService from 'turndown';
import { marked } from 'marked';

/**
 * Application Constants
 */
const LATEX_SYMBOL_MAP = {
  '\\\\alpha': 'α',
  '\\\\beta': 'β',
  '\\\\gamma': 'γ',
  '\\\\theta': 'θ',
  '\\\\pi': 'π',
  '\\\\Gamma': 'Γ',
  '\\\\times': '×',
  '\\\\div': '÷',
  '\\\\pm': '±',
  '\\\\infty': '∞',
  '\\\\approx': '≈',
  '\\\\neq': '≠',
  '\\\\le': '≤',
  '\\\\leq': '≤',
  '\\\\ge': '≥',
  '\\\\geq': '≥',
  '\\\\rightarrow': '→',
  '\\\\Rightarrow': '⇒',
  '\\\\int': '∫',
  '\\\\sum': 'Σ',
  '\\\\prod': 'Π'
};

const SUPERSCRIPT_MAP = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  '+': '⁺',
  '-': '⁻',
  n: 'ⁿ',
  i: 'ⁱ'
};

const SUBSCRIPT_MAP = {
  0: '₀',
  1: '₁',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
  7: '₇',
  8: '₈',
  9: '₉',
  i: 'ᵢ',
  j: 'ⱼ',
  k: 'ₖ',
  l: 'ₗ',
  m: 'ₘ',
  n: 'ₙ'
};

/**
 * Pure Logic Functions
 */

/**
 * Replaces LaTeX commands with Unicode equivalents.
 * @param {string} text
 * @returns {string}
 */
export const convertLatexToUnicode = (text) => {
  // 1. Map simple symbols
  const withSymbols = Object.entries(LATEX_SYMBOL_MAP).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(key, 'g'), val),
    text
  );

  // 2. Handle simple superscripts (e.g., x^2 -> x² or x^{2} -> x²)
  const withSimpleSupers = withSymbols.replace(
    /(\w|\))?\^({([0-9+\-ni])}|([0-9+\-ni]))/g,
    (match, base, fullExp, innerExp, singleExp) => {
      const char = innerExp || singleExp;
      const superChar = SUPERSCRIPT_MAP[char];
      return (base || '') + (superChar || '^(' + char + ')');
    }
  );

  // Handle complex superscripts e.g. x^{a+b} -> x^(a+b)
  const withComplexSupers = withSimpleSupers.replace(
    /(\w|\))?\^{([^}]*)}/g,
    '$1^($2)'
  );

  // 3. Handle simple subscripts (e.g., x_i -> xᵢ or x_{i} -> xᵢ)
  const withSimpleSubs = withComplexSupers.replace(
    /(\w|\))?_({([0-9ijk-mn])}|([0-9ijk-mn]))/g,
    (match, base, fullSub, innerSub, singleSub) => {
      const char = innerSub || singleSub;
      const subChar = SUBSCRIPT_MAP[char];
      return (base || '') + (subChar || '_(' + char + ')');
    }
  );

  // Handle complex subscripts e.g. x_{i,j} -> x_(i,j)
  const withComplexSubs = withSimpleSubs.replace(
    /(\w|\))?_{([^}]*)}/g,
    '$1_($2)'
  );

  // 4. Handle fractions \frac{A}{B} -> (A)/(B)
  const withFractions = withComplexSubs.replace(
    /\\frac\s*{([^}]*)}\s*{([^}]*)}/g,
    '($1)/($2)'
  );

  // 5. Handle square roots \sqrt{x} -> √x
  return withFractions.replace(/\\sqrt\s*{([^}]*)}/g, '√($1)');
};

/**
 * Converts HTML to Markdown.
 * @param {string} html
 * @returns {string}
 */
export const htmlToMarkdown = (html) => {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });
  return turndownService.turndown(html);
};

/**
 * Full transformation pipeline.
 * @param {string} html
 * @returns {string}
 */
export const transformContent = (html) => {
  const markdown = htmlToMarkdown(html);
  return convertLatexToUnicode(markdown);
};

/**
 * IO Layer / DOM Interactivity
 */

/**
 * Updates the theme toggle icon based on the current theme.
 * @param {HTMLElement} icon
 * @param {string} theme
 */
const updateThemeIcon = (icon, theme) => {
  if (theme === 'dark') {
    // Moon icon
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  } else {
    // Sun icon
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  }
};

/**
 * Initializes the theme based on saved preference or system settings.
 * @returns {string} The initial theme ('light' or 'dark')
 */
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initialTheme);
  return initialTheme;
};

/**
 * Creates and shows a toast notification.
 * @param {string} message
 */
const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 2000);
};

/**
 * Initializes the application by setting up event listeners and DOM references.
 * @export
 */
export const setupApp = () => {
  const markdownOutput = document.getElementById('markdown-output');
  const previewArea = document.getElementById('preview-area');
  const copyBtn = document.getElementById('copy-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  const elements = [markdownOutput, previewArea, copyBtn, themeToggle, themeToggleIcon];
  if (elements.some((el) => !el)) return;

  const initialTheme = initTheme();
  updateThemeIcon(themeToggleIcon, initialTheme);

  const updatePreview = (markdown) => {
    previewArea.innerHTML = marked.parse(markdown);
  };

  markdownOutput.addEventListener('paste', (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    if (html) {
      const markdown = transformContent(html);
      markdownOutput.textContent = markdown;
      updatePreview(markdown);
      showToast('Pasted and converted successfully!');
    }
  });

  markdownOutput.addEventListener('input', () => updatePreview(markdownOutput.textContent));

  copyBtn.addEventListener('click', () => {
    if (markdownOutput.textContent) {
      navigator.clipboard.writeText(markdownOutput.textContent).then(() => {
        showToast('Markdown copied to clipboard!');
      });
    }
  });

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeToggleIcon, newTheme);
  });
};

// Initialize app
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupApp);
}
