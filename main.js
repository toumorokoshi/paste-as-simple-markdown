import TurndownService from 'turndown';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

/**
 * Application Constants
 */
const LATEX_SYMBOL_MAP = {
  // Greek Letters (Lowercase)
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\delta': 'δ',
  '\\epsilon': 'ϵ',
  '\\zeta': 'ζ',
  '\\eta': 'η',
  '\\theta': 'θ',
  '\\iota': 'ι',
  '\\kappa': 'κ',
  '\\lambda': 'λ',
  '\\mu': 'μ',
  '\\nu': 'ν',
  '\\xi': 'ξ',
  '\\pi': 'π',
  '\\rho': 'ρ',
  '\\sigma': 'σ',
  '\\tau': 'τ',
  '\\upsilon': 'υ',
  '\\phi': 'φ',
  '\\chi': 'χ',
  '\\psi': 'ψ',
  '\\omega': 'ω',
  '\\varepsilon': 'ε',
  '\\vartheta': 'ϑ',
  '\\varkappa': 'ϰ',
  '\\varpi': 'ϖ',
  '\\varrho': 'ϱ',
  '\\varsigma': 'ς',
  '\\varphi': 'ϕ',

  // Greek Letters (Uppercase)
  '\\Gamma': 'Γ',
  '\\Delta': 'Δ',
  '\\Theta': 'Θ',
  '\\Lambda': 'Λ',
  '\\Xi': 'Ξ',
  '\\Pi': 'Π',
  '\\Sigma': 'Σ',
  '\\Upsilon': 'Υ',
  '\\Phi': 'Φ',
  '\\Psi': 'Ψ',
  '\\Omega': 'Ω',

  // Binary Operators
  '\\pm': '±',
  '\\mp': '∓',
  '\\times': '×',
  '\\div': '÷',
  '\\ast': '∗',
  '\\star': '★',
  '\\circ': '∘',
  '\\bullet': '•',
  '\\cdot': '⋅',
  '\\cap': '∩',
  '\\cup': '∪',
  '\\uplus': '⊌',
  '\\sqcap': '⊓',
  '\\sqcup': '⊔',
  '\\vee': '∨',
  '\\wedge': '∧',
  '\\setminus': '∖',
  '\\wr': '≀',
  '\\diamond': '⋄',
  '\\bigtriangleup': '△',
  '\\bigtriangledown': '▽',
  '\\triangleleft': '◃',
  '\\triangleright': '▹',
  '\\oplus': '⊕',
  '\\ominus': '⊖',
  '\\otimes': '⊗',
  '\\oslash': '⊘',
  '\\odot': '⊙',
  '\\dagger': '†',
  '\\ddagger': '‡',
  '\\amalg': '⨿',

  // Relation Operators
  '\\le': '≤',
  '\\leq': '≤',
  '\\ge': '≥',
  '\\geq': '≥',
  '\\equiv': '≡',
  '\\sim': '∼',
  '\\simeq': '≃',
  '\\asymp': '≍',
  '\\approx': '≈',
  '\\cong': '≅',
  '\\neq': '≠',
  '\\doteq': '≐',
  '\\propto': '∝',
  '\\models': '⊧',
  '\\perp': '⊥',
  '\\mid': '|',
  '\\parallel': '‖',
  '\\subset': '⊂',
  '\\supset': '⊃',
  '\\subseteq': '⊆',
  '\\supseteq': '⊇',
  '\\in': '∈',
  '\\ni': '∋',
  '\\notin': '∉',

  // Arrows
  '\\leftarrow': '←',
  '\\rightarrow': '→',
  '\\leftrightarrow': '↔',
  '\\Leftarrow': '⇐',
  '\\Rightarrow': '⇒',
  '\\Leftrightarrow': '⇔',
  '\\uparrow': '↑',
  '\\downarrow': '↓',
  '\\updownarrow': '↕',
  '\\Uparrow': '⇑',
  '\\Downarrow': '⇓',
  '\\Updownarrow': '⇕',
  '\\nearrow': '↗',
  '\\searrow': '↘',
  '\\swarrow': '↙',
  '\\nwarrow': '↖',
  '\\mapsto': '↦',
  '\\hookleftarrow': '↩',
  '\\hookrightarrow': '↪',
  '\\leftharpoonup': '↼',
  '\\leftharpoondown': '↽',
  '\\rightharpoonup': '⇀',
  '\\rightharpoondown': '⇁',

  // Miscellaneous Symbols
  '\\aleph': 'ℵ',
  '\\hbar': 'ℏ',
  '\\imath': 'ı',
  '\\jmath': 'ȷ',
  '\\ell': 'ℓ',
  '\\wp': '℘',
  '\\Re': 'ℜ',
  '\\Im': 'ℑ',
  '\\partial': '∂',
  '\\infty': '∞',
  '\\prime': '′',
  '\\emptyset': '∅',
  '\\nabla': '∇',
  '\\surd': '√',
  '\\top': '⊤',
  '\\bot': '⊥',
  '\\angle': '∠',
  '\\forall': '∀',
  '\\exists': '∃',
  '\\neg': '¬',
  '\\flat': '♭',
  '\\natural': '♮',
  '\\sharp': '♯',
  '\\clubsuit': '♣',
  '\\diamondsuit': '♢',
  '\\heartsuit': '♡',
  '\\spadesuit': '♠',

  // Dots
  '\\dots': '...',
  '\\dotsb': '...',
  '\\dotsc': '...',
  '\\dotsi': '...',
  '\\dotsm': '...',
  '\\dotso': '...',
  '\\cdots': '...',
  '\\ldots': '...',
  '\\vdots': '⋮',
  '\\ddots': '⋱',
  '\\{': '{',
  '\\}': '}',
  '\\(': '(',
  '\\)': ')',
  '\\[': '[',
  '\\]': ']',
  '\\_': '_',
  '\\^': '^',
  '\\$': '$',
  '\\%': '%',
  '\\&': '&',
  '\\\\': '\\'
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
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  a: 'ᵃ',
  b: 'ᵇ',
  c: 'ᶜ',
  d: 'ᵈ',
  e: 'ᵉ',
  f: 'ᶠ',
  g: 'ᵍ',
  h: 'ʰ',
  i: 'ⁱ',
  j: 'ʲ',
  k: 'ᵏ',
  l: 'ˡ',
  m: 'ᵐ',
  n: 'ⁿ',
  o: 'ᵒ',
  p: 'ᵖ',
  r: 'ʳ',
  s: 'ˢ',
  t: 'ᵗ',
  u: 'ᵘ',
  v: 'ᵛ',
  w: 'ʷ',
  x: 'ˣ',
  y: 'ʸ',
  z: 'ᶻ'
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
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
  a: 'ₐ',
  e: 'ₑ',
  h: 'ₕ',
  i: 'ᵢ',
  j: 'ⱼ',
  k: 'ₖ',
  l: 'ₗ',
  m: 'ₘ',
  n: 'ₙ',
  o: 'ₒ',
  p: 'ₚ',
  r: 'ᵣ',
  s: 'ₛ',
  t: 'ₜ',
  u: 'ᵤ',
  v: 'ᵥ',
  x: 'ₓ'
};

