"""
======================================================================================
  PRO SEO MASTER BUILD ENGINE v4.0  — www.bookbloodtest.in (Healthians)
  High-Converting CRO + Pure Canonical Internal Linking + Clinical Tables + E-E-A-T
======================================================================================
"""

import html
import json
import os
import re
import subprocess
import urllib.parse
from datetime import datetime

BASE_URL = 'https://www.bookbloodtest.in'
TODAY = datetime.now().strftime('%Y-%m-%d')
BRAND_NAME = "Healthians"
BRAND_FULL = "Healthians Diagnostics & Home Blood Collection"
PHONE = "+91-9044401435"
WHATSAPP = "919044401435"

CITY_STATE_MAP = {
    "delhi": ("Delhi", "Delhi", "IN-DL", "110001"),
    "new-delhi": ("New Delhi", "Delhi", "IN-DL", "110001"),
    "mumbai": ("Mumbai", "Maharashtra", "IN-MH", "400001"),
    "pune": ("Pune", "Maharashtra", "IN-MH", "411001"),
    "bengaluru": ("Bengaluru", "Karnataka", "IN-KA", "560001"),
    "bangalore": ("Bengaluru", "Karnataka", "IN-KA", "560001"),
    "hyderabad": ("Hyderabad", "Telangana", "IN-TG", "500001"),
    "noida": ("Noida", "Uttar Pradesh", "IN-UP", "201301"),
    "gurugram": ("Gurugram", "Haryana", "IN-HR", "122001"),
    "gurgaon": ("Gurugram", "Haryana", "IN-HR", "122001"),
    "jaipur": ("Jaipur", "Rajasthan", "IN-RJ", "302001"),
    "lucknow": ("Lucknow", "Uttar Pradesh", "IN-UP", "226001"),
    "chandigarh": ("Chandigarh", "Punjab", "IN-PB", "160001"),
    "ahmedabad": ("Ahmedabad", "Gujarat", "IN-GJ", "380001"),
    "kolkata": ("Kolkata", "West Bengal", "IN-WB", "700001"),
    "chennai": ("Chennai", "Tamil Nadu", "IN-TN", "600001"),
    "indore": ("Indore", "Madhya Pradesh", "IN-MP", "452001"),
    "bhopal": ("Bhopal", "Madhya Pradesh", "IN-MP", "462001"),
    "kanpur": ("Kanpur", "Uttar Pradesh", "IN-UP", "208001"),
    "nagpur": ("Nagpur", "Maharashtra", "IN-MH", "440001"),
    "patna": ("Patna", "Bihar", "IN-BR", "800001"),
    "surat": ("Surat", "Gujarat", "IN-GJ", "395001"),
    "vadodara": ("Vadodara", "Gujarat", "IN-GJ", "390001"),
    "ludhiana": ("Ludhiana", "Punjab", "IN-PB", "141001"),
    "agra": ("Agra", "Uttar Pradesh", "IN-UP", "282001"),
    "varanasi": ("Varanasi", "Uttar Pradesh", "IN-UP", "221001"),
    "amritsar": ("Amritsar", "Punjab", "IN-PB", "143001"),
    "meerut": ("Meerut", "Uttar Pradesh", "IN-UP", "250001"),
    "dehradun": ("Dehradun", "Uttarakhand", "IN-UT", "248001"),
    "ghaziabad": ("Ghaziabad", "Uttar Pradesh", "IN-UP", "201001"),
    "faridabad": ("Faridabad", "Haryana", "IN-HR", "121001"),
    "allahabad": ("Allahabad", "Uttar Pradesh", "IN-UP", "211001"),
    "prayagraj": ("Prayagraj", "Uttar Pradesh", "IN-UP", "211001"),
}

def esc(val):
    return html.escape(str(val or ""), quote=True)

def ensure_dir(path):
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

with open('index.html', 'r', encoding='utf-8') as f:
    raw_template = f.read()

sitemap_entries = [
    {"loc": f"{BASE_URL}/", "priority": "1.0", "changefreq": "daily", "lastmod": TODAY}
]
total_pages = 0


# ════════════════════════════════════════════════════════════════════════════
#  1. MASTER <head> INDIA SEO BLOCK & HOMEPAGE SCHEMA
# ════════════════════════════════════════════════════════════════════════════

def build_pro_head_block():
    return """  <!-- ═══ START INDIA SEO SIGNALS ═══ -->
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Healthians">
  <meta name="twitter:image:alt" content="Healthians Home Blood Test — Free Doorstep Sample Collection India">
  <meta name="twitter:site" content="@Healthians">
  <meta name="twitter:creator" content="@Healthians">
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <meta name="geo.position" content="20.5937;78.9629">
  <meta name="ICBM" content="20.5937, 78.9629">
  <meta name="language" content="English">
  <meta name="content-language" content="en-IN">
  <link rel="alternate" hreflang="en-IN" href="https://www.bookbloodtest.in/">
  <link rel="alternate" hreflang="x-default" href="https://www.bookbloodtest.in/">
  <!-- PERFORMANCE PRECONNECTS -->
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link rel="dns-prefetch" href="//firestore.googleapis.com">
  <link rel="dns-prefetch" href="//cdn1.healthians.com">
  <link rel="preconnect" href="https://firestore.googleapis.com" crossorigin>
  <!-- MOBILE APP DEEP LINKS -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Healthians">
  <meta name="application-name" content="Healthians">
  <meta name="theme-color" content="#00A0A8">
  <!-- RICH RESULT ELIGIBILITY -->
  <meta name="rating" content="general">
  <meta name="revisit-after" content="3 days">
  <!-- ═══ END INDIA SEO SIGNALS ═══ -->"""


