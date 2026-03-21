# LaTeX to Plaintext Conversion Logic

Since standard Markdown viewers do not always render LaTeX (unless augmented by MathJax/KaTeX), this application parses LaTeX tags out of the standard text and replaces them with corresponding Unicode characters.

## Approach
This must be handled by a pure function utilizing regular expression mappings. It should execute after the HTML to Markdown conversion (or potentially before, depending on how Turndown escapes characters).

## Required Keyword Mappings
We must use constants to map LaTeX keywords to Unicode.

### Greek Letters
* `\alpha` -> `α`
* `\beta` -> `β`
* `\gamma` -> `γ`
* `\theta` -> `θ`
* `\pi` -> `π`
...and their uppercase equivalents (e.g., `\Gamma` -> `Γ`).

### Mathematical Operators and Symbols
* `\times` -> `×`
* `\div` -> `÷`
* `\pm` -> `±`
* `\infty` -> `∞`
* `\approx` -> `≈`
* `\neq` -> `≠`
* `\le` or `\leq` -> `≤`
* `\ge` or `\geq` -> `≥`
* `\rightarrow` -> `→`
* `\Rightarrow` -> `⇒`

### Structural Operators
* **Superscripts**: `x^2` -> `x²`, `y^3` -> `y³`. 
  * Note: Simple superscripts (0-9, +,-,n) can use Unicode superscripts (`⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ`).
  * If a superscript block is complex (e.g., `x^{a+b}`), map it to `x^(a+b)`.
* **Subscripts**: `x_i` -> `xᵢ`.
  * Simple subscripts map to Unicode subscripts (`₀₁₂...ᵢⱼ`).
  * Complex subscripts map to `x_(...)`.
* **Fractions**: `\frac{A}{B}` -> `(A) / (B)` or `A/B` if simple integers.
* **Square Roots**: `\sqrt{x}` -> `√x`. For complex roots, `√(x+y)`.
* **Integrals/Sums**: `\int`, `\sum`, `\prod` map to `∫`, `Σ`, `Π`. Limits like `\sum_{i=0}^n` can be mapped to `Σ(i=0 to n)`.

## Implementation Strategy
Define a constant dictionary of replacer mappings:
```javascript
const LATEX_SYMBOL_MAP = {
  '\\\\alpha': 'α',
  '\\\\beta': 'β',
  // ...
};
```
Provide a pure function `convertLatex(text)` that loops through the constants and applies a global string replace. Regular expressions will handle structural operators like fractions and blocks.
