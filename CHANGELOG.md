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

### Server changes
- Added `GET /api/reveal?url=…` endpoint used by `dynamic-content/02-fetch-injected` to simulate a network round-trip before a link is injected
