import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make all local asset links absolute so they work in subdirectories
replacements = {
    'href="style.css"': 'href="/style.css"',
    'src="script.js"': 'src="/script.js"',
    'src="translations.js"': 'src="/translations.js"',
    'src="firebase-config.js"': 'src="/firebase-config.js"',
    'href="images/': 'href="/images/',
    'src="images/': 'src="/images/',
    'url(images/': 'url(/images/',
    "url('images/": "url('/images/",
    'url("images/': 'url("/images/'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Add Internal Linking block for SEO before footer
internal_links_html = '''
  <!-- SEO INTERNAL LINKING BLOCK -->
  <div style="background-color: #fff; padding: 40px 20px; border-top: 1px solid #E2E8F0;">
    <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
      
      <div>
        <h3 style="font-size: 1.1rem; color: #0F766E; margin-bottom: 15px; font-weight: 700;">Top Blood Tests</h3>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/tests/cbc-test/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">CBC Test at Home</a></li>
          <li><a href="/tests/thyroid-test/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Thyroid Profile Test</a></li>
          <li><a href="/tests/hba1c-test/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">HbA1c Test</a></li>
          <li><a href="/tests/vitamin-d-test/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Vitamin D Test</a></li>
          <li><a href="/tests/lft-test/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Liver Function Test</a></li>
        </ul>
      </div>

      <div>
        <h3 style="font-size: 1.1rem; color: #0F766E; margin-bottom: 15px; font-weight: 700;">Top Packages & Services</h3>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/packages/full-body-checkup/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Full Body Checkup</a></li>
          <li><a href="/packages/diabetes-package/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Diabetes Package</a></li>
          <li><a href="/packages/thyroid-package/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Thyroid Package</a></li>
          <li><a href="/blood-test-at-home/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test at Home</a></li>
          <li><a href="/diagnostic-tests-at-home/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Diagnostic Tests at Home</a></li>
        </ul>
      </div>

      <div>
        <h3 style="font-size: 1.1rem; color: #0F766E; margin-bottom: 15px; font-weight: 700;">Top Cities</h3>
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
          <li><a href="/locations/mumbai/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test in Mumbai</a></li>
          <li><a href="/locations/delhi/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test in Delhi NCR</a></li>
          <li><a href="/locations/bengaluru/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test in Bengaluru</a></li>
          <li><a href="/locations/pune/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test in Pune</a></li>
          <li><a href="/locations/hyderabad/" style="color: #475569; text-decoration: none; font-size: 0.95rem;">Blood Test in Hyderabad</a></li>
        </ul>
      </div>

    </div>
  </div>
'''

if '<!-- SEO INTERNAL LINKING BLOCK -->' not in content:
    content = content.replace('</footer>', internal_links_html + '\n</footer>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
