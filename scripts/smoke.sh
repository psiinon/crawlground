#!/usr/bin/env bash
# Smoke test for a running Crawlground instance.
# Usage: BASE=http://localhost:3456 bash scripts/smoke.sh
set -euo pipefail

BASE="${BASE:-http://localhost:3456}"

echo "Waiting for $BASE to respond..."
for i in $(seq 1 60); do
  if curl -fsS "$BASE/" > /dev/null 2>&1; then
    echo "  up after ${i} attempts"
    break
  fi
  if [ "$i" = "60" ]; then
    echo "FAIL: server did not respond at $BASE after 30s"
    exit 1
  fi
  sleep 0.5
done

echo "Checking pages render..."
curl -fsS "$BASE/" > /dev/null
curl -fsS "$BASE/category/buttons" > /dev/null
curl -fsS "$BASE/test/buttons/01-html-button" > /dev/null
curl -fsS "$BASE/results" > /dev/null

echo "Resetting state..."
curl -fsS -X POST -d "confirm=RESET" "$BASE/reset" > /dev/null

TOTAL=$(curl -fsS "$BASE/results.json" | jq -r '.summary.total')
if [ "$TOTAL" -lt 10 ]; then
  echo "FAIL: expected at least 10 tests loaded, got $TOTAL"
  exit 1
fi
echo "  ${TOTAL} tests registered"

echo "Scoring via GET marker..."
curl -fsS "$BASE/score/buttons/01-html-button" > /dev/null

echo "Scoring via POST marker..."
curl -fsS -X POST -d "payload=test" "$BASE/score/forms/02-post-form" > /dev/null

SCORED=$(curl -fsS "$BASE/results.json" | jq -r '.summary.scored')
if [ "$SCORED" != "2" ]; then
  echo "FAIL: expected 2 scored, got $SCORED"
  curl -s "$BASE/results.json" | jq .
  exit 1
fi
echo "  2/2 expected markers scored"

echo "Reset clears state..."
curl -fsS -X POST -d "confirm=RESET" "$BASE/reset" > /dev/null
SCORED=$(curl -fsS "$BASE/results.json" | jq -r '.summary.scored')
if [ "$SCORED" != "0" ]; then
  echo "FAIL: expected 0 scored after reset, got $SCORED"
  exit 1
fi
echo "  reset wiped scores"

echo
echo "Smoke test passed."