def build_homepage_schema():
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": f"{BASE_URL}/#website",
                "url": f"{BASE_URL}/",
                "name": "Healthians",
                "alternateName": ["Healthians", "Healthians Diagnostics", "Healthians India", "Healthians Home Blood Test", "BookBloodTest"],
                "description": "India's most trusted home diagnostic lab booking platform. NABL certified labs, free doorstep sample collection across 250+ cities.",
                "publisher": {"@id": f"{BASE_URL}/#organization"},
                "inLanguage": "en-IN",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": f"{BASE_URL}/?q={{search_term_string}}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": f"{BASE_URL}/#organization",
                "name": BRAND_FULL,
                "alternateName": ["Healthians", "BookBloodTest", "Healthians Diagnostics"],
                "url": f"{BASE_URL}/",
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{BASE_URL}/images/logo-v2.png",
                    "width": 250,
                    "height": 80
                },
                "image": f"{BASE_URL}/images/hero.jpg",
                "telephone": PHONE,
                "email": "support@healthians.com",
                "sameAs": [
                    "https://www.healthians.com",
                    "https://www.facebook.com/healthians",
                    "https://twitter.com/Healthians",
                    "https://www.instagram.com/healthians",
                    "https://www.linkedin.com/company/healthians",
                    "https://www.youtube.com/healthians"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Sector 44",
                    "addressLocality": "Gurugram",
                    "addressRegion": "Haryana",
                    "postalCode": "122003",
                    "addressCountry": "IN"
                },
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": PHONE,
                        "contactType": "customer service",
                        "areaServed": "IN",
                        "availableLanguage": ["Hindi", "English"],
                        "contactOption": "TollFree",
                        "hoursAvailable": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                            "opens": "06:30",
                            "closes": "21:00"
                        }
                    }
                ],
                "foundingDate": "2014",
                "numberOfEmployees": {
                    "@type": "QuantitativeValue",
                    "value": 5000
                },
                "slogan": "Your Health. Our Priority."
            },
            {
                "@type": ["MedicalClinic", "DiagnosticLab", "LocalBusiness"],
                "@id": f"{BASE_URL}/#medicalclinic",
                "name": BRAND_FULL,
                "alternateName": "Healthians Home Blood Test",
                "url": f"{BASE_URL}/",
                "logo": f"{BASE_URL}/images/logo-v2.png",
                "image": f"{BASE_URL}/images/hero.jpg",
                "description": "Book a home blood test or full body health checkup with Healthians. Free doorstep sample collection across 250+ cities in India, NABL certified labs, and 100% accurate digital reports delivered in 24-48 hours.",
                "telephone": PHONE,
                "priceRange": "₹₹",
                "currenciesAccepted": "INR",
                "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Sector 44",
                    "addressLocality": "Gurugram",
                    "addressRegion": "Haryana",
                    "postalCode": "122003",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "28.4595",
                    "longitude": "77.0266"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "India"
                },
                "medicalSpecialty": "Pathology",
                "openingHours": "Mo-Su 06:30-21:00",
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        "opens": "06:30",
                        "closes": "21:00"
                    }
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "52000",
                    "bestRating": "5",
                    "worstRating": "1",
                    "ratingExplanation": "Based on verified patient reviews across India"
                },
                "hasCredential": {
                    "@type": "EducationalOccupationalCredential",
                    "name": "NABL Accredited Laboratory",
                    "credentialCategory": "Medical Laboratory Accreditation"
                },
                "availableService": [
                    {"@type": "MedicalTest", "name": "Full Body Checkup at Home"},
                    {"@type": "MedicalTest", "name": "CBC Complete Blood Count"},
                    {"@type": "MedicalTest", "name": "Thyroid Profile (TSH, T3, T4)"},
                    {"@type": "MedicalTest", "name": "HbA1c Diabetes Test"},
                    {"@type": "MedicalTest", "name": "Vitamin D Test"},
                    {"@type": "MedicalTest", "name": "Vitamin B12 Test"},
                    {"@type": "MedicalTest", "name": "Lipid Profile Test"},
                    {"@type": "MedicalTest", "name": "Liver Function Test (LFT)"},
                    {"@type": "MedicalTest", "name": "Kidney Function Test (KFT)"},
                    {"@type": "MedicalTest", "name": "Urine Routine & Microscopy Test"},
                    {"@type": "MedicalTest", "name": "C-Reactive Protein (CRP) Test"},
                    {"@type": "MedicalTest", "name": "Pregnancy Blood Test (Beta HCG)"}
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Ghar pe blood test kaise book karein? (How to book home blood test?)",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Healthians se ghar pe blood test book karna bahut aasaan hai. Upar diya form bharein — apna naam, phone number aur city daalen. Hamara certified phlebotomist 60 minutes ke andar aapke ghar aayega. Sample free collection hoti hai aur report WhatsApp aur email par milti hai."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is home sample collection free with Healthians?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, Healthians provides 100% free home sample collection for all blood tests and full body health checkups across 250+ cities in India. There is no extra charge for home visit — you only pay for the test."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are Healthians partner labs NABL certified?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all Healthians partner diagnostic laboratories are NABL and CAP accredited, ensuring the highest accuracy and reliability. Over 3 crore+ patients have trusted Healthians for their diagnostic needs."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does a full body checkup cost at home?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Healthians diagnostic tests start at ₹149, Super Saver 5 essential tests at ₹299, and Smart Full Body Checkup (74 parameters) at ₹999 with free home sample collection and reports on WhatsApp in 12-24 hours."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Healthians report kitne time mein aati hai?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Healthians ki report zyaadatar tests ke liye 12-24 ghante mein aati hai (kuch specialized tests 24-48 ghante). Report aapke WhatsApp aur email par automatically send hoti hai."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Which cities does Healthians home collection cover?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Healthians home sample collection is available in 250+ cities across India including Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Noida, Gurugram, Jaipur, Lucknow, Chandigarh, Ahmedabad, Kolkata, Chennai, Indore, Patna, Surat, and many more."
                        }
                    }
                ]
            },
            {
                "@type": "SiteNavigationElement",
                "name": ["Home Blood Test", "Full Body Checkup", "Diagnostic Tests", "Health Packages", "Pathology Lab Near Me", "Urine Test Home Collection", "CRP Test"],
                "url": [
                    f"{BASE_URL}/blood-test-at-home/",
                    f"{BASE_URL}/full-body-checkup-at-home/",
                    f"{BASE_URL}/diagnostic-tests-at-home/",
                    f"{BASE_URL}/packages/full-body-checkup/",
                    f"{BASE_URL}/pathology-lab-near-me/",
                    f"{BASE_URL}/tests/urine-routine-test/",
                    f"{BASE_URL}/tests/crp-test/"
                ]
            },
            {
                "@type": "HowTo",
                "name": "How to Book a Home Blood Test with Healthians",
                "description": "Step-by-step guide to book a home blood test and get free doorstep sample collection across India.",
                "totalTime": "PT5M",
                "tool": [
                    {"@type": "HowToTool", "name": "Mobile Phone or Computer"},
                    {"@type": "HowToTool", "name": "Internet Connection"}
                ],
                "step": [
                    {
                        "@type": "HowToStep",
                        "name": "Step 1: Choose Your Test or Package",
                        "text": "Browse our diagnostic tests, health packages, or city-specific blood test pages. Select the test that your doctor has prescribed or as per your health need.",
                        "position": 1
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Step 2: Fill the Booking Form",
                        "text": "Enter your name, mobile number, and city in the booking form on the page. You can also WhatsApp us directly at +91-9044401435.",
                        "position": 2
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Step 3: Phlebotomist Visits Your Home",
                        "text": "A certified Healthians phlebotomist will arrive at your doorstep within 60 minutes of booking. Sample collection is completely free.",
                        "position": 3
                    },
                    {
                        "@type": "HowToStep",
                        "name": "Step 4: Receive Digital Reports",
                        "text": "Your blood test reports are processed in NABL certified labs and delivered to your WhatsApp and email within 12-24 hours.",
                        "position": 4
                    }
                ]
            }
        ]
    }
    return json.dumps(schema, indent=2, ensure_ascii=False)


# ════════════════════════════════════════════════════════════════════════════
#  2. KEYWORD GENERATION
# ════════════════════════════════════════════════════════════════════════════

