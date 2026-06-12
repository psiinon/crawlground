# Changelog

## 2026-06-12

### New tests

**Forms**
- `forms/03-image-input` — `<input type="image">` submit button; crawlers that only trigger `<button>` elements will miss this
- `forms/04-select-field` — GET form with a `<select>` dropdown
- `forms/05-fetch-post` — AJAX `fetch()` POST with no `<form>` element; crawlers must execute JS and handle the async submission
- `forms/06-radio-buttons` — GET form with radio button inputs

**Frames** *(new category)*
- `frames/01-iframe-srcdoc` — score link embedded inside `<iframe srcdoc="...">` ; not present in the outer document tree
- `frames/02-shadow-dom` — score link appended to an open shadow root via `attachShadow()`; not present in the main DOM

**Dynamic content**
- `dynamic-content/02-fetch-injected` — link injected after a `fetch()` network round-trip; crawlers must wait for network activity to settle, not just a fixed timer
- `dynamic-content/03-intersection-observer` — link injected by an `IntersectionObserver` when a sentinel element scrolls into the viewport; crawlers must scroll the page to trigger it
- `dynamic-content/04-details-toggle` — link injected when a `<details>` disclosure widget is opened via its `toggle` event

**JS events**
- `js-events/02-onclick-prevent-default` — `<a href="#">` whose `onclick` calls `event.preventDefault()` then navigates via `window.location`; following the `href` directly does not score
- `js-events/03-focus-injected` — link injected when an input field receives focus
- `js-events/04-css-hover-dropdown` — single-level CSS `:hover` dropdown; score link is in the DOM but hidden, revealed only on hover
- `js-events/05-multilevel-dropdown` — two-level JS dropdown; click opens the first menu, mouseenter on a submenu item injects and reveals the score link; link is not in the initial DOM

**Links**
- `links/03-noscript` — score link inside `<noscript>`; only reachable by a crawler with JS disabled
- `links/04-svg-anchor` — score link as an `<a>` element inside inline SVG

**Navigation**
- `navigation/03-history-push-state` — clicking a nav button calls `history.pushState()` and swaps the page content; score link only appears in the rendered second view
- `navigation/04-hash-routing` — `<a href="#/score">` with a `hashchange` listener that maps the fragment to the real score URL
- `navigation/05-window-replace` — JS navigates via `window.location.replace()` after a 1 s delay

**JS events** *(continued)*
- `js-events/06-dialog-modal` — button calls `showModal()` to open a `<dialog>`; score link is inside and not reachable without opening it
- `js-events/07-dblclick` — `dblclick` navigates to the score URL; a single click does nothing
- `js-events/08-keydown-enter` — `<div role="link" tabindex="0">` navigates on Enter keydown; crawlers must focus the element and dispatch a keyboard event
- `js-events/09-contextmenu` — score link injected on `contextmenu` (right-click); crawlers must simulate a right-click to discover it

**Forms** *(continued)*
- `forms/07-checkboxes` — GET form with checkbox inputs
- `forms/08-formaction-override` — one submit button uses `formaction` to override the parent `<form action>`; crawlers must recognise per-button overrides
- `forms/09-js-form-submit` — `form.requestSubmit()` fires after a 1 s timer with no submit button; crawlers must detect the programmatic submission
- `forms/10-multistep-wizard` — two-step wizard; step 2 is hidden until step 1 is submitted, score URL only reached on the final submission

**JS events** *(continued)*
- `js-events/06-dialog-modal` — button calls `showModal()` to open a `<dialog>`; score link is inside and not reachable without opening it
- `js-events/07-dblclick` — `dblclick` navigates to the score URL; a single click does nothing
- `js-events/08-keydown-enter` — `<div role="link" tabindex="0">` navigates on Enter keydown; crawlers must focus the element and dispatch a keyboard event
- `js-events/09-contextmenu` — score link injected on `contextmenu` (right-click); crawlers must simulate a right-click to discover it

**Forms** *(continued)*
- `forms/07-checkboxes` — GET form with checkbox inputs
- `forms/08-formaction-override` — one submit button uses `formaction` to override the parent `<form action>`; crawlers must recognise per-button overrides
- `forms/09-js-form-submit` — `form.requestSubmit()` fires after a 1 s timer with no submit button; crawlers must detect the programmatic submission
- `forms/10-multistep-wizard` — two-step wizard; step 2 is hidden until step 1 is submitted, score URL only reached on the final submission

**Dynamic content** *(continued)*
- `dynamic-content/05-sse-injected` — page opens an `EventSource` connection; server pushes the score URL as an SSE event ~250 ms later and the client injects the link
- `dynamic-content/06-websocket-injected` — page opens a `WebSocket` connection; server pushes the score URL as a message ~250 ms later and the client injects the link; uses `wss:` automatically over HTTPS
- `dynamic-content/07-load-more` — initial list has 3 items; clicking "Load more" appends a second batch containing the score link; button hides itself afterwards

**JS events** *(continued)*
- `js-events/10-tab-panel` — three-tab panel where content is injected on click; inactive tabs have nothing in the DOM; score link only rendered when Tab 2 is selected
- `js-events/11-popover` — native Popover API; score link injected via the `toggle` event when the popover opens, absent from the initial DOM

### Server changes
- Added `GET /api/reveal?url=…` endpoint used by `dynamic-content/02-fetch-injected` to simulate a network round-trip before a link is injected
- Added `GET /api/sse-reveal?url=…` endpoint — sends a single SSE `message` event after 250 ms then closes the stream
- Added `WebSocket /api/ws-reveal?url=…` endpoint — sends a single JSON message after 250 ms then closes; requires refactoring `app.listen` to an explicit `http.createServer` so the HTTP server can be shared with the WS upgrade handler
- Added `ws` package dependency
