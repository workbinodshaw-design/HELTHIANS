"""
Generate Sitemap Index + Child Sitemaps — exactly like Healthians.com format
Master: sitemap.xml (sitemapindex)
Children:
  1. sitemap-static.xml    -> Homepage + Core Service Landing Pages
  2. sitemap-locations.xml -> 28 City Landing Pages
  3. sitemap-tests.xml     -> 22 Diagnostic Test Pages
  4. sitemap-packages.xml  -> 10 Health Package Pages
  5. sitemap-articles.xml  -> 18 Health Articles & Guides
"""
import json
from datetime import datetime

BASE_URL = 'https://bookbloodtest.in'
TODAY = datetime.now().strftime('%Y-%m-%d')

with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

def make_urlset(urls):
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for u in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{u["loc"]}</loc>\n'
        xml += f'    <lastmod>{u.get("lastmod", TODAY)}</lastmod>\n'
        xml += f'    <changefreq>{u.get("changefreq","weekly")}</changefreq>\n'
        xml += f'    <priority>{u.get("priority","0.8")}</priority>\n'
        xml += '  </url>\n'
    xml += '</urlset>'
    return xml

# ── 1. Static & Core Services sitemap ─────────────────────────────────────────
static_urls = [
    {"loc": f"{BASE_URL}/", "lastmod": TODAY, "changefreq": "daily", "priority": "1.0"},
    {"loc": f"{BASE_URL}/blood-test-at-home/", "lastmod": TODAY, "changefreq": "weekly", "priority": "0.9"},
    {"loc": f"{BASE_URL}/diagnostic-tests-at-home/", "lastmod": TODAY, "changefreq": "weekly", "priority": "0.9"},
    {"loc": f"{BASE_URL}/pathology-lab-near-me/", "lastmod": TODAY, "changefreq": "weekly", "priority": "0.9"},
    {"loc": f"{BASE_URL}/full-body-checkup-at-home/", "lastmod": TODAY, "changefreq": "weekly", "priority": "0.9"}
]
with open('sitemap-static.xml', 'w', encoding='utf-8') as f:
    f.write(make_urlset(static_urls))
print(f"[OK] sitemap-static.xml     — {len(static_urls)} URLs (Homepage + Core Services)")

# ── 2. Locations sitemap ─────────────────────────────────────────────────────
loc_urls = []
for item in db.get('locations', []):
    loc_urls.append({
        "loc": f"{BASE_URL}/locations/{item['slug']}/",
        "lastmod": TODAY, "changefreq": "weekly", "priority": "0.85"
    })
with open('sitemap-locations.xml', 'w', encoding='utf-8') as f:
    f.write(make_urlset(loc_urls))
print(f"[OK] sitemap-locations.xml  — {len(loc_urls)} URLs (28 Cities)")

# ── 3. Tests sitemap ─────────────────────────────────────────────────────────
test_urls = []
for item in db.get('tests', []):
    test_urls.append({
        "loc": f"{BASE_URL}/tests/{item['slug']}/",
        "lastmod": TODAY, "changefreq": "weekly", "priority": "0.85"
    })
with open('sitemap-tests.xml', 'w', encoding='utf-8') as f:
    f.write(make_urlset(test_urls))
print(f"[OK] sitemap-tests.xml      — {len(test_urls)} URLs (22 Lab Tests)")

# ── 4. Packages sitemap ──────────────────────────────────────────────────────
pkg_urls = []
for item in db.get('packages', []):
    pkg_urls.append({
        "loc": f"{BASE_URL}/packages/{item['slug']}/",
        "lastmod": TODAY, "changefreq": "weekly", "priority": "0.9"
    })
with open('sitemap-packages.xml', 'w', encoding='utf-8') as f:
    f.write(make_urlset(pkg_urls))
print(f"[OK] sitemap-packages.xml   — {len(pkg_urls)} URLs (10 Health Packages)")

# ── 5. Articles sitemap ──────────────────────────────────────────────────────
art_urls = []
for item in db.get('articles', []):
    art_urls.append({
        "loc": f"{BASE_URL}/articles/{item['slug']}/",
        "lastmod": TODAY, "changefreq": "monthly", "priority": "0.8"
    })
with open('sitemap-articles.xml', 'w', encoding='utf-8') as f:
    f.write(make_urlset(art_urls))
print(f"[OK] sitemap-articles.xml   — {len(art_urls)} URLs (18 Health Guides)")

# ── 6. Master Sitemap Index ──────────────────────────────────────────────────
child_sitemaps = [
    {"loc": f"{BASE_URL}/sitemap-static.xml"},
    {"loc": f"{BASE_URL}/sitemap-locations.xml"},
    {"loc": f"{BASE_URL}/sitemap-tests.xml"},
    {"loc": f"{BASE_URL}/sitemap-packages.xml"},
    {"loc": f"{BASE_URL}/sitemap-articles.xml"},
]

index_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
index_xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for sm in child_sitemaps:
    index_xml += '  <sitemap>\n'
    index_xml += f'    <loc>{sm["loc"]}</loc>\n'
    index_xml += f'    <lastmod>{TODAY}</lastmod>\n'
    index_xml += '  </sitemap>\n'
index_xml += '</sitemapindex>'

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(index_xml)
print(f"\n[OK] sitemap.xml (INDEX)    — {len(child_sitemaps)} child sitemaps")

total = len(static_urls) + len(loc_urls) + len(test_urls) + len(pkg_urls) + len(art_urls)
print(f"\n============================================")
print(f"  DONE! Total URLs indexed: {total}")
print(f"  Master index: {BASE_URL}/sitemap.xml")
print(f"============================================")
