# Crawlground

A target range for evaluating web crawlers.

Crawlground hosts a structured set of test pages, each containing a single control — a button, a link, a form, a JavaScript redirect, content injected on hover, and so on. Behind every control sits a hidden marker URL. A crawler scores a test by reaching the marker URL through that control. The aggregate results page shows which controls each crawler could and could not navigate.

Crawlground is intentionally not a realistic web app. It is a fixed-difficulty obstacle course for tools like [ZAP](https://www.zaproxy.org/), Burp, or any custom crawler you want to measure.

Inspired by [security-crawl-maze](https://github.com/google/security-crawl-maze) and [WIVET](https://github.com/bedirhan/wivet).

## Quick start

### Node

```sh
npm install
npm start
# → http://localhost:3456
```

Override the port with `PORT=8080 npm start`.

### Docker

```sh
docker build -t crawlground .
docker run --rm -p 3456:3456 -v crawlground-scores:/app/data crawlground
```

### docker compose

```sh
docker compose up --build
```

The compose file uses a named volume (`scores`) for persistence, so scores survive `docker compose down`. Remove the volume to start fresh: `docker compose down -v`.

## How scoring works

Every test has two URLs:

- `/test/<category>/<id>` — the page containing the control under test.
- `/score/<category>/<id>` — the hidden marker. When this URL is reached (via the control), the test is recorded as scored.

The marker URL is not linked from anywhere else in the app. The only way to reach it is by exercising the control — clicking a button, submitting a form, triggering a JavaScript navigation, and so on. A crawler that exercises the control reaches the marker; a crawler that doesn't, doesn't.

Hits are recorded globally and persisted to `data/scores.json`. To start a fresh run, visit `/reset` (confirmation page) or `POST /reset`.

## Scoring multiple tools in one session

You can run several crawlers back-to-back and get a single combined report. Before each crawler run, POST to `/set-tool` to name the active tool and clear its previous scores:

```sh
# Before running ZAP Traditional Spider:
curl -s -X POST http://localhost:3456/set-tool \
     -H 'Content-Type: application/json' \
     -d '{"name": "ZAP Traditional Spider"}'

# ... run the crawler ...

# Before running ZAP AJAX Spider:
curl -s -X POST http://localhost:3456/set-tool \
     -H 'Content-Type: application/json' \
     -d '{"name": "ZAP AJAX Spider"}'

# ... run the crawler ...

# Fetch the combined report:
curl -s http://localhost:3456/results.json
# or
curl -s http://localhost:3456/results.yaml
# or in ZAP website format (see below):
curl -s http://localhost:3456/website-results.yaml
```

Each call to `/set-tool` resets the scores for that tool name and makes it the active tool. Scores from previously named tools are kept, so the final report covers all of them.

Before starting a multi-tool session, reset any leftover scores from previous runs:

```sh
curl -X POST http://localhost:3456/reset
```

When using Docker, the named volume persists `scores.json` across container restarts and rebuilds. If you want a completely clean slate, remove the volume:

```sh
docker volume rm crawlground-scores
```

The `/set-tool` endpoint is intentionally not linked anywhere in the site HTML so that crawlers do not visit it as part of their crawling.

## ZAP website report format

`/website-results.yaml` produces output in the same format used by the [ZAP website](https://www.zaproxy.org/) to publish crawler benchmark results. Name your tools to match the column names you want in the output — `standard`, `ajax`, and `client` reproduce the standard ZAP website layout:

```sh
curl -s -X POST http://localhost:3456/set-tool -H 'Content-Type: application/json' -d '{"name":"standard"}'
# ... run ZAP Traditional Spider ...

curl -s -X POST http://localhost:3456/set-tool -H 'Content-Type: application/json' -d '{"name":"ajax"}'
# ... run ZAP AJAX Spider ...

curl -s -X POST http://localhost:3456/set-tool -H 'Content-Type: application/json' -d '{"name":"client"}'
# ... run ZAP Client Spider ...

curl -s http://localhost:3456/website-results.yaml
```

Example output:

```yaml
section: Crawlground
target: localhost:3456
details:
  - path: /score/forms/01-get-form
    scheme: http
    standard: Pass
    ajax: FAIL
    client: Pass
  - path: /score/links/01-anchor-href
    scheme: http
    standard: Pass
    ajax: Pass
    client: FAIL
  # ...
tests: 10
passes: 4
standardPasses: 3
ajaxPasses: 2
clientPasses: 1
fails: 6
score: 40%
```

Tool names are converted to camelCase keys, so `"AJAX Spider"` becomes `ajaxSpider` and `ajaxSpiderPasses`. Tools with zero scores are omitted from the output.

The `target` field is taken from the HTTP `Host` header of the request, so it automatically reflects the hostname and port ZAP connected to. Override it with the `CRAWLGROUND_TARGET` env var. Override `section` with `CRAWLGROUND_SECTION`.

## Adding a test

Drop a file in `tests/<category>/`. The directory becomes the category, the filename (without `.js`) becomes the test ID. That's the entire registration step — the registry picks it up at startup and mounts the routes automatically.

```js
// tests/buttons/03-shadow-dom.js
module.exports = {
  name: 'Button inside shadow DOM',
  description: 'A button rendered inside an open shadow root.',
  render: ({ scoreUrl }) => `
    <div id="host"></div>
    <script>
      const root = document.getElementById('host').attachShadow({ mode: 'open' });
      const btn = document.createElement('button');
      btn.textContent = 'Click me';
      btn.onclick = () => { location.href = ${JSON.stringify(scoreUrl)}; };
      root.appendChild(btn);
    </script>
  `,
};
```

Restart the server. The test appears at `/test/buttons/03-shadow-dom`, scored at `/score/buttons/03-shadow-dom`, and shows up in `/category/buttons` and `/results`.

### Test module contract

A test file exports an object with:

| Field | Type | Required | Purpose |
|---|---|---|---|
| `name` | string | yes | Display name, shown on the test page and results table. |
| `description` | string | yes | One-line summary, shown on the test page. |
| `render({ scoreUrl, req })` | function | yes | Returns the HTML body for the test page. May also return `{ html, head }` if `<head>` content is needed (e.g. meta refresh). |
| `head({ scoreUrl, req })` | function | no | Returns extra HTML to inject into the page `<head>`. Use for `<meta http-equiv="refresh">` or `<link>` tags. |
| `scoreWhen(req)` | function | no | Return `false` to reject a hit (e.g. require a specific POST body). Default: any hit counts. |

Use `${JSON.stringify(scoreUrl)}` when embedding the marker URL inside a `<script>` block — it produces a properly quoted JavaScript string and avoids quoting bugs.

### Adding a category

Just create a new directory under `tests/`. The registry treats every directory under `tests/` as a category and lists it on the home page on the next restart.

## Endpoints

| Path | Method | What it does |
|---|---|---|
| `/` | GET | List of categories |
| `/category/:cat` | GET | Tests in a category, with scored/unscored badges |
| `/test/:cat/:id` | GET | The test page (the only page a crawler should care about) |
| `/score/:cat/:id` | GET, POST | Hidden marker — records a hit |
| `/results` | GET | Scoreboard (current tool) |
| `/results.json` | GET | Combined multi-tool report in JSON |
| `/results.yaml` | GET | Combined multi-tool report in YAML |
| `/website-results.yaml` | GET | Results in ZAP website format (see below) |
| `/set-tool` | POST | Set the active tool name and reset its scores — not linked in the UI |
| `/reset` | GET | Confirmation page |
| `/reset` | POST | Wipes all scores for all tools |

## Maintenance

- **Persistence.** Scores are kept in memory and snapshotted to `data/scores.json` shortly after each write. Delete the file or POST to `/reset` to start fresh.
- **Restarts pick up new tests.** The registry walks `tests/**` at startup, so restart the server after adding, removing, or editing test files. There is no hot reload by design — it keeps the scoring contract simple.
- **Docker rebuilds.** Rebuild after editing any source: `docker build -t crawlground .` or `docker compose up --build`. The Dockerfile copies `lib`, `views`, `public`, `tests`, and `server.js` explicitly, so a new top-level directory will not appear in the image until you add it to the Dockerfile.
- **Port.** Defaults to 3456. Override with the `PORT` env var (`PORT=8080 npm start`, or `-e PORT=8080` in Docker).
- **No telemetry, no auth.** Crawlground is meant to run on a trusted host that you point your crawler at. Don't expose it to the public internet.

## Project layout

```
server.js               Express app, route handlers
lib/
  registry.js           Walks tests/, builds the test index
  store.js              In-memory scores + JSON snapshot
views/                  EJS templates (index, category, test, results, scored, reset_confirm)
public/style.css        Single stylesheet
tests/                  One folder per category; one file per test
  buttons/
  links/
  forms/
  js-events/
  dynamic-content/
  navigation/
data/scores.json        Persisted score state (gitignored)
Dockerfile              Production image: node:22-alpine, non-root, ~80 MB
docker-compose.yml      Single-service bring-up with named volume
```

## Acknowledgments

Crawlground is heavily influenced by:

- Google's [security-crawl-maze](https://github.com/google/security-crawl-maze) — the marker-URL scoring approach.
- [WIVET](https://github.com/bedirhan/wivet) — the idea of grading crawlers against a fixed inventory of controls.
