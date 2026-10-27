import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Title
content = re.sub(
    r'<title>.*?</title>',
    '<title>Home Blood Test & Full Body Checkup | Free Sample Collection</title>',
    content
)

# 2. Update Description
content = re.sub(
    r'<meta name=\"description\" content=\".*?\">',
    '<meta name=\"description\" content=\"Book a home blood test or full body health checkup. Get free home sample collection across India, NABL certified labs, and 100% accurate diagnostic reports.\">',
    content
)

# 3. Update Keywords
content = re.sub(
    r'<meta name=\"keywords\" content=\".*?\">',
    '<meta name=\"keywords\" content=\"home blood test, home blood collection, full body checkup near me, diagnostic centre, lab test from home, blood test in india, health checkup packages, pathology lab\">',
    content
)

# 4. Update OpenGraph Title
content = re.sub(
    r'<meta property=\"og:title\" content=\".*?\">',
    '<meta property=\"og:title\" content=\"Home Blood Test & Full Body Checkup | Free Sample Collection\">',
    content
)

# 5. Update OpenGraph Description
content = re.sub(
    r'<meta property=\"og:description\" content=\".*?\">',
    '<meta property=\"og:description\" content=\"Book a home blood test or full body health checkup. Get free home sample collection across India, NABL certified labs, and 100% accurate diagnostic reports.\">',
    content
)

# 6. Update Schema
old_schema = r'<script type=\"application/ld\+json\">\s*\{\s*\"@context\": \"https://schema.org\",\s*\"@type\": \"MedicalClinic\",.*?\s*\}\s*</script>'
new_schema = '''<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "HealthiansAr Blood Test & Diagnostics",
    "url": "https://bookhealthians.in/",
    "logo": "https://bookhealthians.in/images/logo-v2.png",
    "image": "https://bookhealthians.in/images/hero.jpg",
    "description": "Book a home blood test or full body health checkup. Get free home sample collection across India.",
    "telephone": "+91-9044401435",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "medicalSpecialty": "Pathology",
    "availableService": [
      {
        "@type": "MedicalTest",
        "name": "Full Body Checkup"
      },
      {
        "@type": "MedicalTest",
        "name": "Home Blood Test Collection"
      },
      {
        "@type": "MedicalTest",
        "name": "Thyroid Profile"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to book a home blood test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can easily book a home blood test online through our website. Fill out the booking form, and a certified phlebotomist will visit your home for a free sample collection."
        }
      },
      {
        "@type": "Question",
        "name": "Is home sample collection free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide 100% free home sample collection for blood tests and full body checkups across major cities in India."
        }
      },
      {
        "@type": "Question",
        "name": "Are the laboratories NABL certified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our partner diagnostic laboratories are fully NABL certified, ensuring maximum accuracy and reliability of your test reports."
        }
      }
    ]
  }
]
</script>'''
content = re.sub(old_schema, new_schema, content, flags=re.DOTALL)

# 7. Add SEO Footer Text before </footer>
footer_seo = '''
  <div style="background-color: #F8FAFC; padding: 40px 20px; text-align: center; border-top: 1px solid #E2E8F0;">
    <div style="max-width: 1000px; margin: 0 auto;">
      <h2 style="font-size: 1.5rem; color: #0F766E; margin-bottom: 15px; font-weight: 700;">Trusted Home Blood Collection & Diagnostics Across India</h2>
      <p style="color: #475569; line-height: 1.6; font-size: 0.95rem; margin-bottom: 20px;">
        Looking for a reliable <strong>blood test near me</strong> or a comprehensive <strong>full body checkup</strong>? We offer hassle-free, highly accurate diagnostic services right at your doorstep. Skip the waiting lines and book a <strong>lab test from home</strong>.
      </p>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;">
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Home Blood Test in Delhi</span>
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Home Sample Collection Mumbai</span>
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Full Body Checkup Bangalore</span>
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Blood Test Pune</span>
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Lab Test at Home Hyderabad</span>
        <span style="background: #ffffff; padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 20px; font-size: 0.85rem; color: #334155;">Diagnostics in Chennai</span>
      </div>
    </div>
  </div>
'''
content = content.replace('</footer>', footer_seo + '\n</footer>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
