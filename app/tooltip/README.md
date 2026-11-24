# Tooltip

Time box: 45 minutes. It starts as a design discussion, then becomes code. Talk through your design out loud, and draw state and callbacks on a whiteboard.

Architect a reusable tooltip component, then build a minimal version of your own design.

- The component is `Tooltip` in `Tooltip.tsx`, a named export.
- Usage: `<Tooltip content="Save your work"><button>Save</button></Tooltip>`.
- The tooltip text is a plain string. No rich content.

## Stage 1: write the design

Open `design.md` and fill in the sections in your own words. Do not read the later stages first, because the point is to decide the API yourself. Aim for a page or less. Cover:

- Props API: what does a consumer pass in?
- State: what does the component remember, and where does it live?
- Open and close triggers: what opens it, what closes it?
- Dismissal: how does a user get rid of it?
- Callbacks: what does the component tell its parent, and what does it leave out (no business logic inside)?

Then ask me (the grader) to review the design before you code.

### Follow-up questions

- Why not just use the `title` attribute?
- Controlled or uncontrolled open state? When would a consumer want to control it?
- What breaks on a touch screen?

## Stage 2: implement a minimal tooltip

Implement `Tooltip` in `Tooltip.tsx`. Your own design may differ in details, but these behaviors are required:

- `<Tooltip content="Hint"><button>Hover me</button></Tooltip>` renders the child as is. The tooltip is not in the DOM while closed.
- Hovering the child opens the tooltip: an element containing the content. Moving the pointer away closes it.
- Focusing the child (for example with Tab) opens it, and blurring closes it.
- Pressing Escape closes an open tooltip, even if the pointer is still over the child.
- The child's own event handlers (an `onClick` you passed) still work.

`page.tsx` has a demo you can try by hand.

### Follow-up questions

- Where does the Escape listener live, and when is it attached?
- What happens to your timers or listeners when the component unmounts?

## Stage 3: delay, placement prop and a callback

Extend your component with three optional props:

- `delayMs`: a number, default 0. Hovering opens the tooltip only after that many milliseconds. Moving away before then means it never opens. Focus opens immediately, ignoring the delay.
- `onOpenChange`: called with `true` when the tooltip opens and `false` when it closes. It is not called on mount.
- `placement`: `"top"` or `"bottom"`, default `"top"`. The tooltip element gets `data-placement` set to the value.

### Follow-up questions

- What happens to a pending delay timer when the pointer leaves, or the component unmounts?
- Is `onOpenChange` the right shape for a callback, or would you also pass the event? Why?

## Bonus: accessibility and CSS

- The tooltip element has `role="tooltip"`.
- While open, the child itself (not a wrapper) is described by the tooltip: it has `aria-describedby` pointing at the tooltip's id. While closed it has none.
- Two tooltips on a page do not share ids.
- Position the tooltip with CSS according to `placement`: above the child for `"top"`, below it for `"bottom"`.
- In `design.md`, fill in the Positioning and Accessibility sections too.

### Follow-up questions

- Why does `aria-describedby` go on the child and not on a wrapper?
- How would the tooltip flip to the other side near the edge of the screen?
