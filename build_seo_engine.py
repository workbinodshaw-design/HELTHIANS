import json
import os
import re

BASE_URL = 'https://bookbloodtest.in'

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# 1. Build the Master Internal Linking Block (Compact, Collapsible & Tabbed)
def build_internal_links_html():
    loc_links = "".join([f'<a href="/locations/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n' for item in db.get('locations', [])])
    test_links = "".join([f'<a href="/tests/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n' for item in db.get('tests', [])])
    pkg_links = "".join([f'<a href="/packages/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n' for item in db.get('packages', [])])
    srv_links = "".join([f'<a href="/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n' for item in db.get('services', [])])
    art_links = "".join([f'<a href="/articles/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n' for item in db.get('articles', [])])

    html = f'''
  <!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY (COMPACT COLLAPSIBLE TABS) -->
  <section class="seo-directory-section">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">
      
      <!-- Collapsible Header Bar -->
      <div class="seo-dir-header-bar" onclick="toggleSeoDirectory()" id="seo-dir-header" title="Click to view all diagnostic tests & cities directory">
        <div class="seo-dir-header-title">
          <span style="background: #E6F3F5; color: #00A0A8; font-weight: 700; font-size: 0.76rem; padding: 3px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px;">Directory</span>
          <span style="font-size: 1.05rem; color: #0F172A; font-weight: 700;">Explore Blood Tests, Packages &amp; Cities Across India</span>
        </div>
        <button type="button" id="seo-dir-toggle-btn" style="background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F766E; font-weight: 700; font-size: 0.82rem; padding: 6px 16px; border-radius: 50px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); font-family: inherit;">
          <span id="seo-dir-toggle-text">Explore All 82 Categories</span>
          <span id="seo-dir-toggle-arrow" style="font-size: 0.7rem; transition: transform 0.3s; display: inline-block;">▼</span>
        </button>
      </div>

      <!-- Collapsible Content Wrapper (Clean & Compact) -->
      <div id="seo-directory-content" style="display: none; margin-top: 18px; border-top: 1px dashed #CBD5E1; padding-top: 18px;">
        
        <!-- Category Tab Buttons -->
        <div class="seo-tab-nav" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
          <button type="button" class="seo-tab-btn active" data-tab="cities" onclick="switchSeoTab('cities')">📍 Cities ({len(db.get('locations', []))})</button>
          <button type="button" class="seo-tab-btn" data-tab="tests" onclick="switchSeoTab('tests')">🧪 Blood Tests ({len(db.get('tests', []))})</button>
          <button type="button" class="seo-tab-btn" data-tab="packages" onclick="switchSeoTab('packages')">🩺 Packages &amp; Services ({len(db.get('packages', [])) + len(db.get('services', []))})</button>
          <button type="button" class="seo-tab-btn" data-tab="articles" onclick="switchSeoTab('articles')">📚 Health Guides ({len(db.get('articles', []))})</button>
        </div>

        <!-- Panes with Compact Chips -->
        <div id="tab-cities" class="seo-tab-pane" style="display: flex; flex-wrap: wrap; gap: 8px;">
          {loc_links}
        </div>

        <div id="tab-tests" class="seo-tab-pane" style="display: none; flex-wrap: wrap; gap: 8px;">
          {test_links}
        </div>

        <div id="tab-packages" class="seo-tab-pane" style="display: none; flex-wrap: wrap; gap: 8px;">
          {pkg_links}
          {srv_links}
        </div>

        <div id="tab-articles" class="seo-tab-pane" style="display: none; flex-wrap: wrap; gap: 8px;">
          {art_links}
        </div>
      </div>

    </div>
  </section>

  <script>
    function toggleSeoDirectory() {{
      const content = document.getElementById('seo-directory-content');
      const arrow = document.getElementById('seo-dir-toggle-arrow');
      const text = document.getElementById('seo-dir-toggle-text');
      if (!content) return;
      if (content.style.display === 'none' || !content.style.display) {{
        content.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        if (text) text.innerText = 'Collapse Directory';
      }} else {{
        content.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        if (text) text.innerText = 'Explore All 82 Categories';
      }}
    }}

    function switchSeoTab(tabId) {{
      const panes = document.querySelectorAll('.seo-tab-pane');
      const btns = document.querySelectorAll('.seo-tab-btn');
      panes.forEach(p => p.style.display = 'none');
      btns.forEach(b => b.classList.remove('active'));
      
      const targetPane = document.getElementById('tab-' + tabId);
      if (targetPane) targetPane.style.display = 'flex';
      
      const activeBtn = document.querySelector('[data-tab="' + tabId + '"]');
      if (activeBtn) activeBtn.classList.add('active');
    }}
  </script>
'''
    return html

