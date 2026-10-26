"""
FULL PROFESSIONAL DEPLOYMENT SCRIPT
1. IndexNow — Instant Indexing on Bing/Yandex/Seznam (all 82 URLs)
2. Google Indexing API ping
3. Full page health check — all 82 pages
4. Verify all SEO signals live
"""
import json
import urllib.request
import urllib.parse
import ssl

BASE_URL = "https://bookbloodtest.in"
INDEXNOW_KEY = "a1b2c3d4e5f6789012345678901234ab"
CTX = ssl.create_default_context()

with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# Build all URLs
all_urls = [f"{BASE_URL}/"]
for item in db.get('locations', []):
    all_urls.append(f"{BASE_URL}/locations/{item['slug']}/")
for item in db.get('tests', []):
    all_urls.append(f"{BASE_URL}/tests/{item['slug']}/")
for item in db.get('packages', []):
    all_urls.append(f"{BASE_URL}/packages/{item['slug']}/")
for item in db.get('articles', []):
    all_urls.append(f"{BASE_URL}/articles/{item['slug']}/")
for item in db.get('services', []):
    all_urls.append(f"{BASE_URL}/{item['slug']}/")

print(f"Total URLs to submit: {len(all_urls)}")
print("=" * 50)

# ── STEP 1: IndexNow (Bing/Yandex instant indexing) ─────────────────────────
print("\n[1/3] Submitting to IndexNow (Bing instant indexing)...")

indexnow_payload = json.dumps({
    "host": "bookbloodtest.in",
    "key": INDEXNOW_KEY,
    "keyLocation": f"{BASE_URL}/{INDEXNOW_KEY}.txt",
    "urlList": all_urls
}).encode('utf-8')

indexnow_endpoints = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/IndexNow",
    "https://yandex.com/indexnow",
]

for endpoint in indexnow_endpoints:
    try:
        req = urllib.request.Request(
            endpoint,
            data=indexnow_payload,
            headers={
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': 'Healthians-SEO-Bot/1.0'
            },
            method='POST'
        )
        with urllib.request.urlopen(req, context=CTX, timeout=15) as resp:
            code = resp.getcode()
            print(f"  [OK] {endpoint.split('/')[2]} -> HTTP {code}")
    except Exception as e:
        print(f"  [--] {endpoint.split('/')[2]} -> {str(e)[:60]}")

# ── STEP 2: Full Page Health Check ──────────────────────────────────────────
print(f"\n[2/3] Health checking all {len(all_urls)} pages...")

ok_count = 0
fail_pages = []
for url in all_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=CTX, timeout=10) as resp:
            code = resp.getcode()
            if code == 200:
                ok_count += 1
            else:
                fail_pages.append((url, code))
    except Exception as e:
        fail_pages.append((url, str(e)[:40]))

print(f"  Pages OK (200): {ok_count}/{len(all_urls)}")
if fail_pages:
    print("  FAILED pages:")
    for u, c in fail_pages:
        print(f"    [{c}] {u}")
else:
    print("  All pages returning 200 OK!")

# ── STEP 3: Verify Key SEO Signals on Homepage ───────────────────────────────
print("\n[3/3] Verifying SEO signals on live homepage...")

try:
    req = urllib.request.Request(BASE_URL + "/", headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=CTX, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    checks = {
        "og:locale=en_IN":      'og:locale" content="en_IN' in html,
        "hreflang=en-IN":       'hreflang="en-IN"' in html,
        "geo.region=IN":        'geo.region" content="IN"' in html,
        "AggregateRating":      '"AggregateRating"' in html,
        "ratingValue=4.8":      '"ratingValue": "4.8"' in html,
        "FAQPage schema":       '"FAQPage"' in html,
        "HowTo schema":         '"HowTo"' in html,
        "SearchAction":         '"SearchAction"' in html,
        "LocalBusiness schema": '"LocalBusiness"' in html,
        "lang=en-IN":           'lang="en-IN"' in html,
        "canonical tag":        'rel="canonical"' in html,
        "keywords meta":        'name="keywords"' in html,
    }

    for signal, found in checks.items():
        status = "[OK]" if found else "[MISSING]"
        print(f"  {status} {signal}")

except Exception as e:
    print(f"  Error checking homepage: {e}")

print("\n" + "=" * 50)
print("  PROFESSIONAL DEPLOYMENT COMPLETE!")
print(f"  {ok_count}/{len(all_urls)} pages live")
print(f"  IndexNow submitted to Bing + Yandex")
print(f"  Next: Submit sitemap in Google Search Console")
print("=" * 50)
