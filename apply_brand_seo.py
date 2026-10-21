import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Title to include Healthians
content = re.sub(
    r'<title>.*?</title>',
    '<title>Healthians Home Blood Test & Full Body Checkup | Free Collection</title>',
    content
)

# 2. Update Description to include Healthians
content = re.sub(
    r'<meta name=\"description\" content=\".*?\">',
    '<meta name=\"description\" content=\"Book Healthians home blood test or full body health checkup. Get free home sample collection across India, NABL certified labs, and 100% accurate diagnostic reports.\">',
    content
)

# 3. Update OpenGraph Title
content = re.sub(
    r'<meta property=\"og:title\" content=\".*?\">',
    '<meta property=\"og:title\" content=\"Healthians Home Blood Test & Full Body Checkup | Free Collection\">',
    content
)

# 4. Update OpenGraph Description
content = re.sub(
    r'<meta property=\"og:description\" content=\".*?\">',
    '<meta property=\"og:description\" content=\"Book Healthians home blood test or full body health checkup. Get free home sample collection across India, NABL certified labs, and 100% accurate diagnostic reports.\">',
    content
)

# 5. Update Footer SEO Section to include Healthians brand seamlessly
old_footer_seo = r'Trusted Home Blood Collection & Diagnostics Across India.*?Skip the waiting lines and book a <strong>lab test from home</strong>.'
new_footer_seo = r'Trusted Healthians Home Blood Collection & Diagnostics Across India</h2>\n      <p style="color: #475569; line-height: 1.6; font-size: 0.95rem; margin-bottom: 20px;">\n        Looking for a reliable <strong>Healthians blood test near me</strong> or a comprehensive <strong>full body checkup</strong>? We offer hassle-free, highly accurate diagnostic services right at your doorstep. Skip the waiting lines and book a <strong>Healthians lab test from home</strong>.'

content = re.sub(old_footer_seo, new_footer_seo, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