def get_keywords(category, item):
    name = item['name']
    if category == 'locations':
        return (f"blood test at home {name}, home sample collection {name}, "
                f"pathology lab {name}, diagnostic centre {name}, "
                f"{name} blood test price, {name} full body checkup, "
                f"ghar pe blood test {name}, blood test near me {name}, "
                f"Healthians {name}, NABL lab {name}")
    elif category == 'tests':
        return (f"{name} at home, {name} price India, {name} normal range, "
                f"book {name} home collection, {name} fasting required, "
                f"{name} report time, Healthians {name}, {name} near me")
    elif category == 'packages':
        return (f"{name} price India, {name} home collection, "
                f"{name} parameters list, Healthians {name}, "
                f"{name} near me, ghar pe {name}")
    elif category == 'articles':
        return (f"{name}, blood test normal range chart, diagnostic guide India, "
                f"lab test reference range, Healthians medical guide")
    elif category == 'services':
        return (f"{name}, home blood sample collection, blood test at home price, "
                f"free sample pickup India, NABL lab near me, Healthians")
    return "blood test at home India, Healthians, NABL lab"


# ════════════════════════════════════════════════════════════════════════════
#  3. PAGE SCHEMA GENERATOR
# ════════════════════════════════════════════════════════════════════════════

def build_page_schema(category, item, canonical, cat_label, cat_url, faqs):
    name = item['name']
    slug = item.get('slug', '')
    desc = item.get('description', '')
    schema_desc = item.get('schemaDesc', desc)

    city_info = CITY_STATE_MAP.get(slug, (name, "India", "IN", "110001"))
    city_locality, state_name, _region_code, postal_code = city_info

    schema_faq = []
    for faq in faqs:
        schema_faq.append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {"@type": "Answer", "text": faq['a']}
        })

    graph = [
        {
            "@type": "WebPage",
            "@id": f"{canonical}#webpage",
            "url": canonical,
            "name": item.get('title', name),
            "description": desc,
            "inLanguage": "en-IN",
            "isPartOf": {"@id": f"{BASE_URL}/#website"},
            "breadcrumb": {"@id": f"{canonical}#breadcrumb"},
            "datePublished": item.get("publishDate", "2026-01-15"),
            "dateModified": TODAY
        },
        {
            "@type": "BreadcrumbList",
            "@id": f"{canonical}#breadcrumb",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
                {"@type": "ListItem", "position": 2, "name": cat_label, "item": f"{BASE_URL}{cat_url}"},
                {"@type": "ListItem", "position": 3, "name": name, "item": canonical}
            ]
        }
    ]

    if category == 'locations':
        graph.append({
            "@type": ["MedicalClinic", "DiagnosticLab", "LocalBusiness"],
            "@id": f"{canonical}#localbusiness",
            "name": f"Healthians Home Blood Test - {name}",
            "url": canonical,
            "description": schema_desc,
            "image": f"{BASE_URL}/images/hero.jpg",
            "logo": f"{BASE_URL}/images/logo-v2.png",
            "telephone": PHONE,
            "priceRange": "₹₹",
            "currenciesAccepted": "INR",
            "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": city_locality,
                "addressRegion": state_name,
                "postalCode": postal_code,
                "addressCountry": "IN"
            },
            "areaServed": [
                {"@type": "City", "name": city_locality},
                {"@type": "State", "name": state_name}
            ],
            "hasMap": f"https://maps.google.com/?q=Healthians+{urllib.parse.quote(city_locality)}",
            "medicalSpecialty": "Pathology",
            "openingHours": "Mo-Su 06:30-21:00",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "52000",
                "bestRating": "5",
                "worstRating": "1"
            },
            "availableService": [
                {"@type": "MedicalTest", "name": f"Blood Test at Home {name}"},
                {"@type": "MedicalTest", "name": f"Full Body Checkup {name}"},
                {"@type": "MedicalTest", "name": f"Home Sample Collection {name}"}
            ]
        })
        graph.append({
            "@type": "Service",
            "name": f"Home Blood Test Collection - {name}",
            "provider": {"@id": f"{BASE_URL}/#organization"},
            "areaServed": {"@type": "City", "name": city_locality},
            "description": schema_desc,
            "offers": {
                "@type": "Offer",
                "price": "199",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31"
            }
        })

    elif category in ['tests', 'packages', 'services']:
        price_val = str(item.get('price', '199')).replace('₹', '').replace(',', '').strip()
        graph.append({
            "@type": ["MedicalClinic", "DiagnosticLab"],
            "@id": f"{canonical}#medicalclinic",
            "name": f"Healthians - {name}",
            "url": canonical,
            "description": schema_desc,
            "image": f"{BASE_URL}/images/hero.jpg",
            "logo": f"{BASE_URL}/images/logo-v2.png",
            "telephone": PHONE,
            "priceRange": "₹₹",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "India",
                "addressCountry": "IN"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "52000",
                "bestRating": "5",
                "worstRating": "1"
            },
            "medicalSpecialty": "Pathology",
            "openingHours": "Mo-Su 06:30-21:00"
        })
        graph.append({
            "@type": "MedicalTest",
            "@id": f"{canonical}#medicaltest",
            "name": name,
            "description": schema_desc,
            "usedToDiagnose": item.get('conditions', name),
            "code": {
                "@type": "MedicalCode",
                "code": slug.upper().replace('-', '_'),
                "codingSystem": "Healthians-Internal"
            },
            "affectedBy": item.get('conditions', ''),
            "normalRange": item.get('normalRange', 'Age & gender specific reference interval included in NABL report'),
            "preparation": item.get('fasting', 'No special fasting required unless advised by doctor')
        })
        graph.append({
            "@type": "Product",
            "name": name,
            "description": schema_desc,
            "image": f"{BASE_URL}/images/hero.jpg",
            "brand": {
                "@type": "Brand",
                "name": BRAND_NAME
            },
            "sku": slug,
            "offers": {
                "@type": "Offer",
                "url": canonical,
                "price": price_val if price_val.isdigit() else "199",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2027-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": BRAND_FULL
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "52000",
                "bestRating": "5",
                "worstRating": "1"
            }
        })

    elif category == 'articles':
        graph.append({
            "@type": ["Article", "MedicalWebPage"],
            "@id": f"{canonical}#article",
            "headline": item.get('h1', item.get('title', name)),
            "description": desc,
            "url": canonical,
            "image": {
                "@type": "ImageObject",
                "url": f"{BASE_URL}/images/hero.jpg",
                "width": 1100,
                "height": 614
            },
            "datePublished": item.get("publishDate", "2026-01-15"),
            "dateModified": TODAY,
            "author": {
                "@type": "Organization",
                "name": "Healthians Medical Editorial Board",
                "url": f"{BASE_URL}/"
            },
            "reviewedBy": {
                "@type": "Organization",
                "name": "NABL Pathology Review Team - Healthians"
            },
            "publisher": {
                "@type": "Organization",
                "name": BRAND_FULL,
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{BASE_URL}/images/logo-v2.png",
                    "width": 250,
                    "height": 80
                }
            },
            "mainEntityOfPage": {"@id": f"{canonical}#webpage"},
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".hero-main-title", ".seo-quick-answer-text", ".seo-content-h2"]
            },
            "inLanguage": "en-IN",
            "about": {
                "@type": "MedicalCondition",
                "name": name
            }
        })

    if schema_faq:
        graph.append({
            "@type": "FAQPage",
            "@id": f"{canonical}#faqpage",
            "mainEntity": schema_faq
        })

    return {
        "@context": "https://schema.org",
        "@graph": graph
    }


# ════════════════════════════════════════════════════════════════════════════
#  4. VISIBLE INTERNAL LINKING DIRECTORY (ZERO display:none & ZERO "Test Test")
# ════════════════════════════════════════════════════════════════════════════

