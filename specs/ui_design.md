# UI and UX Design Specifications

## Visual Identity

- **Styling Paradigm**: Vanilla CSS. Avoid utility-first frameworks like Tailwind unless otherwise needed. Rely on CSS variables for consistent theming.

## Layout

- A **Split-Pane Layout** taking up exactly `100vh` and `100vw`.
- **Header**: Contains the project title and a global "Copy Markdown" primary call-to-action button.
- **Left Pane (Input)**: A content-editable area or hidden textarea overlay that captures the user's paste. It displays the converted Markdown code with syntax highlighting (if possible) or clean monospace formatting.
- **Right Pane (Preview)**: A live-rendering panel that takes the Markdown and displays rich HTML. This allows the user to immediately verify that the formatting (such as bolding and tables) survived the paste event.

## Interactions

- **Micro-animations**: Smooth hover transitions on buttons (`box-shadow` expands, color brightens).
- **Feedback**: When a user pastes or copies, display a brief, elegant toast notification ("Pasted successfully!", "Copied to clipboard!").
