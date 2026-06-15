# Accessibility changes — toggles dash

Target: WCAG 2.1 AA. Changes made 2026-06-15.

---

## `toggles/index.tsx`

### All toggle content was outside `<main>` (critical)
The `<main>` landmark closed before any of the `<Section>` components, meaning all toggle controls were outside the page's main landmark. Screen reader users navigating by landmarks would skip over every toggle. Fixed by extending `<main>` to wrap the full page body including all sections.

### Sections were unlabelled
Each `<Section>` is a `<section>` element. Unnamed sections appear in the accessibility tree but don't help users navigate. Added `aria-labelledby` pointing to each section's `<h2>` anchor ID (`general`, `permanent`, `wip`, `staging`, `ab-tests`, `modes`).

### Conditionally rendered live region for search results
`{searchQuery && <p role="status" ...>}` inserts a live region with content already inside it. Many screen readers (particularly JAWS) only announce live region changes if the region was already in the DOM before the content appeared. Changed to always render the `<p role="status">` with its text conditionally set inside it.

### Emoji in `aria-live` announcement strings
Status messages sent to `role="status"` live regions contained emoji (`✅`, `🔵`, `❌`, `🔄`). Screen readers announce these verbatim (e.g. "check mark button Feature flag enabled"). Stripped all emoji from the message strings.

### `<TableOfContentsList>` list semantics in Safari
`<ul>` with `list-style: none` loses its list role in Safari + VoiceOver. Added `role="list"` to restore it.

---

## `ListOfToggles/index.tsx`

### Anchor links had identical accessible names
All section anchor links used `aria-label="Link to this section"`. A screen reader's links list would show six identical entries. Changed to `aria-label={`Link to ${title} section`}`.

### Redundant `aria-labelledby` on `<h3>` masked accessible name
`aria-labelledby` on a heading pointing to its own child span overrides the heading's computed name, stripping out the `CopyLinkIcon` button from it. Since the heading's text content is already its accessible name, the attribute was redundant. Removed it.

### `cursor: help` on a non-interactive element
The `<h3>` had `cursor: 'help'` set, implying it was interactive. The actual hover target is the `HeadingWrapper` div in `ToggleDates`. Removed.

### `(Public override)` text used a colour that may fail contrast
The text used `tokens.colors.text.disabled`. Disabled-palette colours are designed for inactive controls and commonly fail the 4.5:1 contrast ratio for normal text. This text conveys real information (why the switch can't be changed), so it should meet contrast requirements. Changed to `tokens.colors.text.secondary`.

---

## `ListOfToggles.ToggleDates.tsx`

### Tooltip was hover-only — completely keyboard inaccessible
Only `onMouseEnter`/`onMouseLeave` handlers existed. Keyboard users had no way to access the created/activated date information. Added `onFocus`/`onBlur` handlers to show the tooltip on focus as well.

### Tooltip content was invisible to screen readers
The tooltip `<div>` had no `role` or `id`, and the wrapper had no `aria-describedby`. The tooltip was hidden from the accessibility tree via `visibility: hidden`. Added `role="tooltip"` and `id` (via `useId()`) to the tooltip element, and `aria-describedby` on the wrapper pointing to it.

### No `prefers-reduced-motion` guard on tooltip transition
The `opacity` transition on the tooltip was not suppressed for users with motion sensitivity. Added `@media (prefers-reduced-motion: reduce) { transition: none; }`.

---

## `ListOfToggles.ToggleSwitch.tsx`

### Disabled switches were removed from tab order
`tabIndex={disabled ? -1 : 0}` meant keyboard users could not focus a disabled (public) switch. They therefore could not discover the "(Public override)" explanation shown next to it. Changed to always `tabIndex={0}`. The existing `aria-disabled="true"` correctly signals the control cannot be activated.

---

## `ListOfToggles.StatusBadge.tsx`

### `role="status"` on a static badge is semantically wrong
`role="status"` is a live region role — it signals to screen readers that dynamic announcements may appear here. Applying it to a static badge creates an implicit `aria-live="polite"` region on a decorative element. The visible text ("Public" / "Internal") is already read directly; no role is needed. Removed `role="status"` and `aria-label`.

---

## `ListOfToggles.CopyLinkIcon.tsx`

### SVG not hidden from accessibility tree
The `<svg>` inside the button was not marked `aria-hidden="true"`. The button already has a complete `aria-label`, so the SVG was redundant in the accessibility tree and could cause duplicate announcements. Added `aria-hidden="true"`.

### Live region for "Copied!" was inserted already populated
`{copied && <CopiedBadge role="status" aria-live="polite">Copied!</CopiedBadge>}` conditionally creates the live region with its text already inside. JAWS and some versions of NVDA do not announce live regions that appear already populated. Changed to always render an empty `<span role="status" aria-live="polite">` and toggle the text inside it.

### No `prefers-reduced-motion` guard on fade animation
The `@keyframes fade-in-out` animation had no override for `prefers-reduced-motion: reduce`. Added a media query to disable the animation for affected users.

---

## `toggles.styles.tsx`

### `ResetButton` hover transform not guarded for reduced motion
The `transform: translateY(-1px)` shift on hover had no `prefers-reduced-motion` guard. Added `@media (prefers-reduced-motion: reduce) { transform: none; box-shadow: none; }` inside the `:hover` rule.