def format_test_link_label(name):
    return name if "test" in name.lower() else f"{name} Test"

def build_internal_links_html():
    loc_links = "".join([
        f'<a href="/locations/{item["slug"]}/" class="seo-chip-link">Blood Test in {esc(item["name"])}</a>\n'
        for item in db.get('locations', [])
    ])
    test_links = "".join([
        f'<a href="/tests/{item["slug"]}/" class="seo-chip-link">{esc(format_test_link_label(item["name"]))}</a>\n'
        for item in db.get('tests', [])
    ])
    pkg_links = "".join([
        f'<a href="/packages/{item["slug"]}/" class="seo-chip-link">{esc(item["name"])}</a>\n'
        for item in db.get('packages', [])
    ])
    srv_links = "".join([
        f'<a href="/{item["slug"]}/" class="seo-chip-link">{esc(item["name"])}</a>\n'
        for item in db.get('services', [])
    ])
    art_links = "".join([
        f'<a href="/articles/{item["slug"]}/" class="seo-chip-link">{esc(item["name"])}</a>\n'
        for item in db.get('articles', [])
    ])

    loc_count = len(db.get('locations', []))
    test_count = len(db.get('tests', []))
    pkg_count = len(db.get('packages', [])) + len(db.get('services', []))
    art_count = len(db.get('articles', []))
    total_count = loc_count + test_count + pkg_count + art_count

    return f'''
  <!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY (ALL LINKS CRAWLABLE & VISIBLE) -->
  <section class="seo-directory-section" aria-label="Site Directory">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">
      <div class="seo-dir-header-bar" style="cursor: default;">
        <div class="seo-dir-header-title">
          <span style="background:#E6F3F5;color:#00A0A8;font-weight:700;font-size:0.76rem;padding:3px 12px;border-radius:50px;text-transform:uppercase;letter-spacing:0.5px;">Directory</span>
          <span style="font-size:1.05rem;color:#0F172A;font-weight:700;">All {total_count} Blood Tests, Health Packages &amp; Cities in India</span>
        </div>
        <div class="seo-tab-nav" style="display:flex;gap:8px;flex-wrap:wrap;" role="tablist">
          <button type="button" class="seo-tab-btn active" data-tab="all" onclick="filterSeoDirectory('all')" role="tab" aria-selected="true">All ({total_count})</button>
          <button type="button" class="seo-tab-btn" data-tab="cities" onclick="filterSeoDirectory('cities')" role="tab" aria-selected="false">Cities ({loc_count})</button>
          <button type="button" class="seo-tab-btn" data-tab="tests" onclick="filterSeoDirectory('tests')" role="tab" aria-selected="false">Blood Tests ({test_count})</button>
          <button type="button" class="seo-tab-btn" data-tab="packages" onclick="filterSeoDirectory('packages')" role="tab" aria-selected="false">Packages ({pkg_count})</button>
          <button type="button" class="seo-tab-btn" data-tab="articles" onclick="filterSeoDirectory('articles')" role="tab" aria-selected="false">Health Guides ({art_count})</button>
        </div>
      </div>

      <div id="seo-directory-content" style="display:block;margin-top:12px;border-top:1px dashed #CBD5E1;padding-top:14px;">
        <div id="tab-tests" class="seo-dir-group" data-dir-group="tests">
          <h3 class="seo-dir-group-title">Popular Blood &amp; Pathology Tests at Home</h3>
          <div class="seo-dir-chips-wrap">{test_links}</div>
        </div>
        <div id="tab-packages" class="seo-dir-group" data-dir-group="packages">
          <h3 class="seo-dir-group-title">Full Body Health Checkups &amp; Services</h3>
          <div class="seo-dir-chips-wrap">{pkg_links}{srv_links}</div>
        </div>
        <div id="tab-articles" class="seo-dir-group" data-dir-group="articles">
          <h3 class="seo-dir-group-title">Normal Range Charts &amp; Health Guides</h3>
          <div class="seo-dir-chips-wrap">{art_links}</div>
        </div>
        <div id="tab-cities" class="seo-dir-group" data-dir-group="cities">
          <h3 class="seo-dir-group-title">Home Blood Sample Collection Cities Across India</h3>
          <div class="seo-dir-chips-wrap">{loc_links}</div>
        </div>
      </div>
    </div>
  </section>

  <script>
    function filterSeoDirectory(groupName) {{
      document.querySelectorAll('.seo-tab-btn').forEach(b => {{
        const active = b.getAttribute('data-tab') === groupName;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      }});
      document.querySelectorAll('.seo-dir-group').forEach(g => {{
        const match = groupName === 'all' || g.getAttribute('data-dir-group') === groupName;
        g.style.display = match ? 'block' : 'none';
      }});
    }}
  </script>
'''


# ════════════════════════════════════════════════════════════════════════════
#  5. RICH SUBPAGE CONTENT MODULES
# ════════════════════════════════════════════════════════════════════════════

def build_reference_table_html(category, item):
    rows = item.get('referenceTable', [])
    if not rows:
        return ""
    if category == 'packages':
        head_title = f"Included Health Profiles &amp; Key Parameters — {esc(item['name'])}"
        col1, col2, col3 = "Test Profile", "Parameters / Target", "Clinical Purpose"
    elif category == 'services':
        head_title = "Transparent Home Blood Test Price List — Healthians"
        col1, col2, col3 = "Popular Test / Package", "Key Parameters Included", "Starting Offer Price"
    elif category == 'articles':
        head_title = f"Clinical Normal Range &amp; Reference Chart — {esc(item['name'])}"
        col1, col2, col3 = "Parameter / Level", "Normal Range / Cutoff", "Clinical Interpretation"
    else:
        head_title = f"{esc(item['name'])} — Normal Reference Range Chart"
        col1, col2, col3 = "Analyte / Level", "Normal Reference Range", "What It Indicates"

    tbody = ""
    for r in rows:
        tbody += (
            f'<tr>'
            f'<td style="font-weight:700;color:#0F172A;">{esc(r.get("parameter", ""))}</td>'
            f'<td style="font-weight:600;color:#0F766E;">{esc(r.get("normalRange", ""))}</td>'
            f'<td>{esc(r.get("meaning", ""))}</td>'
            f'</tr>'
        )
    return f'''
          <div class="seo-ref-table-wrap">
            <div class="seo-ref-table-head">📊 {head_title}</div>
            <div style="overflow-x:auto;">
              <table class="seo-ref-table">
                <thead>
                  <tr><th>{col1}</th><th>{col2}</th><th>{col3}</th></tr>
                </thead>
                <tbody>{tbody}</tbody>
              </table>
            </div>
          </div>'''


def build_when_to_test_html(item):
    reasons = item.get('whenToTest', [])
    if not reasons:
        return ""
    cards = "".join([f'<div class="seo-when-item">🩺 {esc(r)}</div>' for r in reasons])
    return f'''
          <div style="margin-top:22px;">
            <h3 style="font-size:1.08rem;font-weight:800;color:#0F172A;margin:0 0 10px 0;">When Do Doctors Recommend This Test?</h3>
            <div class="seo-when-grid">{cards}</div>
          </div>'''


