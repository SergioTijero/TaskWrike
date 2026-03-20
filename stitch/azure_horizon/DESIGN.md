# Design System Strategy: The Cognitive Sanctuary

This design system is engineered to transform the high-density environment of project management into a "Cognitive Sanctuary." By moving away from the rigid, grid-heavy "spreadsheet" aesthetics common in productivity tools, we prioritize clarity, tonal depth, and editorial sophistication. Our goal is to create an interface that feels less like a utility and more like a curated workspace.

## 1. Overview & Creative North Star

**Creative North Star: The Architectural Minimalist**
The design system rejects the "box-within-a-box" clutter of traditional Kanban boards. Instead, it treats the screen as a series of intentional architectural planes. We break the "template" look through:
*   **Intentional Asymmetry:** Using larger spacing scales for outer margins than internal gutters to create a focal point.
*   **Tonal Definition:** Replacing structural lines with soft shifts in background values.
*   **Typographic Authority:** Pairing the structural precision of Inter with the high-end, rounded character of Manrope for an editorial finish.

## 2. Colors & Surface Philosophy

The palette relies on a sophisticated range of cool grays and architectural blues to evoke trust and efficiency without the visual fatigue of high-contrast blacks.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. Separation must be achieved through background color shifts.
*   **The Board:** Use `surface` (#f8f9fb) as the base.
*   **The Columns:** Define columns using `surface-container-low` (#f1f4f7).
*   **The Cards:** Place cards using `surface-container-lowest` (#ffffff) to create a natural, "lifted" appearance without a single line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
*   **Layer 0 (Background):** `surface`.
*   **Layer 1 (Containers):** `surface-container` or `surface-container-high` for sidebars.
*   **Layer 2 (Floating/Interactive):** `surface-container-lowest` for task cards.

### The "Glass & Gradient" Rule
To add visual "soul," avoid flat execution for primary actions. Use subtle gradients for Hero CTAs (e.g., transitioning from `primary` to `primary-container`). For floating elements like task detail panels, utilize **Glassmorphism**: use `surface-container-lowest` at 85% opacity with a `16px` backdrop blur.

## 3. Typography: The Editorial Engine

This system uses a dual-typeface approach to balance character and utility.

*   **Manrope (Display & Headlines):** Used for board titles and high-level column headers. It provides a modern, premium feel that distinguishes the app from generic enterprise software.
*   **Inter (Title, Body & Labels):** The workhorse for task titles, descriptions, and metadata. Its high legibility at small sizes ensures that dense information remains scannable.

**Identity Hierarchy:**
*   **Headers:** `headline-sm` in Manrope conveys authority and structure.
*   **Task Titles:** `title-sm` in Inter Bold ensures the core information is the first thing a user sees.
*   **Metadata:** `label-md` using `on-surface-variant` provides secondary context without cluttering the card.

## 4. Elevation & Depth: Tonal Layering

We achieve hierarchy through "Tonal Layering" rather than traditional drop shadows or strokes.

*   **The Layering Principle:** Depth is inherent in the token names. A card (`surface-container-lowest`) naturally sits "above" a column (`surface-container-low`).
*   **Ambient Shadows:** For elements that truly float (e.g., a dragged card or a dropdown), use an extra-diffused shadow: `offset-y: 8px`, `blur: 24px`, using `on-surface` at 6% opacity. This mimics natural light rather than digital "glow."
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": the `outline-variant` token at **20% opacity**. Never use a 100% opaque border.
*   **Depth through Blur:** Use backdrop blurs on navigation overlays to keep the user’s context visible while focusing on the task at hand.

## 5. Components

### Kanban Task Cards
*   **Surface:** `surface-container-lowest`.
*   **Rounding:** `lg` (0.5rem) for a modern, approachable feel.
*   **Spacing:** Use `spacing-4` (0.9rem) for internal padding. 
*   **Constraint:** No dividers. Use `spacing-2` to separate task titles from tags.

### Column Headers
*   **Type:** `headline-sm` (Manrope).
*   **Visual:** Use a `primary` colored "dot" or a `surface-variant` background pill for task counts rather than brackets.

### Buttons
*   **Primary:** Background gradient (`primary` to `primary-dim`). Text: `on-primary`. Rounding: `md`.
*   **Secondary:** Background: `secondary-container`. Text: `on-secondary-container`. No border.

### Secure Login Forms
*   **Container:** `surface-container-highest` background for the form modal.
*   **Inputs:** `surface-container-lowest` with a "Ghost Border" (10% `outline`). Focus state uses a 2px `primary` bottom-border only to maintain editorial cleanliness.

### Chips (Tags)
*   **Status Chips:** Use `tertiary-container` with `on-tertiary-container` text. Keep rounding at `full`.

## 6. Do’s and Don’ts

### Do:
*   **Use White Space as a Tool:** Use `spacing-8` or `spacing-10` between columns to allow the eye to rest.
*   **Leverage Tonal Shifts:** Use `surface-dim` for "empty state" areas to clearly indicate non-interactivity.
*   **Maintain Typography Scale:** Stick strictly to the Manrope/Inter pairing to preserve the signature identity.

### Don’t:
*   **No "Boxy" Grids:** Avoid surrounding the entire Kanban board in a border. Let the `surface` background bleed to the edges of the window.
*   **No High-Contrast Shadows:** Never use pure black shadows; they look "cheap." Always tint shadows with the `on-surface` color.
*   **No Divider Overload:** If you feel the need for a line, try adding `spacing-4` of empty space instead. If it still feels messy, your information architecture is the problem, not the lack of a line.

---
**Director's Final Note:** This design system is about the "unseen" quality—the way the light grays and the breath between cards create a sense of calm. Trust the spacing scale; it is your most powerful tool.