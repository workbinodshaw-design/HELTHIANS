import json
import os
import re

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

with open('index.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Base URL
BASE_URL = 'https://bookhealthians.in'

sitemap_urls = [
    f"<url><loc>{BASE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>"
]

def generate_page(category, item):
    slug = item['slug']
    
    if category == 'services':
        # Services go in root, e.g. /blood-test-at-home/
        url_path = f"/{slug}/"
        out_dir = f"{slug}"
    else:
        url_path = f"/{category}/{slug}/"
        out_dir = f"{category}/{slug}"

    canonical = f"{BASE_URL}{url_path}"
    sitemap_urls.append(f"<url><loc>{canonical}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")
    
    page = template
    
    # 1. Update Title
    page = re.sub(r'<title>.*?</title>', f'<title>{item["title"]}</title>', page)
    page = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{item["title"]}">', page)
    
    # 2. Update Description
    page = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{item["description"]}">', page)
    page = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{item["description"]}">', page)
    
    # 3. Update Canonical
    page = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical}">', page)
    page = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="{canonical}">', page)
    
    # 4. Update H1
    # Find <h1 class="hero-main-title">...</h1> and replace inner HTML
    h1_pattern = r'(<h1 class="hero-main-title">)(.*?)(</h1>)'
    page = re.sub(h1_pattern, rf'\1{item["h1"]}\3', page, flags=re.DOTALL)
    
    # Replace the hero description so the unique description is visible
    subtext_pattern = r'<p class="hero-description" data-i18n="hero_sub_1">.*?</p>'
    page = re.sub(subtext_pattern, f'<p class="hero-description">{item["description"]}</p>', page, flags=re.DOTALL)

    # 5. Schema replacement
    # We will just inject the specific FAQ schema for this page
    schema_pattern = r'<script type="application/ld\+json">.*?</script>'
    
    faq_schema_items = []
    for faq in item.get('faq', []):
        faq_schema_items.append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['a']
            }
        })
    
    custom_schema = {
      "@context": "https://schema.org",
      "@graph": [
          {
            "@type": "MedicalClinic",
            "name": "HealthiansAr Diagnostics",
            "url": canonical,
            "description": item["schemaDesc"],
            "image": f"{BASE_URL}/images/hero.jpg",
            "telephone": "+91-9044401435"
          }
      ]
    }
    
    if faq_schema_items:
        custom_schema["@graph"].append({
            "@type": "FAQPage",
            "mainEntity": faq_schema_items
        })
    
    schema_html = f'<script type="application/ld+json">\n{json.dumps(custom_schema, indent=2)}\n</script>'
    
    # Replace the FIRST schema block (which is the main one). We assume it's the only one or we replace all.
    # Actually, re.sub replaces all matches unless count is specified. Let's just replace the first one.
    page = re.sub(schema_pattern, schema_html, page, count=1, flags=re.DOTALL)
    
    # 6. Save File
    file_path = f"{out_dir}/index.html"
    ensure_dir(file_path)
    with open(file_path, 'w', encoding='utf-8') as out_f:
        out_f.write(page)
    print(f"Generated {file_path}")

for cat in ['tests', 'packages', 'locations', 'services']:
    for item in db.get(cat, []):
        generate_page(cat, item)

# Generate Sitemap
sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
sitemap_content += '\n'.join(sitemap_urls)
sitemap_content += '\n</urlset>'

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print("Generated sitemap.xml")