def build_comparison_table_html():
    return '''
          <div style="margin-top:24px;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <div style="background:#0F172A;color:#FFF;padding:12px 18px;font-size:0.92rem;font-weight:700;">
              📊 Healthians Home Collection vs. Offline Pathology Labs
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.84rem;text-align:left;">
                <thead>
                  <tr style="background:#F1F5F9;color:#334155;font-weight:700;border-bottom:1px solid #E2E8F0;">
                    <th style="padding:10px 14px;">Service Feature</th>
                    <th style="padding:10px 14px;background:#E6F7F8;color:#0F766E;">Healthians Doorstep</th>
                    <th style="padding:10px 14px;">Offline Diagnostic Labs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Home Sample Pickup</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ 100% Free (Zero Visit Fee)</td>
                    <td style="padding:10px 14px;color:#64748B;">₹150 - ₹300 Extra / Queue Wait</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA;">
                    <td style="padding:10px 14px;font-weight:600;">Lab Accreditation</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ NABL &amp; CAP Accredited Labs</td>
                    <td style="padding:10px 14px;color:#64748B;">Varies by Local Center</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Digital WhatsApp Reports</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ Within 12 - 24 Hours</td>
                    <td style="padding:10px 14px;color:#64748B;">Collect printed copy next day</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA;">
                    <td style="padding:10px 14px;font-weight:600;">Doctor Phone Review</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ Free Post-Report Consultation</td>
                    <td style="padding:10px 14px;color:#64748B;">Separate Consultation Fee</td>
                  </tr>
                  <tr style="background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Cold-Chain Barcoding</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ 2°C - 8°C Cool Box + Unique Barcode</td>
                    <td style="padding:10px 14px;color:#64748B;">Manual Vial Handling</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>'''


# ════════════════════════════════════════════════════════════════════════════
#  6. MAIN PAGE GENERATOR
# ════════════════════════════════════════════════════════════════════════════

