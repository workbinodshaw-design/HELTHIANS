with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'og:locale (India)': 'og:locale' in html,
    'lang=en attribute': 'lang="en"' in html,
    'twitter:image:alt': 'twitter:image:alt' in html,
    'hreflang tag': 'hreflang' in html,
    'AggregateRating schema': 'AggregateRating' in html,
    'ratingValue': 'ratingValue' in html,
    'WhatsApp deep link': 'wa.me' in html,
    'tel:9044401435': 'tel:9044401435' in html,
    'INR / rupee signal': 'INR' in html or 'priceRange' in html,
    'India addressRegion': 'addressRegion' in html or 'addressLocality' in html,
    'Google Verification': 'google-site-verification' in html,
    'Keywords meta': 'meta name="keywords"' in html,
    'Canonical count': html.count('rel="canonical"'),
}

for k, v in checks.items():
    print(f"  {'OK' if v else 'MISSING'}: {k} -> {v}")
