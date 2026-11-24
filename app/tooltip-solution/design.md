# Tooltip design

## Props API

`content: string` is the tooltip text. `children` is a single element, the trigger, which the component clones so it can attach handlers and ARIA to the element itself instead of a wrapper. Optional: `placement` ("top" or "bottom", default "top"), `delayMs` (hover delay, default 0) and `onOpenChange(open)`.

## State

Two booleans, `hovered` and `focused`, because hover and focus are independent sources. `open` is derived: `hovered || focused`. A ref holds the pending delay timer, because changing it should not re-render. A generated id links the trigger to the tooltip.

## Open and close triggers

Open on pointer enter (after `delayMs`) and on focus (immediately). Close on pointer leave and on blur. Leaving before the delay cancels the pending open. Keyboard users get the same information as mouse users because focus opens it too.

## Dismissal

Escape closes it, even if the pointer is still over the trigger. The Escape listener is attached to the document only while the tooltip is open, since focus might not be on the trigger when it was opened by hover.

## Callbacks

`onOpenChange(open)` reports the change to the parent and is not called on mount. The component contains no business logic: it does not know what the trigger does, and the trigger's own `onClick`, `onFocus` and similar handlers keep working because they are called before the tooltip's own.

## Bonus: Positioning

Absolutely positioned relative to an inline wrapper, above or below the trigger and centered, chosen by `placement`. Exposed as `data-placement` so styles and tests can read it. Running out of room would need measuring the trigger and viewport and flipping the side, or a library such as floating-ui, which I would name instead of rebuilding.

## Bonus: Accessibility

The tooltip has `role="tooltip"` and an id. While open, the trigger gets `aria-describedby` pointing at it, so assistive technology reads the text as the trigger's description. Nothing is added while closed. It is reachable by keyboard because focus opens it.
