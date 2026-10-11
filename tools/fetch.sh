#!/usr/bin/env bash
# usage: bash tools/fetch.sh <dest> <url> [<dest> <url> ...]   (downloads signed Scenario CDN urls, following redirects)
while [ $# -ge 2 ]; do curl -sSL --retry 3 -o "$1" "$2" || echo "FAILED $1"; shift 2; done
