# Design System Specification

## 1. Overview & Creative North Star: "The Intellectual Sanctuary"

This design system transcends the typical "utility-first" student portal to create an **Intellectual Sanctuary**. The goal is to move away from the cluttered, high-stress environments of traditional academia toward a space that feels calm, authoritative, and frictionless.

**The Creative North Star** is defined by **Soft Editorial Minimalism**. We reject the "boxed-in" feeling of legacy portals. Instead of rigid grids and heavy borders, we use expansive white space, intentional asymmetry in information density, and sophisticated tonal layering. This system treats student data not as a spreadsheet, but as a premium editorial layout—prioritizing focus, clarity, and the quiet dignity of higher education.

---

## 2. Colors & Surface Architecture

The palette is rooted in deep academic blues and atmospheric grays, utilized to create a sense of vastness and depth.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background shifts. High-end design is felt through transitions, not seen through lines.
- Use `surface-container-low` for secondary background regions.
- Use `surface-container-lowest` (#ffffff) for primary content containers to make them "pop" against the page.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base Layer:** `surface` (#f8f9fa) — The foundation.
*   **In-Page Sections:** `surface-container` (#edeeef) — For grouping related modules.
*   **Primary Interaction Cards:** `surface-container-lowest` (#ffffff) — The "highest" point of focus.

### The "Glass & Gradient" Rule
To elevate the "Soft Blue" request:
*   **CTAs:** Use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` (#003f87) to `primary_container` (#0056b3). This prevents the UI from looking flat and adds a "jewel-like" quality to actions.
*   **Floating Elements:** Overlays and dropdowns should utilize a **Glassmorphism effect**: 80% opacity of the `surface` color with a 20px `backdrop-blur`.

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** This geometric sans-serif provides a modern, architectural feel. 
    *   *Usage:* Use `display-lg` for dashboard greetings and `headline-sm` for card titles. Keep tracking (letter-spacing) tight (-0.02em) for large headers to maintain an editorial "locked-in" look.
*   **Body & Labels (Inter):** The workhorse for academic data.
    *   *Usage:* Use `body-md` for general content. Inter’s high x-height ensures readability in dense data tables or grade reports.

**Hierarchy Note:** Always maintain a high contrast between headlines and body text. If a headline is `headline-md`, the supporting text should be `body-sm` to create a rhythmic "Lead & Follow" visual cadence.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often a crutch for poor layout. This system prioritizes **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card (Pure White) on top of a `surface-container-low` background. This creates a natural "lift" that feels built-in, not tacked-on.
*   **Ambient Shadows:** Where floating state is required (e.g., a dragged card), use an extra-diffused shadow:
    *   `box-shadow: 0 12px 32px -8px rgba(0, 63, 135, 0.08);` (Note the blue tint in the shadow to match the `primary` hue).
*   **The "Ghost Border" Fallback:** If a separator is required for accessibility, use `outline_variant` at **15% opacity**. It should be felt as a change in texture, not a hard line.

---

## 5. Components

### Sidebar Navigation
Avoid the "clunky bar" look. The sidebar should be `surface` color, using an active state that is a `secondary_container` pill with `primary` text. Use `xl` (1.5rem) rounded corners for the active indicator to provide a soft, organic feel.

### Data Tables
**Forbid the use of vertical and horizontal divider lines.** 
*   **Separation:** Use `surface-container-low` on every second row (Zebra striping) or simply utilize vertical white space (16px padding between rows).
*   **Header:** Use `label-md` in `on_surface_variant` for headers to keep them subordinate to the actual student data.

### Card-Based Summaries
*   **Radius:** Always use `lg` (1rem / 16px) for cards.
*   **Content:** Overlap elements slightly. For example, a student’s profile image can "break" the top padding of a card to create a high-end, layered aesthetic.

### Form Inputs
*   **Style:** Background-filled using `surface_container_high`. No border in default state.
*   **Focus State:** Transition to a `ghost-border` (outline @ 40%) with a subtle `primary` glow.
*   **Corner Radius:** Use `DEFAULT` (0.5rem / 8px) for a more technical, precise feel than the cards.

### Academic Progress Chips
Use `tertiary_container` for "In Progress" and `secondary_container` for "Completed." Use high-contrast text (`on_tertiary_container`) to ensure these small elements are immediately legible.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a structural element. If an interface feels crowded, increase the padding, don't add a border.
*   **DO** use "Primary" colors sparingly. The portal should feel calm; blue is for action and emphasis, not for every header.
*   **DO** use `xl` (1.5rem) rounding for large containers and `sm` (0.25rem) for small elements like checkboxes to create a "nested" visual language.

### Don't
*   **DON’T** use pure black (#000000) for text. Use `on_surface` to maintain the soft academic aesthetic.
*   **DON’T** use standard "Drop Shadows." If it looks like a default Photoshop effect, it is too heavy.
*   **DON’T** crowd the sidebar. If there are many links, use `surface-dim` to create a "Folder" nesting effect rather than a long, flat list.