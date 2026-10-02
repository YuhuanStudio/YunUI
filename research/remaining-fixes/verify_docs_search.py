#!/usr/bin/env python3
"""HTTP regression checks for the docs route and search API on a local site."""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.parse
import urllib.request

BASE = "http://localhost:3941"


def get(path: str, locale: str | None = None) -> tuple[int, str]:
    headers = {"Cookie": f"NEXT_LOCALE={locale}"} if locale else {}
    req = urllib.request.Request(BASE + path, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            return response.status, response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8")


def search(query: str, **params: str) -> tuple[int, list[dict]]:
    values = {"query": query, **params}
    path = "/api/search?" + urllib.parse.urlencode(values)
    status, body = get(path)
    return status, json.loads(body) if body else []


for locale, expected_heading in [
    ("en", "Navbar"),
    ("zh-CN", "导航栏"),
    ("zh-TW", "導覽列"),
]:
    status, html = get("/docs/patterns/navbar", locale)
    assert status == 200, f"localized docs route returned {status} for {locale}"
    headings = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    assert headings, f"no h1 in rendered docs for {locale}"
    text = re.sub(r"<[^>]+>", "", headings[0])
    assert expected_heading in text, f"expected {expected_heading!r}, got {text!r}"

for query, expected_path in [
    ("navbar", "/docs/patterns/navbar"),
    ("导航栏", "/docs/patterns/navbar"),
    ("導覽列", "/docs/patterns/navbar"),
    ("按钮", "/docs/components/button"),
    ("按鈕", "/docs/components/button"),
]:
    status, results = search(query)
    assert status == 200, f"search {query!r} returned {status}"
    assert any(item.get("url") == expected_path for item in results), (
        f"search {query!r} did not return {expected_path}; got "
        f"{[item.get('url') for item in results]}"
    )

status, body = get("/api/search?" + urllib.parse.urlencode({"query": "navbar", "mode": "vector"}))
assert status == 400, f"unsupported vector search returned {status}, expected 400"
assert json.loads(body).get("error"), "vector-search rejection did not explain the error"

status, results = search("navbar", mode="unsupported")
assert status == 200 and results, "unknown mode should retain full-text fallback behavior"

status, _ = get("/docs/no-such-page")
assert status == 404, f"unknown docs route returned {status}, expected 404"

print("PASS: /docs/patterns/navbar renders English, zh-CN, and zh-TW headings")
print("PASS: navbar/导航栏/導覽列 and 按钮/按鈕 return their relevant pages")
print("PASS: mode=vector is rejected with HTTP 400; unknown mode falls back to full-text")
print("PASS: unknown documentation route returns HTTP 404")
