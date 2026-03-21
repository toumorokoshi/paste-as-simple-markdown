# Architecture and Coding Standards

This project must strictly adhere to specific coding paradigms that prioritize maintainability, testability, and clarity. The application logic focuses on processing data structures rather than tightly coupling logic with DOM manipulation (IO).

## Core Principles

1. **Functional Programming**: Use pure functions where the output is determined completely by the inputs. Avoid mutating state.
2. **Separation of IO and Logic**:
   - Network and Filesystem operations (or in our case, DOM APIs and Clipboard APIs) must reside in wrapper functions at the boundary of the application.
   - These wrapper functions will call inner, pure functions that handle all string manipulations and data structuring.
   - For example, reading the paste event (`e.clipboardData.getData`) is an IO boundary. The raw HTML string is passed to a pure functional pipeline that returns the Markdown string. The IO boundary then updates the DOM and the clipboard.
3. **Composition over Inheritance**: Compose complex parsing behaviors from smaller, single-purpose functions instead of creating class hierarchies.
4. **Use Constants**: Hard-coded values, such as mapping dictionaries, regex patterns, or DOM selectors, must be extracted into explicit constants.
5. **Minimal Helper Logic**: Helper functions should do exactly one thing with minimal conditional flow.
6. **Fewer Comments**: The code must be self-explanatory. Name functions and variables explicitly. Only add comments for inherently complex regex interactions or non-obvious browser API quirks.

## Unit Testing

- Tests must primarily run against the pure data-structure functions (e.g., `convertHtmlToMarkdown(htmlString)`, `replaceLatexWithUnicode(text)`).
- Only write a single integration test that interacts with the IO layer (simulating a paste event and asserting the DOM updates correctly).

## Application Flow

1. **IO Layer**: Listen for the `paste` event on the target element.
2. **Extraction**: Retrieve the `text/html` payload.
3. **Logic Pipeline**:
   - `html_to_markdown`: Pipe the HTML through Turndown.
   - `latex_to_plaintext`: Pipe the resulting text through custom LaTeX replacement strings.
4. **IO Layer**: Output the final string to the visual element, trigger the Marked.js rendering for the preview, and update the clipboard when requested.