const TOAST_DURATION = 2000;
const FADE_OUT_DURATION = 500;
const MODAL_TRANSITION_MS = 300;
const NOT_FOUND = -1;
const MAX_HISTORY_LENGTH = 50;
const TYPING_PAUSE_MS = 1000;

/**
 * Regex Patterns
 */
const LATEX_LIMITS_REGEX =
  /\\+(sum|int|prod)(?:\s*_(?:{([^}]*)}|(\\+[a-zA-Z]+|[^\s_{}^]))(?:\s*\^(?:{([^}]*)}|(\\+[a-zA-Z]+|[^\s_{}^])))?|\s*\^(?:{([^}]*)}|(\\+[a-zA-Z]+|[^\s_{}^]))(?:\s*_(?:{([^}]*)}|(\\+[a-zA-Z]+|[^\s_{}^])))?)?/g;
const LATEX_SYMBOL_REGEX = /\\+([a-zA-Z]+|[{}_^()[\]$!%&])/g;
const LATEX_SIMPLE_SUPERSCRIPT_REGEX =
  /(\w|\))?\^({([a-zA-Z0-9+\-=()]+)}|([a-zA-Z0-9+\-=()]))/g;
const LATEX_COMPLEX_SUPERSCRIPT_REGEX = /(\w|\))?\^{/;
const LATEX_SIMPLE_SUBSCRIPT_REGEX =
  /(\w|\))?_({([a-zA-Z0-9+=()]+)}|([a-zA-Z0-9+=()]))/g;