def generate_seo_page(category, item, template):
    global total_pages
    slug = item['slug']
    name = item['name']
    title = item['title']
    desc = item['description']
    h1 = item['h1']
    keywords = get_keywords(category, item)
    faqs = item.get('faq', [])

    if category == 'services':
        url_path = f"/{slug}/"
        out_dir = slug
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
    else:
        return None

    canonical = f"{BASE_URL}{url_path}"
    sitemap_entries.append({"loc": canonical, "priority": priority, "changefreq": "weekly", "lastmod": TODAY})

    page = template

    # ── Title & Meta ────────────────────────────────────────────────────────
    page = re.sub(r'<title>.*?</title>', lambda _: f'<title>{esc(title)}</title>', page, count=1)
    page = re.sub(r'<meta name="description" content=".*?">', lambda _: f'<meta name="description" content="{esc(desc)}">', page, count=1)
    page = re.sub(r'<meta name="keywords" content=".*?">', lambda _: f'<meta name="keywords" content="{esc(keywords)}">', page, count=1)

    # ── OG / Twitter Tags ───────────────────────────────────────────────────
    page = re.sub(r'<meta property="og:title" content=".*?">', lambda _: f'<meta property="og:title" content="{esc(title)}">', page, count=1)
    page = re.sub(r'<meta property="og:description" content=".*?">', lambda _: f'<meta property="og:description" content="{esc(desc)}">', page, count=1)
    page = re.sub(r'<meta property="og:url" content=".*?">', lambda _: f'<meta property="og:url" content="{canonical}">', page, count=1)
    if '<meta name="twitter:title"' in page:
        page = re.sub(r'<meta name="twitter:title" content=".*?">', lambda _: f'<meta name="twitter:title" content="{esc(title)}">', page, count=1)
    if '<meta name="twitter:description"' in page:
        page = re.sub(r'<meta name="twitter:description" content=".*?">', lambda _: f'<meta name="twitter:description" content="{esc(desc)}">', page, count=1)

    # ── Canonical & hreflang per page ───────────────────────────────────────
    page = re.sub(r'<link rel="canonical" href=".*?">', lambda _: f'<link rel="canonical" href="{canonical}">', page, count=1)
    page = re.sub(r'<link rel="alternate" hreflang="en-IN" href=".*?">', lambda _: f'<link rel="alternate" hreflang="en-IN" href="{canonical}">', page, count=1)
    page = re.sub(r'<link rel="alternate" hreflang="x-default" href=".*?">', lambda _: f'<link rel="alternate" hreflang="x-default" href="{canonical}">', page, count=1)

    # ── Hero H1 & Description ───────────────────────────────────────────────
    h1_content = f'<span class="title-navy">{esc(h1)}</span>'
    page = re.sub(r'(<h1 class="hero-main-title">)(.*?)(</h1>)', lambda m: f'{m.group(1)}{h1_content}{m.group(3)}', page, count=1, flags=re.DOTALL)
    page = re.sub(r'<p class="hero-description"[^>]*>.*?</p>', lambda _: f'<p class="hero-description">{esc(desc)}</p>', page, count=1, flags=re.DOTALL)
    if category == 'articles':
        page = re.sub(
            r'<p class="hero-highlight"[^>]*>.*?</p>',
            lambda _: '<p class="hero-highlight">Medically Reviewed Reference Guide</p>',
            page, count=1, flags=re.DOTALL
        )

    # ── Lead Form Pre-fill & Preselected Package Sync ───────────────────────
    price_val = str(item.get('price', '')).replace('₹', '').replace(',', '').strip()
    pkg_label = f"{name} (₹{price_val})" if (category in ['tests', 'packages'] and price_val) else name

    if category == 'locations':
        page = re.sub(
            r'(id="lead-city" name="city"[^>]*)>',
            lambda m: f'{m.group(1)} value="{esc(name)}">',
            page, count=1
        )
    elif category in ['tests', 'packages']:
        page = page.replace(
            'id="selected-package-box" style="display:none;',
            'id="selected-package-box" style="display:flex;',
            1
        )
        page = page.replace(
            '<strong id="package-title-text" style="font-weight:700;">Full Body Checkup</strong>',
            f'<strong id="package-title-text" style="font-weight:700;">{esc(pkg_label)}</strong>',
            1
        )
        init_pkg = f'<script>window.currentSelectedPackage={json.dumps(pkg_label, ensure_ascii=False)};</script>'
        page = page.replace('</body>', f'{init_pkg}\n</body>', 1)

    # ── Schema JSON-LD ──────────────────────────────────────────────────────
    schema_obj = build_page_schema(category, item, canonical, cat_label, cat_url, faqs)
    schema_str = f'<script type="application/ld+json">\n{json.dumps(schema_obj, indent=2, ensure_ascii=False)}\n</script>'
    page = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda _: schema_str, page, count=1, flags=re.DOTALL)

    # ── Build Unique .seo-details-section ───────────────────────────────────
    raw_points = item.get('keyPoints', item.get('highlights', []))
    if isinstance(raw_points, list) and raw_points:
        highlights_html = "".join([f'<li style="margin-bottom:8px;line-height:1.5;">{esc(h)}</li>' for h in raw_points])
    else:
        highlights_html = '<li>Free home sample collection by certified phlebotomist</li><li>100% NABL &amp; CAP accredited laboratory testing</li><li>Digital reports delivered within 24 hours on WhatsApp</li>'

    turnaround = item.get('turnaround', '12-24 Hours Report')
    fasting_req = item.get('fasting', 'No special fasting required')
    sample_type = item.get('sampleType', 'Blood Sample')
    params_count = item.get('parametersCount', '')
    overview = item.get('overview', desc)

    if category == 'locations':
        banner_title = f"Book Blood Test in {esc(name)} at Home — Free Collection"
        banner_sub = f"Certified phlebotomist at your doorstep in {esc(name)} within 60 mins."
        about_title = f"Home Blood Sample Collection in {esc(name)} — NABL Labs"
        wa_text = f"Hello, I want to book a blood test at home in {name} from Healthians."
    elif category in ['tests', 'packages']:
        banner_title = f"Book {esc(name)} at Home — Free Collection"
        banner_sub = f"100% NABL certified lab testing with free home visit{' at ₹' + esc(price_val) if price_val else ''}."
        about_title = f"About {esc(name)}"
        wa_text = f"Hello, I want to book {name} at home from Healthians."
    elif category == 'services':
        banner_title = f"Book {esc(name)} — Free Doorstep Collection"
        banner_sub = "Certified phlebotomist arrives in 60 mins. Digital WhatsApp reports."
        about_title = f"About {esc(name)} with Healthians"
        wa_text = f"Hello, I want to book {name} from Healthians."
    else:  # articles
        rel_test_name = item.get('relatedTestName', 'Full Body Health Checkup')
        rel_test_price = item.get('relatedTestPrice', '999')
        banner_title = f"Need Testing? Book {esc(rel_test_name)} at Home"
        banner_sub = f"Free doorstep collection starting ₹{esc(rel_test_price)}. Reports on WhatsApp."
        about_title = f"{esc(name)} — Clinical Guide"
        wa_text = f"Hello, I have a query after reading {name} on Healthians."

    wa_msg = urllib.parse.quote(wa_text)
    default_wa_text = "Hello%2C%20I%20want%20to%20book%20a%20home%20blood%20test%20from%20Healthians."
    page = page.replace(default_wa_text, wa_msg)

    # Price strip for transactional pages
    price_strip_html = ""
    if category in ['tests', 'packages', 'services'] and price_val:
        mrp_val = str(item.get('mrp', '')).replace('₹', '').replace(',', '').strip()
        save_badge = ""
        if mrp_val.isdigit() and price_val.isdigit() and int(mrp_val) > int(price_val):
            pct = round((1 - int(price_val) / int(mrp_val)) * 100)
            save_badge = f'<span class="seo-save-badge">Save {pct}% + FREE Home Visit</span>'
        mrp_span = f'<span class="seo-mrp-val">₹{esc(mrp_val)}</span>' if mrp_val else ""
        price_prefix = "Starting " if category == 'services' else ""
        price_strip_html = f'''
          <div class="seo-price-strip">
            <div>
              <div style="font-size:0.75rem;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">{price_prefix}Offer Price • Free Sample Pickup</div>
              <div class="seo-price-numbers">
                <span class="seo-offer-val">₹{esc(price_val)}</span>
                {mrp_span}
                {save_badge}
              </div>
            </div>
            <button type="button" class="seo-book-inline-btn select-pkg-btn" data-pkg="{esc(pkg_label)}">
              📅 Book {esc(name)} Now
            </button>
          </div>'''

    # Article E-E-A-T stamp + Quick Answer box + Related Test Card
    eeat_bar_html = ""
    quick_answer_html = ""
    related_article_cta_html = ""
    if category == 'articles':
        pub_date = item.get("publishDate", "2026-01-15")
        eeat_bar_html = f'''
          <div class="seo-eeat-bar">
            <span>🩺 <strong>Medically Reviewed:</strong> Healthians Clinical Editorial Board</span>
            <span>📅 <strong>Updated:</strong> {TODAY} (Published {esc(pub_date)})</span>
            <span>🛡️ <strong>Standard:</strong> NABL Laboratory Guidelines</span>
          </div>'''
        qa = item.get('quickAnswer', '')
        if qa:
            quick_answer_html = f'''
          <div class="seo-quick-answer-box">
            <div class="seo-quick-answer-label">⚡ Quick Clinical Summary</div>
            <p class="seo-quick-answer-text">{esc(qa)}</p>
          </div>'''
        rel_slug = item.get('relatedTestSlug', '')
        if rel_slug:
            rel_name = item.get('relatedTestName', 'Book Blood Test')
            rel_price = item.get('relatedTestPrice', '299')
            if item.get('isServiceLink'):
                rel_href = f"/{rel_slug}/"
            elif rel_slug in [p['slug'] for p in db.get('packages', [])]:
                rel_href = f"/packages/{rel_slug}/"
            else:
                rel_href = f"/tests/{rel_slug}/"
            related_article_cta_html = f'''
          <div style="margin-top:22px;padding:18px 20px;background:#F0FDF4;border:1.5px solid #86EFAC;border-radius:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
            <div>
              <div style="font-size:0.8rem;font-weight:800;color:#166534;text-transform:uppercase;">Book Recommended Test at Home</div>
              <div style="font-size:1.05rem;font-weight:700;color:#0F172A;margin-top:2px;">{esc(rel_name)} — ₹{esc(rel_price)} (Free Home Collection)</div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <a href="{rel_href}" style="background:#FFF;color:#0F766E;border:1px solid #0F766E;padding:9px 18px;border-radius:50px;font-weight:700;font-size:0.86rem;text-decoration:none;">View Test Details ➔</a>
              <button type="button" class="seo-book-inline-btn select-pkg-btn" style="padding:9px 18px;font-size:0.86rem;" data-pkg="{esc(rel_name)} (₹{esc(rel_price)})">Book at ₹{esc(rel_price)}</button>
            </div>
          </div>'''

    elif item.get('relatedArticle'):
        art_slug = item['relatedArticle']
        art_obj = next((a for a in db.get('articles', []) if a['slug'] == art_slug), None)
        if art_obj:
            related_article_cta_html = f'''
          <div style="margin-top:20px;padding:14px 18px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
            <span style="font-size:0.9rem;color:#1E3A8A;font-weight:600;">📖 Want to understand results &amp; normal ranges? Read: <strong>{esc(art_obj['name'])}</strong></span>
            <a href="/articles/{art_slug}/" style="background:#1D4ED8;color:#FFF;padding:8px 16px;border-radius:50px;font-size:0.84rem;font-weight:700;text-decoration:none;">Read Guide ➔</a>
          </div>'''

    # Pure canonical hash cross-links (ZERO /?test= or /?city= query URLs!)
    city_cross_links = ""
    if category in ['tests', 'packages']:
        cities = db.get('locations', [])[:10]
        city_links = "".join([
            f'<a href="/locations/{c["slug"]}/#book-{slug}" style="color:#00A0A8;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #B2E0E3;border-radius:20px;background:#FFF;font-weight:500;">📍 {esc(name)} in {esc(c["name"])}</a> '
            for c in cities
        ])
        city_cross_links = f'''
        <div style="margin-top:20px;">
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:0 0 8px 0;">📍 Book {esc(name)} at Home in Major Cities:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{city_links}</div>
        </div>'''

    test_cross_links = ""
    localities_block = ""
    if category == 'locations':
        loc_list = item.get('localities', [])
        if loc_list:
            chips = "".join([f'<span style="display:inline-block;background:#FFF;border:1px solid #CBD5E1;border-radius:20px;padding:4px 12px;font-size:0.8rem;color:#1E293B;font-weight:500;">📍 {esc(l)}</span>' for l in loc_list])
            localities_block = f'''
          <div style="margin-top:20px;padding:16px 20px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
            <p style="font-size:0.92rem;font-weight:700;color:#0F172A;margin:0 0 10px 0;">📍 Free Doorstep Sample Pickup Across {esc(name)} Localities:</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">{chips}</div>
            <p style="font-size:0.78rem;color:#64748B;margin:10px 0 0 0;">✨ Certified, vaccinated phlebotomists arrive at your home or office in {esc(name)} within 60 minutes.</p>
          </div>'''

        tests = db.get('tests', [])[:8]
        t_links = "".join([
            f'<a href="/tests/{t["slug"]}/#city-{slug}" style="color:#00A0A8;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #B2E0E3;border-radius:20px;background:#FFF;font-weight:500;">🧪 {esc(t["name"])} (₹{esc(t.get("price", "299"))}) in {esc(name)}</a> '
            for t in tests
        ])
        pkgs = db.get('packages', [])[:4]
        pkg_links = "".join([
            f'<a href="/packages/{p["slug"]}/#city-{slug}" style="color:#0F766E;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #A7F3D0;border-radius:20px;background:#F0FDF4;font-weight:600;">📦 {esc(p["name"])} (₹{esc(p.get("price", "999"))})</a> '
            for p in pkgs
        ])
        test_cross_links = f'''
        <div style="margin-top:20px;">
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:0 0 8px 0;">🧪 Popular Blood &amp; Urine Tests in {esc(name)}:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{t_links}</div>
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:14px 0 8px 0;">📦 Full Body Health Checkup Packages in {esc(name)}:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{pkg_links}</div>
        </div>'''

    # Meta pills row tailored per category
    if category == 'articles':
        pills_html = '''
            <span class="seo-pill teal">🛡️ NABL Clinical Standards</span>
            <span class="seo-pill">👩‍⚕️ Doctor-Reviewed Reference</span>
            <span class="seo-pill orange">🏠 Free Home Collection Available</span>'''
    else:
        sample_pill = f'<span class="seo-pill">🧪 {esc(sample_type)}</span>' if category in ['tests', 'packages'] else ''
        param_pill = f'<span class="seo-pill">🔬 {esc(params_count)}</span>' if params_count else ''
        pills_html = f'''
            <span class="seo-pill teal">🛡️ NABL &amp; CAP Verified Lab</span>
            <span class="seo-pill">⏱️ {esc(turnaround)}</span>
            <span class="seo-pill orange">🌡️ {esc(fasting_req)}</span>
            {sample_pill}
            {param_pill}'''

    ref_table_html = build_reference_table_html(category, item)
    when_to_test_html = build_when_to_test_html(item) if category == 'tests' else ''
    comparison_html = build_comparison_table_html() if category in ['locations', 'services'] else ''

    seo_section = f'''
    <!-- UNIQUE TOPIC CLINICAL CONTENT & BOOKING SECTION -->
    <section class="seo-details-section" aria-label="About {esc(name)}">
      <div class="container" style="max-width:1040px;margin:0 auto;">

        <nav class="seo-breadcrumb-bar" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span class="seo-breadcrumb-sep">/</span>
          <a href="{cat_url}">{esc(cat_label)}</a>
          <span class="seo-breadcrumb-sep">/</span>
          <span style="color:#0F172A;font-weight:600;">{esc(name)}</span>
        </nav>

        <div class="seo-card-main">
          {price_strip_html}
          {eeat_bar_html}
          <div class="seo-meta-pills-row">
            {pills_html}
          </div>

          <h2 class="seo-content-h2">{about_title}</h2>
          {quick_answer_html}
          <p class="seo-text-p">{esc(overview)}</p>

          {when_to_test_html}
          {ref_table_html}

          <div class="seo-key-highlights-box">
            <div class="seo-key-highlights-title">✅ Key Clinical Highlights &amp; Takeaways</div>
            <ul class="seo-highlights-list">{highlights_html}</ul>
          </div>

          {localities_block}
          {comparison_html}
          {related_article_cta_html}

          <!-- E-E-A-T Medical Trust Strip -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin-top:20px;">
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-weight:800;color:#166534;font-size:1.1rem;">3 Crore+</div>
              <div style="font-size:0.75rem;color:#15803D;font-weight:600;">Patients Trusted</div>
            </div>
            <div style="background:#EFF6FF;border:1px solid #BFDBFE;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-weight:800;color:#1E40AF;font-size:1.1rem;">4.8 / 5 ⭐</div>
              <div style="font-size:0.75rem;color:#1D4ED8;font-weight:600;">52,000+ Verified Reviews</div>
            </div>
            <div style="background:#F0FDFA;border:1px solid #99F6E4;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-weight:800;color:#0F766E;font-size:1.1rem;">NABL &amp; CAP</div>
              <div style="font-size:0.75rem;color:#0D9488;font-weight:600;">Accredited Quality</div>
            </div>
            <div style="background:#FFF7ED;border:1px solid #FED7AA;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-weight:800;color:#C2410C;font-size:1.1rem;">60 Mins</div>
              <div style="font-size:0.75rem;color:#EA580C;font-weight:600;">Rapid Doorstep Pickup</div>
            </div>
          </div>

          {city_cross_links}
          {test_cross_links}

          <!-- CTA Banner -->
          <div class="seo-cta-banner">
            <div class="seo-cta-banner-text">
              <h3>{banner_title}</h3>
              <p>{banner_sub}</p>
            </div>
            <div class="seo-cta-buttons">
              <a href="#booking-card-destination" class="seo-cta-btn-call" style="background:#00A0A8;color:#FFF;">📅 Book Now</a>
              <a href="tel:9044401435" class="seo-cta-btn-call">📞 Call Now</a>
              <a href="https://wa.me/{WHATSAPP}?text={wa_msg}" target="_blank" rel="noopener noreferrer" class="seo-cta-btn-wa">💬 WhatsApp</a>
            </div>
          </div>
        </div>

      </div>
    </section>
'''

    # ── FAQ Accordion Replace (BEFORE splitting sections) ───────────────────
    if faqs:
        faq_items_html = ""
        for faq in faqs:
            faq_items_html += f'''
          <div class="faq-row" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <button type="button" class="faq-question-btn" aria-expanded="false" itemprop="name">
              <span>{esc(faq["q"])}</span>
              <span class="faq-plus">+</span>
            </button>
            <div class="faq-answer-box" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <div class="faq-answer-inner" itemprop="text">{esc(faq["a"])}</div>
            </div>
          </div>
'''
        page = re.sub(
            r'(<div class="faq-container-minimal">).*?(</div>\s*</div>\s*</section>)',
            lambda m: f'{m.group(1)}\n{faq_items_html}\n        {m.group(2)}',
            page, flags=re.DOTALL
        )

    # ── Reorder <main> Blocks Deterministically per Category ─────────────────
    # Extract deterministic sections from template so UNIQUE content appears IMMEDIATELY after Hero+Form!
    m_how = "<!-- =====================================================================\n             HOW IT WORKS"
    m_saver = "<!-- =====================================================================\n             SUPER SAVER LIMITED TIME OFFER BANNER"
    m_pkgs = "<!-- =====================================================================\n         DIAGNOSTIC PACKAGES"
    m_spons = "<!-- =====================================================================\n         SPONSORED PRODUCTS"
    m_revs = "<!-- =====================================================================\n         VERIFIED REVIEWS"
    m_faq = "<!-- =====================================================================\n         FAQ (Clear Answers)"
    m_main_end = "  </main>"

    norm_page = page.replace('\r\n', '\n')
    idx_how = norm_page.find(m_how)
    idx_saver = norm_page.find(m_saver)
    idx_pkgs = norm_page.find(m_pkgs)
    idx_spons = norm_page.find(m_spons)
    idx_faq = norm_page.find(m_faq)
    idx_main_end = norm_page.find(m_main_end)

    if min(idx_how, idx_saver, idx_pkgs, idx_spons, idx_faq, idx_main_end) != -1:
        hero_top_and_form = norm_page[:idx_how].rstrip() + "\n      </div>\n    </section>\n"
        how_inner = norm_page[idx_how:idx_saver].rstrip()
        how_section = f'''
    <section class="section" style="padding: 20px 0 8px 0;">
      <div class="container">
        {how_inner}
      </div>
    </section>
'''
        pkgs_section = norm_page[idx_pkgs:idx_spons]
        faq_section = norm_page[idx_faq:idx_main_end]
        footer_onward = norm_page[idx_main_end:]

        if category == 'locations':
            pkgs_custom = pkgs_section.replace(
                'Most Booked Health Checkups',
                f'Most Booked Health Checkups in {esc(name)}',
                1
            )
            page = hero_top_and_form + seo_section + how_section + pkgs_custom + faq_section + footer_onward
        elif category == 'services':
            page = hero_top_and_form + seo_section + how_section + pkgs_section + faq_section + footer_onward
        elif category == 'tests':
            pkgs_custom = pkgs_section.replace(
                'Most Booked Health Checkups',
                'Complete Preventive Health Checkups',
                1
            )
            page = hero_top_and_form + seo_section + faq_section + how_section + pkgs_custom + footer_onward
        elif category == 'packages':
            page = hero_top_and_form + seo_section + faq_section + how_section + footer_onward
        else:  # articles: clean medical guide + FAQ + directory (no unrelated sales grid/reviews)
            page = hero_top_and_form + seo_section + faq_section + footer_onward
    else:
        # Fallback if markers ever changed
        faq_marker = r'(<section class="section"[^>]*>\s*<div class="container">\s*<div class="section-head">\s*<span class="sec-tag"[^>]*>Clear Answers</span>)'
        if re.search(faq_marker, page):
            page = re.sub(faq_marker, lambda m: f"{seo_section}\n{m.group(1)}", page, count=1)
        else:
            page = page.replace('</main>', f"{seo_section}\n</main>")

    out_file = f"{out_dir}/index.html"
    ensure_dir(out_file)
    with open(out_file, 'w', encoding='utf-8', newline='\n') as f:
        f.write(page)
    total_pages += 1
    return canonical


