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
  '\\\\prod': 'Π',
};

const SUPERSCRIPT_MAP = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'i': 'ⁱ'
};

const SUBSCRIPT_MAP = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ'
};

/**
 * Pure Logic Functions
 */

/**
 * Replaces LaTeX commands with Unicode equivalents.
 * @param {string} text 
 * @returns {string}
 */
const convertLatexToUnicode = (text) => {
  let result = text;

  // 1. Map simple symbols
  Object.entries(LATEX_SYMBOL_MAP).forEach(([key, val]) => {
    const regex = new RegExp(key, 'g');
    result = result.replace(regex, val);
  });

  // 2. Handle simple superscripts (e.g., x^2 -> x²)
  result = result.replace(/(\w|\))?\^({?([0-9+\-ni])}?)/g, (match, base, fullExp, innerExp) => {
    const char = innerExp || fullExp;
    const superChar = SUPERSCRIPT_MAP[char];
    if (superChar) return (base || '') + superChar;
    return (base || '') + '^(' + char + ')';
  });

  // Handle complex superscripts e.g. x^{a+b} -> x^(a+b)
  result = result.replace(/(\w|\))?\^{([^}]*)}/g, '$1^($2)');

  // 3. Handle simple subscripts (e.g., x_i -> xᵢ)
  result = result.replace(/(\w|\))?_({?([0-9ijk-mn])}?)/g, (match, base, fullSub, innerSub) => {
    const char = innerSub || fullSub;
    const subChar = SUBSCRIPT_MAP[char];
    if (subChar) return (base || '') + subChar;
    return (base || '') + '_(' + char + ')';
  });

  // Handle complex subscripts e.g. x_{i,j} -> x_(i,j)
  result = result.replace(/(\w|\))?_{([^}]*)}/g, '$1_($2)');

  // 4. Handle fractions \frac{A}{B} -> (A)/(B)
  result = result.replace(/\\frac\s*{([^}]*)}\s*{([^}]*)}/g, '($1)/($2)');

  // 5. Handle square roots \sqrt{x} -> √x
  result = result.replace(/\\sqrt\s*{([^}]*)}/g, '√($1)');

  return result;
};

/**
 * Converts HTML to Markdown.
 * @param {string} html 
 * @returns {string}
 */
const htmlToMarkdown = (html) => {
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
const transformContent = (html) => {
  const markdown = htmlToMarkdown(html);
  return convertLatexToUnicode(markdown);
};

/**
 * IO Layer / DOM Interactivity
 */

const setupApp = () => {
  const pasteArea = document.getElementById('paste-area');
  const markdownOutput = document.getElementById('markdown-output');
  const previewArea = document.getElementById('preview-area');
  const copyBtn = document.getElementById('copy-btn');

  const updateOutput = (markdown) => {
    markdownOutput.textContent = markdown;
    previewArea.innerHTML = marked.parse(markdown);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    
    if (html) {
      const markdown = transformContent(html);
      updateOutput(markdown);
      
      // Provide visual feedback
      showToast('Pasted and converted successfully!');
    }
  };

  const handleCopy = () => {
    const text = markdownOutput.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Markdown copied to clipboard!');
      });
    }
  };

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

  pasteArea.addEventListener('paste', handlePaste);
  copyBtn.addEventListener('click', handleCopy);

  // Keyboard accessibility: Allow pasting via keyboard focus
  pasteArea.addEventListener('keydown', (e) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      // Browser handles native paste if we don't prevent it, 
      // but we want to intercept it anyway via the 'paste' event.
    }
  });
};

// Initialize app
document.addEventListener('DOMContentLoaded', setupApp);

// Add basic toast styles via JS for simplicity, or I could add them to style.css
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    z-index: 1000;
    font-size: 0.9rem;
    transition: opacity 0.5s;
  }
  .fade-out {
    opacity: 0;
  }
`;
document.head.appendChild(style);