internal_links_block = build_internal_links_html()

# Read the current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Replace existing internal linking block in index.html if present, or add before footer
new_footer_wrap = f"{internal_links_block}\n</footer>"

if '<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY' in template:
    template = re.sub(r'<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY.*?</footer>', new_footer_wrap, template, flags=re.DOTALL)
elif '<!-- SEO INTERNAL LINKING BLOCK -->' in template:
    template = re.sub(r'<!-- SEO INTERNAL LINKING BLOCK -->.*?</footer>', new_footer_wrap, template, flags=re.DOTALL)
else:
    template = template.replace('</footer>', f"{internal_links_block}\n</footer>")

# Save updated index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(template)
print("Updated index.html with Enterprise Internal Linking Directory.")

# URL tracking for dynamic XML sitemap
sitemap_entries = [
    {"loc": f"{BASE_URL}/", "priority": "1.0", "changefreq": "daily"}
]

total_pages_generated = 0

def generate_seo_page(category, item):
    global total_pages_generated
    slug = item['slug']
    name = item['name']
    title = item['title']
    desc = item['description']
    h1 = item['h1']

    if category == 'services':
        url_path = f"/{slug}/"
        out_dir = f"{slug}"
        cat_label = "Services"
        cat_url = "/"
        priority = "0.9"
    elif category == 'packages':
        url_path = f"/packages/{slug}/"
        out_dir = f"packages/{slug}"
        cat_label = "Health Packages"
        cat_url = "/#packagesFilter"
        priority = "0.9"
    elif category == 'tests':
        url_path = f"/tests/{slug}/"
        out_dir = f"tests/{slug}"
        cat_label = "Diagnostic Tests"
        cat_url = "/#packagesFilter"
        priority = "0.85"
    elif category == 'locations':
        url_path = f"/locations/{slug}/"
        out_dir = f"locations/{slug}"
        cat_label = "Locations"
        cat_url = "/"
        priority = "0.85"
    elif category == 'articles':
        url_path = f"/articles/{slug}/"
        out_dir = f"articles/{slug}"
        cat_label = "Health Guides"
        cat_url = "/"
        priority = "0.8"

    canonical = f"{BASE_URL}{url_path}"
    sitemap_entries.append({"loc": canonical, "priority": priority, "changefreq": "weekly"})

    page = template

    # 1. Update Title and OG Title
    page = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', page)
    page = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', page)
    page = re.sub(r'<meta name="twitter:title" content=".*?">', f'<meta name="twitter:title" content="{title}">', page)

    # 2. Update Meta Description and OG Description
    page = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', page)
    page = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{desc}">', page)
    page = re.sub(r'<meta name="twitter:description" content=".*?">', f'<meta name="twitter:description" content="{desc}">', page)

    # 3. Update Canonical and OG URL
    page = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical}">', page)
    page = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="{canonical}">', page)

    # 4. Update Hero H1 and Subtext
    h1_replacement = f'<span class="title-navy">{h1}</span>'
    page = re.sub(r'(<h1 class="hero-main-title">)(.*?)(</h1>)', rf'\1{h1_replacement}\3', page, flags=re.DOTALL)
    page = re.sub(r'<p class="hero-description".*?>.*?</p>', f'<p class="hero-description">{desc}</p>', page, flags=re.DOTALL)

    # 5. Pre-fill Lead Form for Locations or Pre-select Package
    if category == 'locations':
        city_name = item.get('state', item['name'])
        # Pre-fill value in lead-city input
        page = re.sub(r'(id="lead-city" name="city"[^>]*)(>)', rf'\1 value="{item["name"]}"\2', page)
    elif category in ['tests', 'packages']:
        # Show selected package box and set title
        page = page.replace('id="selected-package-box" style="display:none;', f'id="selected-package-box" style="display:flex;')
        page = page.replace('<strong id="package-title-text" style="font-weight:700;">Full Body Checkup</strong>', f'<strong id="package-title-text" style="font-weight:700;">{name}</strong>')
        # Inject script to set currentSelectedPackage
        init_pkg_script = f'<script>document.addEventListener("DOMContentLoaded", function() {{ if(typeof currentSelectedPackage !== "undefined") {{ currentSelectedPackage = "{name}"; }} }});</script>'
        page = page.replace('</body>', f'{init_pkg_script}\n</body>')

    # 6. Build the Rich SEO Details Section
    fasting_val = item.get('fasting', 'Fasting instructions provided upon booking')
    turnaround_val = item.get('turnaround', 'Reports in 12-24 Hours on WhatsApp')
    sample_val = item.get('sampleType', 'Blood Sample (Doorstep Collection)')
    overview_text = item.get('overview', desc)

    highlights_html = ""
    for pt in item.get('keyPoints', []):
        highlights_html += f"<li>{pt}</li>\n"

    seo_details_html = f'''
    <!-- =====================================================================
         CLINICAL & SERVICE DETAILS SECTION ({name})
         ===================================================================== -->
    <section class="seo-details-section">
      <div class="container" style="max-width: 1040px; margin: 0 auto;">
        
        <!-- Breadcrumb Navigation -->
        <nav class="seo-breadcrumb-bar" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span class="seo-breadcrumb-sep">/</span>
          <a href="{cat_url}">{cat_label}</a>
          <span class="seo-breadcrumb-sep">/</span>
          <span style="color: #0F172A; font-weight: 600;">{name}</span>
        </nav>

        <div class="seo-card-main">
          <!-- Meta Status Pills -->
          <div class="seo-meta-pills-row">
            <span class="seo-pill teal">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              NABL &amp; CAP Verified Lab
            </span>
            <span class="seo-pill">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
              {turnaround_val}
            </span>
            <span class="seo-pill orange">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              {fasting_val}
            </span>
          </div>

          <h2 class="seo-content-h2">About {name} with Healthians</h2>
          <p class="seo-text-p">{overview_text}</p>

          <div class="seo-key-highlights-box">
            <div class="seo-key-highlights-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Key Diagnostic Highlights &amp; Inclusions
            </div>
            <ul class="seo-highlights-list">
              {highlights_html}
            </ul>
          </div>

          <!-- Trust Callout Banner -->
          <div class="seo-cta-banner">
            <div class="seo-cta-banner-text">
              <h3>Ready to Book Your Sample Collection?</h3>
              <p>Free home collection, zero visit fees, and reports delivered directly to your WhatsApp.</p>
            </div>
            <div class="seo-cta-buttons">
              <a href="#booking-card-destination" class="seo-cta-btn-call" style="background:#00A0A8; color:#FFF;">
                Book at Home
              </a>
              <a href="tel:9044401435" class="seo-cta-btn-call">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call Phlebotomist
              </a>
              <a href="https://wa.me/919044401435?text=Hello%2C%20I%20want%20to%20book%20{name.replace(' ', '%20')}%20from%20Healthians." target="_blank" rel="noopener noreferrer" class="seo-cta-btn-wa">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.01 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.764.46 3.488 1.335 5.004L2.002 22l5.127-1.343a9.96 9.96 0 0 0 4.881 1.282c5.522 0 10-4.478 10-10 0-5.522-4.478-9.998-10-9.998zm5.952 14.135c-.25.7-1.467 1.335-2.023 1.41-.557.075-1.277.202-3.874-.874-3.136-1.302-5.161-4.542-5.318-4.747-.156-.203-1.272-1.688-1.272-3.221 0-1.534.795-2.289 1.077-2.6.282-.312.617-.39.821-.39.203 0 .406 0 .586.008.196.008.454-.075.712.547.266.626.908 2.215.987 2.378.078.163.132.352.015.586-.118.234-.176.383-.348.586-.172.203-.359.454-.515.609-.172.172-.352.359-.156.695.195.336.868 1.432 1.864 2.322 1.282 1.149 2.36 1.503 2.696 1.667.336.164.532.141.727-.086.195-.227.844-.986 1.07-1.322.227-.336.454-.282.758-.172.305.109 1.94.915 2.276 1.087.336.172.563.258.641.406.078.148.078.852-.172 1.551z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
'''

    # Inject SEO details section before FAQ section
    faq_section_marker = r'(<section class="section"[^>]*>\s*<div class="container">\s*<div class="section-head">\s*<span class="sec-tag"[^>]*>Clear Answers</span>)'
    if re.search(faq_section_marker, page):
        page = re.sub(faq_section_marker, f"{seo_details_html}\n\\1", page, count=1)
    else:
        # Fallback before footer
        page = page.replace('</main>', f"{seo_details_html}\n</main>")

    # 7. Replace FAQ accordion on the page with item FAQs
    faqs = item.get('faq', [])
    if faqs:
        faq_items_html = ""
        for idx, faq in enumerate(faqs):
            faq_items_html += f'''
          <!-- FAQ {idx+1} -->
          <div class="faq-row">
            <button type="button" class="faq-question-btn" aria-expanded="false">
              <span>{faq["q"]}</span>
              <span class="faq-plus">+</span>
            </button>
            <div class="faq-answer-box">
              <div class="faq-answer-inner">
                {faq["a"]}
              </div>
            </div>
          </div>
'''
        # Replace the entire inner faq-container-minimal
        page = re.sub(
            r'(<div class="faq-container-minimal">).*?(</div>\s*</div>\s*</section>)',
            rf'\1\n{faq_items_html}\n        \2',
            page,
            flags=re.DOTALL
        )

    # 8. Build and Inject Medical Schema.org JSON-LD
    schema_faq_items = []
    for faq in faqs:
        schema_faq_items.append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['a']
            }
        })

    graph_nodes = [
        {
            "@type": ["MedicalClinic", "DiagnosticLab"],
            "name": f"Healthians Diagnostics - {name}",
            "url": canonical,
            "description": item.get("schemaDesc", desc),
            "image": f"{BASE_URL}/images/hero.jpg",
            "logo": f"{BASE_URL}/images/logo-v2.png",
            "telephone": "+91-9044401435",
            "priceRange": "₹₹",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": item.get("name", "India"),
                "addressCountry": "IN"
            },
            "medicalSpecialty": "Pathology",
            "openingHours": "Mo-Su 06:30-21:00"
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": f"{BASE_URL}/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": cat_label,
                    "item": f"{BASE_URL}{cat_url}"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": name,
                    "item": canonical
                }
            ]
        }
    ]

    # Service / MedicalTest node
    if category in ['tests', 'packages', 'services']:
        graph_nodes.append({
            "@type": "MedicalTest",
            "name": name,
            "description": item.get("schemaDesc", desc),
            "code": {
                "@type": "MedicalCode",
                "code": slug,
                "codingSystem": "Internal-Healthians"
            }
        })
    elif category == 'articles':
        graph_nodes.append({
            "@type": ["Article", "MedicalWebPage"],
            "headline": title,
            "description": desc,
            "url": canonical,
            "datePublished": item.get("publishDate", "2026-01-15"),
            "dateModified": "2026-10-25",
            "author": {
                "@type": "Organization",
                "name": "Healthians Medical Editorial Board",
                "url": BASE_URL
            },
            "publisher": {
                "@type": "Organization",
                "name": "Healthians Diagnostics",
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{BASE_URL}/images/logo-v2.png"
                }
            }
        })

    if schema_faq_items:
        graph_nodes.append({
            "@type": "FAQPage",
            "mainEntity": schema_faq_items
        })

    custom_schema = {
        "@context": "https://schema.org",
        "@graph": graph_nodes
    }

    schema_json_str = f'<script type="application/ld+json">\n{json.dumps(custom_schema, indent=2, ensure_ascii=False)}\n</script>'
    
    # Replace first schema in template
    page = re.sub(r'<script type="application/ld\+json">.*?</script>', schema_json_str, page, count=1, flags=re.DOTALL)

    # 9. Write out static index.html in respective directory
    out_file = f"{out_dir}/index.html"
    ensure_dir(out_file)
    with open(out_file, 'w', encoding='utf-8') as out_f:
        out_f.write(page)

    total_pages_generated += 1

# Process all categories in the database
categories = ['locations', 'tests', 'packages', 'articles', 'services']
for cat in categories:
    for item in db.get(cat, []):
        generate_seo_page(cat, item)

# Generate Dynamic XML Sitemap
sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for entry in sitemap_entries:
    sitemap_xml += f'  <url>\n    <loc>{entry["loc"]}</loc>\n    <lastmod>2026-10-26</lastmod>\n    <changefreq>{entry["changefreq"]}</changefreq>\n    <priority>{entry["priority"]}</priority>\n  </url>\n'
sitemap_xml += '</urlset>'

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_xml)

print(f"\n==========================================")
print(f"[OK] ENTERPRISE SEO BUILD COMPLETE!")
print(f"Total Static Landing Pages Generated: {total_pages_generated}")
print(f"Total XML Sitemap URLs Submitted: {len(sitemap_entries)}")
print(f"Sitemap file: sitemap.xml")
print(f"==========================================")