# ════════════════════════════════════════════════════════════════════════════
#  7. UPGRADE index.html MASTER TEMPLATE
# ════════════════════════════════════════════════════════════════════════════

print("[Step 1/5] Upgrading index.html master template with Pro India SEO tags...")

template = raw_template.replace('\r\n', '\n')

india_head = build_pro_head_block()
if '<!-- ═══ START INDIA SEO SIGNALS ═══ -->' in template:
    template = re.sub(
        r'<!-- ═══ START INDIA SEO SIGNALS ═══ -->.*?<!-- ═══ END INDIA SEO SIGNALS ═══ -->',
        lambda _: india_head,
        template,
        flags=re.DOTALL
    )
else:
    template = template.replace('</head>', f'{india_head}\n</head>')

homepage_schema_str = f'<script type="application/ld+json">\n{build_homepage_schema()}\n</script>'
template = re.sub(
    r'<script type="application/ld\+json">.*?</script>',
    lambda _: homepage_schema_str,
    template,
    count=1,
    flags=re.DOTALL
)

homepage_kw = (
    "blood test at home, ghar pe blood test, home blood collection, "
    "blood sample collection at home, book blood test at home, "
    "full body checkup near me, urine test home collection, crp test, "
    "pregnancy blood test, NABL certified lab, free home sample collection, Healthians"
)
template = re.sub(
    r'<meta name="keywords" content=".*?">',
    lambda _: f'<meta name="keywords" content="{homepage_kw}">',
    template,
    count=1
)