const LATEX_COMPLEX_SUBSCRIPT_REGEX = /(\w|\))?_{/;
const LATEX_FRAC_REGEX = /\\+frac\s*{/;
const LATEX_SQRT_REGEX = /\\+sqrt\s*{/;

/**
 * UI Constants
 */
const MOON_ICON =
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
const SUN_ICON = `
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

/**
 * Pure Logic Functions
 */

/**
 * Cleans content for comparison by removing LaTeX commands and non-alphanumeric characters.
 */
const cleanForComparison = (s) =>
  s.replace(/\\[a-zA-Z]+/g, '').replace(/[^a-zA-Z0-9]/g, '');

/**
 * Checks if the stripped prefix matches the content.
 */
const matchesContent = (strippedPrefix, strippedContent) =>
  strippedPrefix.length > 0 &&
  (strippedContent.includes(strippedPrefix) ||
    strippedPrefix.includes(strippedContent));

/**
 * Checks if the current index is at a word boundary.
 */
const isAtBoundary = (trimmedPrefix, i) =>
  i === 0 || /\s/.test(trimmedPrefix[i - 1]);

/**
 * Checks if the current stripped prefix matches the content and is at a word boundary.
 */
const isDuplicateMatch = (strippedPrefix, strippedContent, trimmedPrefix, i) =>
  matchesContent(strippedPrefix, strippedContent) &&
  isAtBoundary(trimmedPrefix, i);

/**
 * Finds the index in trimmedPrefix where a duplicate of strippedContent begins.
 */
const findDuplicatePrefixIndex = (trimmedPrefix, strippedContent) => {
  const result = Array.from(trimmedPrefix).reduceRight(
    (acc, char, i) => {
      if (
        acc.foundIndex !== NOT_FOUND ||
        acc.strippedPrefix.length >= strippedContent.length * 2
      ) {
        return acc;
      }

      const newStrippedPrefix = /[a-zA-Z0-9]/.test(char)
        ? char + acc.strippedPrefix
        : acc.strippedPrefix;

      if (
        isDuplicateMatch(newStrippedPrefix, strippedContent, trimmedPrefix, i)
      ) {
        return { foundIndex: i, strippedPrefix: newStrippedPrefix };
      }
      return { ...acc, strippedPrefix: newStrippedPrefix };
    },
    { foundIndex: NOT_FOUND, strippedPrefix: '' }
  );
  return result.foundIndex;
};

/**
 * Deduplicates prefix if it contains a plain-text version of the content.
 */
const deduplicatePrefix = (prefix, content) => {
  const strippedContent = cleanForComparison(content);
  if (!strippedContent) return prefix;

  const trimmedPrefix = prefix.trimEnd();
  const index = findDuplicatePrefixIndex(trimmedPrefix, strippedContent);
  return index !== NOT_FOUND ? trimmedPrefix.substring(0, index) : prefix;
};

/**
 * Finds the index of the matching closing brace starting from an opening brace.
 * Returns -1 if no matching brace is found.
 */
const findClosingBrace = (text, openIndex) => {
  const charWeight = { '{': 1, '}': -1 };
  const result = Array.from(text.substring(openIndex)).reduce(
    (acc, char, i) => {
      if (acc.foundIndex !== NOT_FOUND) return acc;
      const newCount = acc.count + (charWeight[char] || 0);
      return newCount === 0 && char === '}'
        ? { count: 0, foundIndex: openIndex + i }
        : { count: newCount, foundIndex: NOT_FOUND };
    },
    { count: 0, foundIndex: NOT_FOUND }
  );
  return result.foundIndex;
};

/**
 * Replaces LaTeX commands with balanced braces recursively.
 */
/**
 * Finds the indices for a command match and its balanced braces.
 */
const findMatchIndices = (text, commandRegex, searchIndex) => {
  const match = text.substring(searchIndex).match(commandRegex);
  if (!match) return null;

  const startIndex = searchIndex + match.index;
  const firstBraceIndex = text.indexOf('{', startIndex);
  if (firstBraceIndex === NOT_FOUND) {
    return findMatchIndices(text, commandRegex, startIndex + 1);
  }

  const firstClosingBraceIndex = findClosingBrace(text, firstBraceIndex);
  if (firstClosingBraceIndex === NOT_FOUND) {
    return findMatchIndices(text, commandRegex, startIndex + 1);
  }

  return { match, startIndex, firstBraceIndex, firstClosingBraceIndex };
};

/**
 * Extracts second argument for frac-like commands.
 */
const extractFracArguments = (text, firstClosingBraceIndex) => {
  const remaining = text.substring(firstClosingBraceIndex + 1);
  const secondBraceMatch = remaining.match(/^\s*{/);
  if (!secondBraceMatch) return null;

  const secondBraceIndex = firstClosingBraceIndex + 1 + remaining.indexOf('{');
  const secondClosingBraceIndex = findClosingBrace(text, secondBraceIndex);

  if (secondClosingBraceIndex === NOT_FOUND) return null;

  return {
    arg2: text.substring(secondBraceIndex + 1, secondClosingBraceIndex),
    lastIndex: secondClosingBraceIndex
  };
};

/**
 * Replaces LaTeX commands with balanced braces recursively.
 */
const replaceRecursiveCommand = (text, commandRegex, processor) => {
  const indices = findMatchIndices(text, commandRegex, 0);
  if (!indices) return text;

  const { match, startIndex, firstBraceIndex, firstClosingBraceIndex } =
    indices;
  const arg1 = text.substring(firstBraceIndex + 1, firstClosingBraceIndex);

  const processMatch = () => {
    if (commandRegex.source.includes('frac')) {
      const fracArgs = extractFracArguments(text, firstClosingBraceIndex);
      if (fracArgs) {
        return {
          replacement: processor(match, arg1, fracArgs.arg2),
          lastIndex: fracArgs.lastIndex
        };
      }
      return null;
    }
    return {
      replacement: processor(match, arg1),
      lastIndex: firstClosingBraceIndex
    };
  };

  const result = processMatch();
  if (result && result.replacement !== undefined) {
    const nextText =
      text.substring(0, startIndex) +
      result.replacement +
      text.substring(result.lastIndex + 1);
    return replaceRecursiveCommand(nextText, commandRegex, processor);
  }

  return (
    text.substring(0, startIndex + 1) +
    replaceRecursiveCommand(
      text.substring(startIndex + 1),
      commandRegex,
      processor
    )
  );
};

/**
 * Formats LaTeX operator limits into a Unicode string.
 * @param {string} op Operator (sum, int, prod)
 * @param {string} lower Lower limit
 * @param {string} upper Upper limit
 * @returns {string}
 */
const formatLimits = (op, lower, upper) => {
  const unicodeOp = { sum: 'Σ', int: '∫', prod: 'Π' }[op];
  if (lower && upper) return `${unicodeOp}(${lower} to ${upper})`;
  if (lower) return `${unicodeOp}(${lower})`;
  if (upper) return `${unicodeOp}(to ${upper})`;
  return unicodeOp;
};

/**
 * Returns the first truthy value from a list of arguments.
 * @param {...any} args
 * @returns {any}
 */
const getFirstValue = (...args) => args.find((arg) => !!arg);

/**
 * Maps a string of characters to their Unicode equivalents if all characters are in the map.
 * @param {string} str
 * @param {Object} map
 * @returns {string|undefined}
 */
const mapString = (str, map) => {
  const chars = Array.from(str);
  const mapped = chars.map((c) => map[c]);
  if (mapped.every((c) => c !== undefined)) {
    return mapped.join('');
  }
  return undefined;
};

/**
 * Handles LaTeX operator limits (\sum, \int, \prod).
 * @param {string} text
 * @returns {string}
 */
const handleLimits = (text) =>
  text.replace(
    LATEX_LIMITS_REGEX,
    (match, op, l1, l2, u1, u2, u3, u4, l3, l4) =>
      formatLimits(
        op,
        getFirstValue(l1, l2, l3, l4),
        getFirstValue(u1, u2, u3, u4)
      )
  );

/**
 * Handles LaTeX symbols mapping.
 * @param {string} text
 * @returns {string}
 */
const handleSymbols = (text) =>
  text.replace(LATEX_SYMBOL_REGEX, (match, command) => {
    const symbol = LATEX_SYMBOL_MAP[`\\${command}`];
    return symbol || match;
  });

/**
 * Handles simple superscripts.
 * @param {string} text
 * @returns {string}
 */
const handleSimpleSuperscripts = (text) =>
  text.replace(
    LATEX_SIMPLE_SUPERSCRIPT_REGEX,
    (match, base, fullExp, innerExp, singleExp) => {
      const char = innerExp || singleExp;
      const mapped = mapString(char, SUPERSCRIPT_MAP);
      return (base || '') + (mapped || '^(' + char + ')');
    }
  );

/**
 * Handles simple subscripts.
 * @param {string} text
 * @returns {string}
 */
const handleSimpleSubscripts = (text) =>
  text.replace(
    LATEX_SIMPLE_SUBSCRIPT_REGEX,
    (match, base, fullSub, innerSub, singleSub) => {
      const char = innerSub || singleSub;
      const mapped = mapString(char, SUBSCRIPT_MAP);
      return (base || '') + (mapped || '_(' + char + ')');
    }
  );

/**
 * Handles Wikipedia-style displaystyle commands.
 * @param {string} text
 * @returns {string}
 */
const handleDisplayStyle = (text) => {
  const DISPLAYSTYLE_START = '{\\displaystyle';
  const startBraceIndex = text.indexOf(DISPLAYSTYLE_START);
  if (startBraceIndex === NOT_FOUND) return text;

  const endBraceIndex = findClosingBrace(text, startBraceIndex);
  if (endBraceIndex === NOT_FOUND) return text;

  const content = text
    .substring(startBraceIndex + DISPLAYSTYLE_START.length, endBraceIndex)
    .trim();

  const prefix = text.substring(0, startBraceIndex);
  const deduplicatedPrefix = deduplicatePrefix(prefix, content);

  const updatedText =
    (deduplicatedPrefix.trimEnd() ? deduplicatedPrefix.trimEnd() + ' ' : '') +
    content +
    text.substring(endBraceIndex + 1);

  return handleDisplayStyle(updatedText);
};

/**
 * Sanitizes input by removing control characters like bracketed paste markers.
 * @param {string} text
 * @returns {string}
 */
const sanitizeInput = (text) => {
  return (
    text
      /* eslint-disable no-control-regex */
      .replace(/\x1b\[20[0-9]~?/g, '')
      .replace(/\x1b\[[0-9;]*[mK]/g, '') // Also strip ANSI color codes if any
      /* eslint-enable no-control-regex */
      .replace(/~$/, '')
      .replace(/([^\n]{1,30})\n(?![ \t]*[*\-+\d.])/g, '$1 ')
      .replace(/  +/g, ' ')
  );
};

/**
 * Replaces LaTeX commands with Unicode equivalents.
 * @param {string} text
 * @returns {string}
 */
export const convertLatexToUnicode = (text) => {
  const sanitized = sanitizeInput(text);
  const step0a = handleDisplayStyle(sanitized);
  const step0 = handleLimits(step0a);
  const step1 = handleSimpleSuperscripts(step0);

  const step1b = replaceRecursiveCommand(
    step1,
    LATEX_COMPLEX_SUPERSCRIPT_REGEX,
    (match, arg) => {
      const base = match[1] || '';
      return `${base}^(${arg})`;
    }
  );

  const step2 = handleSimpleSubscripts(step1b);

  const step2b = replaceRecursiveCommand(
    step2,
    LATEX_COMPLEX_SUBSCRIPT_REGEX,
    (match, arg) => {
      const base = match[1] || '';
      return `${base}_(${arg})`;
    }
  );

  const step3 = replaceRecursiveCommand(
    step2b,
    LATEX_FRAC_REGEX,
    (match, arg1, arg2) => `(${arg1})/(${arg2})`
  );

  const step4 = replaceRecursiveCommand(step3, /\\+text/, (match, arg) => arg);

  const step5 = replaceRecursiveCommand(
    step4,
    /\\+(mathcal|mathbf|mathrm|mathbb|mathsf|mathtt)/,
    (match, arg) => arg
  );

  const step6 = replaceRecursiveCommand(
    step5,
    LATEX_SQRT_REGEX,
    (match, arg) => (arg.length === 1 ? `√${arg}` : `√(${arg})`)
  );

  const step7 = handleSymbols(step6);

  const step8 = step7.replace(/{([^{}\n]+)}/g, '$1');

  // Strip $ around a single symbol/character (e.g., $X$ -> X)
  return step8.replace(/\$([^$\s])\$/g, '$1');
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

  // Handle Wikipedia math elements specifically to avoid messy MathML text
  turndownService.addRule('wikipedia-math', {
    filter: (node) =>
      node.nodeName === 'SPAN' && node.classList.contains('mwe-math-element'),
    replacement: (content, node) => {
      const img = node.querySelector(
        'img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display'
      );
      if (img && img.getAttribute('alt')) {
        return img.getAttribute('alt');
      }
      return content;
    }
  });

  // Strip math tags as they often result in messy text
  turndownService.addRule('strip-math', {
    filter: ['math'],
    replacement: () => ''
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
 * Saves the current cursor position in a contenteditable element.
 * @param {HTMLElement} element
 * @returns {number} The current cursor offset
 */
const saveCursorPosition = (element) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return 0;
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(element);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  return preSelectionRange.toString().length;
};

/**
 * Restores the cursor position in a contenteditable element.
 * @param {HTMLElement} element
 * @param {number} offset The cursor offset to restore
 */
const restoreCursorPosition = (element, offset) => {
  const findNodeAtOffset = (root, targetOffset) => {
    const traverse = (node, currentOffset) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextOffset = currentOffset + node.length;
        return targetOffset <= nextOffset
          ? { node, offset: targetOffset - currentOffset }
          : { nextOffset };
      }

      return Array.from(node.childNodes).reduce(
        (acc, child) => (acc.node ? acc : traverse(child, acc.nextOffset)),
        { nextOffset: currentOffset }
      );
    };
    return traverse(root, 0);
  };

  const selection = window.getSelection();
  const range = document.createRange();
  const result = findNodeAtOffset(element, offset);

  if (result.node) {
    range.setStart(result.node, result.offset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

/**
 * Applies syntax highlighting to a contenteditable element using Prism.js.
 * @param {HTMLElement} element
 */
const highlightMarkdown = (element) => {
  const offset = saveCursorPosition(element);
  const text = element.textContent;
  const highlighted = Prism.highlight(
    text,
    Prism.languages.markdown,
    'markdown'
  );
  element.innerHTML = highlighted;
  restoreCursorPosition(element, offset);
};

/**
 * Updates the theme toggle icon based on the current theme.
 * @param {HTMLElement} icon
 * @param {string} theme
 */
const updateThemeIcon = (icon, theme) => {
  if (theme === 'dark') {
    icon.innerHTML = MOON_ICON;
  } else {
    icon.innerHTML = SUN_ICON;
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
    setTimeout(() => toast.remove(), FADE_OUT_DURATION);
  }, TOAST_DURATION);
};

/**
 * Populates the symbol list in the Help modal.
 * @param {HTMLElement} container
 */
const populateSymbolList = (container) => {
  const items = [];

  // Add examples of structural operators first
  const examples = [
    { cmd: 'x^2', res: 'x²' },
    { cmd: 'x_i', res: 'xᵢ' },
    { cmd: '\\frac{a}{b}', res: '(a)/(b)' },
    { cmd: '\\sqrt{x}', res: '√x' },
    { cmd: '\\sum_{i=0}^n', res: 'Σ(i=0 to n)' }
  ];

  examples.forEach((ex) => {
    items.push(
      `<div class="symbol-item"><span>${ex.cmd}</span> <span>${ex.res}</span></div>`
    );
  });

  // Add all mapped symbols
  for (const [key, value] of Object.entries(LATEX_SYMBOL_MAP)) {
    items.push(
      `<div class="symbol-item"><span>${key}</span> <span>${value}</span></div>`
    );
  }

  container.innerHTML = items.join('');
};

/**
 * Sets up the Help modal interactivity.
 */
const setupHelpModal = (helpBtn, helpModal, closeModal) => {
  const toggleModal = (show) => {
    if (show) {
      const modal = helpModal;
      modal.style.display = 'flex';
      void modal.offsetWidth; // Trigger reflow
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    } else {
      helpModal.classList.remove('show');
      helpModal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        if (!helpModal.classList.contains('show')) {
          helpModal.style.display = 'none';
        }
      }, MODAL_TRANSITION_MS);
    }
  };

  helpBtn.addEventListener('click', () => toggleModal(true));
  closeModal.addEventListener('click', () => toggleModal(false));

  window.addEventListener('click', (event) => {
    if (event.target === helpModal) toggleModal(false);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && helpModal.classList.contains('show')) {
      toggleModal(false);
    }
  });
};

/**
 * Highlight delay constant.
 */
export const HIGHLIGHT_DELAY_MS = 500;

/**
 * Updates the preview area with the given markdown.
 */
const updatePreview = (previewArea, markdown) => {
  previewArea.innerHTML = marked.parse(markdown);
};

/**
 * Converts clipboard content to markdown.
 */
const clipboardToMarkdown = (clipboardData) => {
  const htmlData = clipboardData.getData('text/html');
  const plainData = clipboardData.getData('text/plain');

  if (htmlData) {
    return {
      markdown: transformContent(htmlData),
      raw: htmlData
    };
  }

  if (plainData) {
    return {
      markdown: convertLatexToUnicode(plainData),
      raw: plainData
    };
  }

  return null;
};

/**
 * Handles paste events by converting HTML or plain text to markdown.
 */
const handlePaste = (e, markdownOutput, previewArea, rawInput) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  if (!clipboardData) return;

  const result = clipboardToMarkdown(clipboardData);
  if (!result) return;

  e.preventDefault();
  try {
    const { markdown, raw } = result;
    rawInput.textContent = raw;

    const output = markdownOutput;
    output.textContent = markdown;

    // When we replace everything, we usually want the cursor at the end
    // highlightMarkdown will attempt to restore previous position (usually 0 if empty)
    // so we manually set it to the end after highlighting.
    highlightMarkdown(output);
    restoreCursorPosition(output, output.textContent.length);

    updatePreview(previewArea, markdown);
    showToast('Pasted and converted successfully!');
  } catch (err) {
    console.error('Conversion error:', err);
    showToast('Error converting pasted content.');
  }
};

/**
 * Updates the last saved state for undo history.
 */
const updateLastState = (state, markdownOutput, rawInput) => {
  state.lastState = {
    markdown: markdownOutput.textContent,
    raw: rawInput.textContent
  };
};

/**
 * Pushes the current state into history.
 */
const pushHistory = (state) => {
  state.history.push({ ...state.lastState });
  if (state.history.length > MAX_HISTORY_LENGTH) {
    state.history.shift();
  }
};

/**
 * Performs an undo operation.
 */
const performUndo = (state, markdownOutput, previewArea, rawInput) => {
  const prevState = state.history.pop();
  if (prevState !== undefined) {
    markdownOutput.textContent = prevState.markdown;
    rawInput.textContent = prevState.raw;
    highlightMarkdown(markdownOutput);
    updatePreview(previewArea, prevState.markdown);
    restoreCursorPosition(markdownOutput, markdownOutput.textContent.length);
    showToast('Undo successful');
    state.isTyping = false;
    updateLastState(state, markdownOutput, rawInput);
  }
};

/**
 * Handles input events on the markdown editor.
 */
const handleInput = (state, markdownOutput, previewArea, rawInput) => {
  if (!state.isTyping) {
    pushHistory(state);
    state.isTyping = true;
  }

  const text = markdownOutput.textContent;
  updatePreview(previewArea, text);

  // Debounce highlighting to avoid breaking soft keyboards (especially on Android)
  // where frequent DOM churn during composition causes issues.
  clearTimeout(state.highlightTimeout);
  state.highlightTimeout = setTimeout(() => {
    highlightMarkdown(markdownOutput);
  }, HIGHLIGHT_DELAY_MS);

  // Reset typing state after a pause
  clearTimeout(state.typingTimeout);
  state.typingTimeout = setTimeout(() => {
    state.isTyping = false;
    updateLastState(state, markdownOutput, rawInput);
  }, TYPING_PAUSE_MS);
};

/**
 * Sets up the markdown editor interactivity.
 */
const setupMarkdownEditor = (markdownOutput, previewArea, rawInput) => {
  const state = {
    highlightTimeout: undefined,
    history: [],
    isTyping: false,
    typingTimeout: undefined,
    lastState: {
      markdown: markdownOutput.textContent,
      raw: rawInput.textContent
    }
  };

  markdownOutput.addEventListener('paste', (e) => {
    pushHistory(state);
    state.isTyping = false;
    handlePaste(e, markdownOutput, previewArea, rawInput);
    updateLastState(state, markdownOutput, rawInput);
  });

  markdownOutput.addEventListener('keydown', (e) => {
    const isZ = e.key.toLowerCase() === 'z';
    const isUndo = (e.ctrlKey || e.metaKey) && isZ && !e.shiftKey;
    if (isUndo) {
      e.preventDefault();
      performUndo(state, markdownOutput, previewArea, rawInput);
    }
  });

  markdownOutput.addEventListener('input', () => {
    handleInput(state, markdownOutput, previewArea, rawInput);
  });
};

/**
 * Sets up the theme toggle interactivity.
 */
const setupThemeToggle = (themeToggle, themeToggleIcon) => {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeToggleIcon, newTheme);
  });
};

/**
 * Copies text to the clipboard with a fallback for older browsers.
 * @param {string} text
 * @param {string} successMessage
 */
const copyToClipboard = (text, successMessage) => {
  if (!text) return;

  const performCopy = (success) => {
    if (success) showToast(successMessage);
    else showToast('Failed to copy. Please copy manually.');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => performCopy(true))
      .catch(() => performCopy(false));
  } else {
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      performCopy(successful);
    } catch {
      performCopy(false);
    }
    document.body.removeChild(textArea);
  }
};

/**
 * Initializes the application by setting up event listeners and DOM references.
 * @export
 */
export const setupApp = () => {
  const markdownOutput = document.getElementById('markdown-output');
  const previewArea = document.getElementById('preview-area');
  const rawInput = document.getElementById('raw-input');
  const copyBtn = document.getElementById('copy-btn');
  const copyPlaintextBtn = document.getElementById('copy-plaintext-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeModal = document.getElementById('close-modal');
  const symbolList = document.getElementById('symbol-list');

  const elements = [
    markdownOutput,
    previewArea,
    rawInput,
    copyBtn,
    copyPlaintextBtn,
    themeToggle,
    themeToggleIcon,
    helpBtn,
    helpModal,
    closeModal,
    symbolList
  ];
  if (elements.some((el) => !el)) return;

  const initialTheme = initTheme();
  updateThemeIcon(themeToggleIcon, initialTheme);
  populateSymbolList(symbolList);

  setupHelpModal(helpBtn, helpModal, closeModal);
  setupMarkdownEditor(markdownOutput, previewArea, rawInput);
  setupThemeToggle(themeToggle, themeToggleIcon);

  copyBtn.addEventListener('click', () => {
    copyToClipboard(
      markdownOutput.textContent,
      'Markdown copied to clipboard!'
    );
  });

  copyPlaintextBtn.addEventListener('click', () => {
    copyToClipboard(previewArea.innerText, 'Plaintext copied to clipboard!');
  });
};

// Initialize app
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupApp);
}
