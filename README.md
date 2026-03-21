# Paste as Simple Markdown

A lightweight, modern web application designed for GitHub Pages that converts pasted rich text into clean Markdown and translates LaTeX equations into readable plaintext Unicode characters. 

## Overview
Often, when copying text from academic papers, Wikipedia, or other rich-text sources, the clipboard contains a mix of complex HTML and LaTeX markup. This tool intercepts that clipboard data and processes it into standard Markdown, stripping out annoying visual formatting while preserving the logical structure and translating math symbols into plaintext.

## Key Features
* **Rich Text to Markdown**: Instantly converts standard HTML styling (bold, italics, links, tables) into Markdown syntax.
* **LaTeX to Plaintext**: Specifically targets and maps LaTeX commands (e.g., `\alpha`, `\int`, `^2`) into standard readable Unicode (e.g., `α`, `∫`, `²`).
* **Live Preview**: Dual-pane interface that shows the raw Markdown output alongside a real-time rendered visual preview.
* **One-Click Copy**: Easily copy the generated Markdown directly to your clipboard.

## Architecture and Design
This project emphasizes rigorous functional programming principles, strict separation of IO from business logic, and a premium modern user interface. For detailed architectural guidelines, UI aesthetics, and conversion logic, please see the `specs/` directory:

1. [Architecture & Coding Standards](specs/architecture.md)
2. [UI & UX Design](specs/ui_design.md)
3. [LaTeX Conversion Logic](specs/latex_conversion.md)
4. [Deployment Guide](specs/deployment.md)

## Running Locally
Since this app is built with pure HTML, CSS, and JS:
1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Alternatively, serve via a local HTTP server like `python3 -m http.server 8000`.