template = template.replace('<html lang="en">', '<html lang="en-IN">')

print("[Step 2/5] Building visible crawlable SEO internal linking directory...")
internal_links_block = build_internal_links_html()
new_footer_wrap = f"\n\n{internal_links_block}\n</footer>"

if '<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY' in template:
    template = re.sub(
        r'\s*<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY.*?</footer>',
        lambda _: new_footer_wrap,
        template,
        flags=re.DOTALL
    )
elif '<!-- SEO INTERNAL LINKING BLOCK -->' in template:
    template = re.sub(
        r'\s*<!-- SEO INTERNAL LINKING BLOCK -->.*?</footer>',
        lambda _: new_footer_wrap,
        template,
        flags=re.DOTALL
    )
else:
    template = template.replace('</footer>', f"{internal_links_block}\n</footer>")

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(template)
print("[OK] index.html upgraded cleanly!")


# ════════════════════════════════════════════════════════════════════════════
#  8. GENERATE ALL 83 LANDING PAGES
# ════════════════════════════════════════════════════════════════════════════

print("[Step 3/5] Generating all 83 SEO landing pages with topic-first layout...")

for cat in ['locations', 'tests', 'packages', 'articles', 'services']:
    for item in db.get(cat, []):
        url = generate_seo_page(cat, item, template)
        if url:
            print(f"  [OK] {url}")

print(f"\n[OK] Total pages generated: {total_pages}")


# ════════════════════════════════════════════════════════════════════════════
#  9. GENERATE SITEMAPS
# ════════════════════════════════════════════════════════════════════════════

print("\n[Step 4/5] Generating Sitemap Index + Child Sitemaps...")
subprocess.run(["python", "build_sitemaps.py"], check=True)


# ════════════════════════════════════════════════════════════════════════════
#  10. GENERATE RFC-COMPLIANT robots.txt
# ════════════════════════════════════════════════════════════════════════════

print("\n[Step 5/5] Writing clean robots.txt...")

robots = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /?*

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: {BASE_URL}/sitemap.xml
"""

with open('robots.txt', 'w', encoding='utf-8', newline='\n') as f:
    f.write(robots)
print("[OK] robots.txt written cleanly")

print("")
print("=" * 60)
print("  PRO SEO MASTER BUILD v4.0 - COMPLETE!")
print("=" * 60)
print(f"  Total Landing Pages Generated : {total_pages}")
print(f"  Base URL (Canonical)          : {BASE_URL}")
print("=" * 60)
