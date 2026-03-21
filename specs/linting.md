# Linting and Formatting Best Practices

To maintain code quality and ensure adherence to the project's architectural principles, we recommend implementing automated linting and formatting tools.

## Formatting

**Prettier** is recommended for consistent code formatting across the project (HTML, CSS, JS, and Markdown files).

- **Line Length**: Keep lines reasonably short (e.g., 80-100 characters) to improve readability.
- **Indentation**: Use 2 spaces for indentation.
- **Quotes**: Prefer single quotes for JavaScript, double quotes for HTML/CSS.

## Linting

**ESLint** is recommended to catch potential errors in JavaScript and enforce the project's strict coding standards.

### Recommended Rules and Plugins

To align with the project's core principles, configure ESLint with the following focuses:

1. **Functional Programming**:
   - Consider plugins like `eslint-plugin-functional` to discourage state mutation. Enforce the use of `const` over `let`, prevent direct object mutation, and favor array methods like `.map()` and `.reduce()` over imperative `for` loops.

2. **Helper Functions & Complexity**:
   - Use the `complexity` rule (e.g., `complexity: ["error", 5]`) to ensure helper functions maintain minimal logic.
   - Use the `max-depth` and `max-lines-per-function` rules to encourage small, composable functions over monolithic blocks.

3. **Constants Usage**:
   - Use the `no-magic-numbers` rule to enforce extracting hard-coded values, mapping dictionaries, and regex patterns into explicit, named constants.

4. **Self-Explanatory Code & Comments**:
   - Prefer descriptive variable and function names so the code documents itself. Only add comments when the code is not self-explanatory. Avoid rules that enforce strictly repetitive docstrings (like mandatory JSDoc for every parameter) if it doesn't add value.

## Recommended Local Setup

Since this is a vanilla web application, these tools only need to be installed as `devDependencies` for the local environment or CI:

```bash
npm init -y
npm install --save-dev prettier eslint eslint-plugin-functional
```

You can then add simple scripts to a `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint script.js"
  }
}
```
