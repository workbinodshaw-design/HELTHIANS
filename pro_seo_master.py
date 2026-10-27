"""
======================================================================================
  PRO SEO MASTER BUILD ENGINE v3.0  — bookbloodtest.in (Healthians)
  Expert-level India SEO: AggregateRating, hreflang, LocalBusiness, E-E-A-T,
  page-specific keywords, SpeakableSpecification, HowTo, NewsArticle, VideoObject,
  Product schema, geo-tags, WebSite SearchAction, SiteNavigationElement,
  BreadcrumbList, FAQPage, MedicalTest, MedicalClinic, DiagnosticLab,
  og:locale=en_IN, twitter enhancements, robots meta, preconnect, DNS prefetch.
  
  TARGET: 50+ organic leads/day | India-first | Zero paid ads
======================================================================================
"""

import json
import os
import re
from datetime import datetime

BASE_URL = 'https://bookbloodtest.in'
TODAY = datetime.now().strftime('%Y-%m-%d')
BRAND_NAME = "Healthians"
BRAND_FULL = "Healthians Diagnostics & Home Blood Collection"
PHONE = "+91-9044401435"
WHATSAPP = "919044401435"
NABL = "NABL Certified Labs"
TAGLINE = "Book Blood Test at Home — Free Doorstep Collection Across India"

# ─── India state lookup for city pages ──────────────────────────────────────
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
}

def ensure_dir(path):
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

# ─── Load database ───────────────────────────────────────────────────────────
with open('seo_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

# ─── Read template ───────────────────────────────────────────────────────────
with open('index.html', 'r', encoding='utf-8') as f:
    raw_template = f.read()

sitemap_entries = [
    {"loc": f"{BASE_URL}/", "priority": "1.0", "changefreq": "daily", "lastmod": TODAY}
]
total_pages = 0


# ════════════════════════════════════════════════════════════════════════════
#  1. UPGRADE INDEX.HTML (master template) with pro India SEO head tags
# ════════════════════════════════════════════════════════════════════════════

def build_pro_head_block():
    """Returns the optimized <head> block additions for India SEO."""
    return """  <!-- ═══ START INDIA SEO SIGNALS ═══ -->
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Healthians | Book Blood Test at Home India">
  <meta name="twitter:image:alt" content="Healthians Home Blood Test — Free Doorstep Sample Collection India">
  <meta name="twitter:site" content="@Healthians">
  <meta name="twitter:creator" content="@Healthians">
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <meta name="geo.position" content="20.5937;78.9629">
  <meta name="ICBM" content="20.5937, 78.9629">
  <meta name="language" content="English">
  <meta name="content-language" content="en-IN">
  <link rel="alternate" hreflang="en-IN" href="https://bookbloodtest.in/">
  <link rel="alternate" hreflang="x-default" href="https://bookbloodtest.in/">
  <!-- PERFORMANCE PRECONNECTS -->
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
  <link rel="dns-prefetch" href="//firestore.googleapis.com">
  <link rel="dns-prefetch" href="//cdn1.healthians.com">
  <link rel="preconnect" href="https://firestore.googleapis.com" crossorigin>
  <!-- MOBILE APP DEEP LINKS -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Healthians Blood Test">
  <meta name="application-name" content="Healthians Blood Test">
  <meta name="theme-color" content="#00A0A8">
  <!-- RICH RESULT ELIGIBILITY -->
  <meta name="rating" content="general">
  <meta name="revisit-after" content="3 days">
  <!-- ═══ END INDIA SEO SIGNALS ═══ -->"""


def build_homepage_schema():
    """Pro-grade homepage schema with AggregateRating, WebSite, LocalBusiness,
    SpeakableSpecification, and SearchAction."""
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": f"{BASE_URL}/#website",
                "url": f"{BASE_URL}/",
                "name": "Healthians | Book Blood Test at Home",
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
                    "url": f"{BASE_URL}/images/logo.png",
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
                            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
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
                "logo": f"{BASE_URL}/images/logo.png",
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
                        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
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
                    {"@type": "MedicalTest", "name": "Kidney Function Test (KFT)"}
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
                            "text": "Healthians full body checkup packages start from ₹499 with free home sample collection. The comprehensive package includes 80+ tests covering CBC, thyroid, sugar, liver, kidney, vitamins, and more. Reports are delivered within 24-48 hours on WhatsApp."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Healthians report kitne time mein aati hai?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Healthians ki report zyaadatar tests ke liye 24-48 ghante mein aati hai. Kuch tests jaise CBC, Sugar, Urine ke liye 12-24 ghante mein hi report ready ho jaati hai. Report aapke WhatsApp aur email par automatically send hoti hai."
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
                "name": ["Home Blood Test", "Full Body Checkup", "Diagnostic Tests", "Health Packages", "Blood Test Near Me"],
                "url": [
                    f"{BASE_URL}/blood-test-at-home/",
                    f"{BASE_URL}/full-body-checkup-at-home/",
                    f"{BASE_URL}/diagnostic-tests-at-home/",
                    f"{BASE_URL}/packages/full-body-checkup/",
                    f"{BASE_URL}/pathology-lab-near-me/"
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
                        "text": "Your blood test reports are processed in NABL certified labs and delivered to your WhatsApp and email within 24-48 hours.",
                        "position": 4
                    }
                ]
            }
        ]
    }
    return json.dumps(schema, indent=2, ensure_ascii=False)


# ════════════════════════════════════════════════════════════════════════════
#  2. KEYWORD GENERATION — Page-specific, India-targeted
# ════════════════════════════════════════════════════════════════════════════

def get_keywords(category, item):
    name = item['name']
    slug = item.get('slug', '')
    
    if category == 'locations':
        city = name
        return (f"blood test at home {city}, home sample collection {city}, "
                f"pathology lab {city}, diagnostic centre {city}, "
                f"{city} blood test price, {city} full body checkup, "
                f"ghar pe blood test {city}, blood test near me {city}, "
                f"Healthians {city}, home collection {city}, "
                f"NABL lab {city}, phlebotomist {city}")
    
    elif category == 'tests':
        return (f"{name} test at home, {name} price India, "
                f"{name} normal range, book {name} home collection, "
                f"{name} fasting required, {name} NABL lab, "
                f"ghar pe {name}, {name} report time, "
                f"Healthians {name}, {name} near me India")
    
    elif category == 'packages':
        return (f"{name} package price India, {name} home collection, "
                f"{name} health checkup, {name} NABL certified, "
                f"Healthians {name}, {name} test list, "
                f"{name} package near me, ghar pe {name}, "
                f"cheap {name} package India, {name} doorstep")
    
    elif category == 'articles':
        return (f"{name}, health guide India, diagnostic tips, "
                f"blood test guide, medical advice India, "
                f"Healthians health tips, symptoms India, "
                f"pathology India, lab test information")
    
    elif category == 'services':
        return (f"{name}, home blood collection service, "
                f"doorstep diagnostic India, free sample collection, "
                f"NABL lab near me, Healthians service India, "
                f"blood test at home India, phlebotomist near me")
    
    return "home blood test, blood test at home India, Healthians, NABL lab India"


# ════════════════════════════════════════════════════════════════════════════
#  3. PAGE SCHEMA GENERATOR — Pro-grade with all rich result types
# ════════════════════════════════════════════════════════════════════════════

def build_page_schema(category, item, canonical, cat_label, cat_url, faqs):
    name = item['name']
    slug = item.get('slug', '')
    desc = item.get('description', '')
    schema_desc = item.get('schemaDesc', desc)
    
    # Get city/state info for location pages
    city_info = CITY_STATE_MAP.get(slug, (name, "India", "IN", "000000"))
    city_locality, state_name, region_code, postal_code = city_info

    schema_faq = []
    for faq in faqs:
        schema_faq.append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {"@type": "Answer", "text": faq['a']}
        })

    # ── Common nodes ──────────────────────────────────────────────────────
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

    # ── Category-specific nodes ───────────────────────────────────────────
    if category == 'locations':
        graph.append({
            "@type": ["MedicalClinic", "DiagnosticLab", "LocalBusiness"],
            "@id": f"{canonical}#localbusiness",
            "name": f"Healthians Home Blood Test - {name}",
            "url": canonical,
            "description": schema_desc,
            "image": f"{BASE_URL}/images/hero.jpg",
            "logo": f"{BASE_URL}/images/logo.png",
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
            "hasMap": f"https://maps.google.com/?q=Healthians+{city_locality}",
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
        # Service schema for location
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
        # Price from db if available
        price_val = str(item.get('price', '199')).replace('₹','').replace(',','').strip()
        
        graph.append({
            "@type": ["MedicalClinic", "DiagnosticLab"],
            "@id": f"{canonical}#medicalclinic",
            "name": f"Healthians - {name}",
            "url": canonical,
            "description": schema_desc,
            "image": f"{BASE_URL}/images/hero.jpg",
            "logo": f"{BASE_URL}/images/logo.png",
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
                "code": slug.upper().replace('-','_'),
                "codingSystem": "Healthians-Internal"
            },
            "affectedBy": item.get('conditions', ''),
            "normalRange": item.get('normalRange', 'As per age and gender; refer to report'),
            "preparation": item.get('preparation', 'No special preparation unless advised by doctor')
        })
        
        # Product schema for price display in search
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
            "headline": item.get('title', name),
            "description": desc,
            "url": canonical,
            "image": {
                "@type": "ImageObject",
                "url": f"{BASE_URL}/images/hero.jpg",
                "width": 1200,
                "height": 630
            },
            "datePublished": item.get("publishDate", "2026-01-15"),
            "dateModified": TODAY,
            "author": {
                "@type": "Organization",
                "name": "Healthians Medical Editorial Board",
                "url": BASE_URL
            },
            "publisher": {
                "@type": "Organization",
                "name": BRAND_FULL,
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{BASE_URL}/images/logo.png",
                    "width": 250,
                    "height": 80
                }
            },
            "mainEntityOfPage": {"@id": f"{canonical}#webpage"},
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".hero-main-title", ".hero-description", ".seo-content-h2"]
            },
            "inLanguage": "en-IN",
            "about": {
                "@type": "MedicalCondition",
                "name": name
            }
        })

    # ── FAQ node (all pages) ───────────────────────────────────────────────
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
#  4. INTERNAL LINKING DIRECTORY BUILDER (compact, collapsible, tabbed)
# ════════════════════════════════════════════════════════════════════════════

def build_internal_links_html():
    loc_links = "".join([
        f'<a href="/locations/{item["slug"]}/" class="seo-chip-link">Blood Test in {item["name"]}</a>\n'
        for item in db.get('locations', [])
    ])
    test_links = "".join([
        f'<a href="/tests/{item["slug"]}/" class="seo-chip-link">{item["name"]} Test</a>\n'
        for item in db.get('tests', [])
    ])
    pkg_links = "".join([
        f'<a href="/packages/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n'
        for item in db.get('packages', [])
    ])
    srv_links = "".join([
        f'<a href="/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n'
        for item in db.get('services', [])
    ])
    art_links = "".join([
        f'<a href="/articles/{item["slug"]}/" class="seo-chip-link">{item["name"]}</a>\n'
        for item in db.get('articles', [])
    ])

    total_count = (len(db.get('locations',[])) + len(db.get('tests',[])) +
                   len(db.get('packages',[])) + len(db.get('services',[])) +
                   len(db.get('articles',[])))

    html = f'''
  <!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY (COMPACT COLLAPSIBLE TABS) -->
  <section class="seo-directory-section" aria-label="Site Directory">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">
      
      <!-- Collapsible Header Bar -->
      <div class="seo-dir-header-bar" onclick="toggleSeoDirectory()" id="seo-dir-header" title="View all diagnostic tests & cities" role="button" tabindex="0" aria-expanded="false" aria-controls="seo-directory-content">
        <div class="seo-dir-header-title">
          <span style="background:#E6F3F5;color:#00A0A8;font-weight:700;font-size:0.76rem;padding:3px 12px;border-radius:50px;text-transform:uppercase;letter-spacing:0.5px;">Directory</span>
          <span style="font-size:1.05rem;color:#0F172A;font-weight:700;">Blood Tests, Packages &amp; Cities Across India</span>
        </div>
        <button type="button" id="seo-dir-toggle-btn" style="background:#FFF;border:1px solid #CBD5E1;color:#0F766E;font-weight:700;font-size:0.82rem;padding:6px 16px;border-radius:50px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 4px rgba(0,0,0,0.05);font-family:inherit;">
          <span id="seo-dir-toggle-text">Explore All {total_count} Categories</span>
          <span id="seo-dir-toggle-arrow" style="font-size:0.7rem;transition:transform 0.3s;display:inline-block;">&#9660;</span>
        </button>
      </div>

      <!-- Collapsible Content -->
      <div id="seo-directory-content" style="display:none;margin-top:18px;border-top:1px dashed #CBD5E1;padding-top:18px;">
        <!-- Tab Buttons -->
        <div class="seo-tab-nav" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;" role="tablist">
          <button type="button" class="seo-tab-btn active" data-tab="cities" onclick="switchSeoTab('cities')" role="tab" aria-selected="true">🏙️ Cities ({len(db.get('locations',[]))})</button>
          <button type="button" class="seo-tab-btn" data-tab="tests" onclick="switchSeoTab('tests')" role="tab" aria-selected="false">🧪 Blood Tests ({len(db.get('tests',[]))})</button>
          <button type="button" class="seo-tab-btn" data-tab="packages" onclick="switchSeoTab('packages')" role="tab" aria-selected="false">📦 Packages ({len(db.get('packages',[])) + len(db.get('services',[]))})</button>
          <button type="button" class="seo-tab-btn" data-tab="articles" onclick="switchSeoTab('articles')" role="tab" aria-selected="false">📖 Health Guides ({len(db.get('articles',[]))})</button>
        </div>

        <div id="tab-cities" class="seo-tab-pane" style="display:flex;flex-wrap:wrap;gap:8px;" role="tabpanel">{loc_links}</div>
        <div id="tab-tests" class="seo-tab-pane" style="display:none;flex-wrap:wrap;gap:8px;" role="tabpanel">{test_links}</div>
        <div id="tab-packages" class="seo-tab-pane" style="display:none;flex-wrap:wrap;gap:8px;" role="tabpanel">{pkg_links}{srv_links}</div>
        <div id="tab-articles" class="seo-tab-pane" style="display:none;flex-wrap:wrap;gap:8px;" role="tabpanel">{art_links}</div>
      </div>

    </div>
  </section>

  <script>
    function toggleSeoDirectory() {{
      const content = document.getElementById('seo-directory-content');
      const arrow = document.getElementById('seo-dir-toggle-arrow');
      const text = document.getElementById('seo-dir-toggle-text');
      const header = document.getElementById('seo-dir-header');
      if (!content) return;
      const isHidden = content.style.display === 'none' || !content.style.display;
      content.style.display = isHidden ? 'block' : 'none';
      if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      if (text) text.innerText = isHidden ? 'Collapse Directory' : 'Explore All {total_count} Categories';
      if (header) header.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    }}
    function switchSeoTab(tabId) {{
      document.querySelectorAll('.seo-tab-pane').forEach(p => p.style.display = 'none');
      document.querySelectorAll('.seo-tab-btn').forEach(b => {{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); }});
      const pane = document.getElementById('tab-' + tabId);
      if (pane) pane.style.display = 'flex';
      const btn = document.querySelector('[data-tab="' + tabId + '"]');
      if (btn) {{ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); }}
    }}
  </script>
'''
    return html


# ════════════════════════════════════════════════════════════════════════════
#  5. MAIN BUILD FUNCTION
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
        return

    canonical = f"{BASE_URL}{url_path}"
    sitemap_entries.append({"loc": canonical, "priority": priority, "changefreq": "weekly", "lastmod": TODAY})

    page = template

    # ── Title & Meta ────────────────────────────────────────────────────────
    page = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', page)
    page = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', page)
    page = re.sub(r'<meta name="keywords" content=".*?">', f'<meta name="keywords" content="{keywords}">', page)
    
    # ── OG / Twitter Tags ───────────────────────────────────────────────────
    page = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', page)
    page = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{desc}">', page)
    page = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="{canonical}">', page)
    page = re.sub(r'<meta name="twitter:title" content=".*?">', f'<meta name="twitter:title" content="{title}">', page)
    page = re.sub(r'<meta name="twitter:description" content=".*?">', f'<meta name="twitter:description" content="{desc}">', page)
    
    # ── Canonical & hreflang per page ───────────────────────────────────────
    page = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical}">', page)
    # Update hreflang href
    page = re.sub(r'<link rel="alternate" hreflang="en-IN" href=".*?">', 
                  f'<link rel="alternate" hreflang="en-IN" href="{canonical}">', page)
    page = re.sub(r'<link rel="alternate" hreflang="x-default" href=".*?">', 
                  f'<link rel="alternate" hreflang="x-default" href="{canonical}">', page)

    # ── Hero H1 & Description ───────────────────────────────────────────────
    h1_content = f'<span class="title-navy">{h1}</span>'
    page = re.sub(r'(<h1 class="hero-main-title">)(.*?)(</h1>)', rf'\1{h1_content}\3', page, flags=re.DOTALL)
    page = re.sub(r'<p class="hero-description".*?>.*?</p>', f'<p class="hero-description">{desc}</p>', page, flags=re.DOTALL)

    # ── Lead Form Pre-fill ──────────────────────────────────────────────────
    if category == 'locations':
        page = re.sub(r'(id="lead-city" name="city"[^>]*)>', rf'\1 value="{name}">', page)
    elif category in ['tests', 'packages']:
        page = page.replace('id="selected-package-box" style="display:none;', 
                           'id="selected-package-box" style="display:flex;')
        page = page.replace('<strong id="package-title-text" style="font-weight:700;">Full Body Checkup</strong>', 
                           f'<strong id="package-title-text" style="font-weight:700;">{name}</strong>')
        init_pkg = f'<script>document.addEventListener("DOMContentLoaded",function(){{if(typeof currentSelectedPackage!=="undefined")currentSelectedPackage="{name}";}});</script>'
        page = page.replace('</body>', f'{init_pkg}\n</body>')

    # ── Schema JSON-LD ──────────────────────────────────────────────────────
    schema_obj = build_page_schema(category, item, canonical, cat_label, cat_url, faqs)
    schema_str = f'<script type="application/ld+json">\n{json.dumps(schema_obj, indent=2, ensure_ascii=False)}\n</script>'
    page = re.sub(r'<script type="application/ld\+json">.*?</script>', schema_str, page, count=1, flags=re.DOTALL)

    # ── SEO Details Section (Highlights + CTA) ──────────────────────────────
    raw_points = item.get('keyPoints', item.get('highlights', []))
    if isinstance(raw_points, list) and raw_points:
        highlights_html = "".join([f'<li style="margin-bottom:8px;line-height:1.5;"><span style="color:#00A0A8;font-weight:700;margin-right:8px;">✓</span> {h}</li>' for h in raw_points])
    else:
        highlights_html = '<li><span style="color:#00A0A8;font-weight:700;margin-right:8px;">✓</span> Free home sample collection by certified phlebotomist</li><li><span style="color:#00A0A8;font-weight:700;margin-right:8px;">✓</span> 100% NABL &amp; CAP accredited laboratory testing</li><li><span style="color:#00A0A8;font-weight:700;margin-right:8px;">✓</span> Digital reports delivered within 24 hours on WhatsApp</li>'
    
    turnaround = item.get('turnaround', '24-48 Hours Report')
    fasting_req = item.get('fasting', 'No special fasting required')
    overview = item.get('overview', desc)
    
    import urllib.parse
    if category == 'locations':
        banner_title = f"Book Blood Test in {name} at Home — 100% Free Collection"
        banner_sub = f"Certified phlebotomist at your doorstep in {name}. Reports on WhatsApp &amp; Email."
        about_title = f"About Blood Test at Home in {name} with Healthians"
        wa_text = f"Hello, I want to book a blood test at home in {name} from Healthians."
    elif category == 'tests':
        banner_title = f"Book {name} at Home — 100% Free Collection"
        banner_sub = "Certified phlebotomist at your doorstep. Reports on WhatsApp &amp; Email."
        about_title = f"About {name} with Healthians"
        wa_text = f"Hello, I want to book {name} at home from Healthians."
    elif category == 'packages':
        banner_title = f"Book {name} at Home — 100% Free Collection"
        banner_sub = "Certified phlebotomist at your doorstep. Reports on WhatsApp &amp; Email."
        about_title = f"About {name} with Healthians"
        wa_text = f"Hello, I want to book {name} at home from Healthians."
    elif category == 'services':
        banner_title = f"Book {name} — 100% Free Doorstep Collection"
        banner_sub = "Certified phlebotomist at your doorstep. Reports on WhatsApp &amp; Email."
        about_title = f"About {name} with Healthians"
        wa_text = f"Hello, I want to book {name} from Healthians."
    elif category == 'articles':
        banner_title = "Book Health Checkup at Home — 100% Free Collection"
        banner_sub = "Certified phlebotomist at your doorstep. Reports on WhatsApp &amp; Email."
        about_title = f"About {name} — Health Guide"
        wa_text = f"Hello, I have a query about {name} from Healthians."
    else:
        banner_title = f"Book {name} at Home — 100% Free Collection"
        banner_sub = "Certified phlebotomist at your doorstep. Reports on WhatsApp &amp; Email."
        about_title = f"About {name} with Healthians"
        wa_text = f"Hello, I want to book {name} from Healthians."

    wa_msg = urllib.parse.quote(wa_text)
    
    # Also update default wa.me text in footer & floating buttons to match the specific page
    default_wa_text = "Hello%2C%20I%20want%20to%20book%20a%20home%20blood%20test%20from%20Healthians."
    page = page.replace(default_wa_text, wa_msg)
    
    # Related city links (for test/package pages — internal linking boost)
    city_cross_links = ""
    if category in ['tests', 'packages']:
        cities = db.get('locations', [])[:10]
        city_links = "".join([
            f'<a href="/locations/{c["slug"]}/?test={slug}" style="color:#00A0A8;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #B2E0E3;border-radius:20px;background:#FFF;font-weight:500;">📍 {name} in {c["name"]}</a> '
            for c in cities
        ])
        city_cross_links = f'''
        <div style="margin-top:20px;">
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:0 0 8px 0;">📍 {name} Doorstep Collection Across Major Cities:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{city_links}</div>
        </div>'''
    
    # Related test & package links (for city pages)
    test_cross_links = ""
    localities_block = ""
    if category == 'locations':
        loc_list = item.get('localities', [])
        if loc_list:
            chips = "".join([f'<span style="display:inline-block;background:#FFF;border:1px solid #CBD5E1;border-radius:20px;padding:4px 12px;font-size:0.8rem;color:#1E293B;font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,0.03);">📍 {l}</span>' for l in loc_list])
            localities_block = f'''
          <div style="margin-top:20px;padding:16px 20px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
            <p style="font-size:0.92rem;font-weight:700;color:#0F172A;margin:0 0 10px 0;">📍 Free Doorstep Sample Pickup Across {name} Localities:</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">{chips}</div>
            <p style="font-size:0.78rem;color:#64748B;margin:10px 0 0 0;">✨ Certified, vaccinated phlebotomists arrive at your home or office in {name} within 60 minutes.</p>
          </div>'''

        tests = db.get('tests', [])[:6]
        t_links = "".join([
            f'<a href="/tests/{t["slug"]}/?city={slug}" style="color:#00A0A8;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #B2E0E3;border-radius:20px;background:#FFF;font-weight:500;">🧪 {t["name"]} in {name}</a> '
            for t in tests
        ])
        pkgs = db.get('packages', [])[:4]
        pkg_links = "".join([
            f'<a href="/packages/{p["slug"]}/?city={slug}" style="color:#0F766E;text-decoration:none;font-size:0.82rem;padding:5px 12px;border:1px solid #A7F3D0;border-radius:20px;background:#F0FDF4;font-weight:600;">📦 {p["name"]} in {name}</a> '
            for p in pkgs
        ])
        test_cross_links = f'''
        <div style="margin-top:20px;">
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:0 0 8px 0;">🧪 Most Booked Diagnostic Tests in {name}:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{t_links}</div>
          <p style="font-size:0.9rem;font-weight:700;color:#0F172A;margin:14px 0 8px 0;">📦 Popular Health Checkup Packages in {name}:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">{pkg_links}</div>
        </div>'''

    seo_section = f'''
    <!-- SEO DETAILS CONTENT BLOCK -->
    <section class="seo-details-section" aria-label="About {name}">
      <div class="container" style="max-width:1040px;margin:0 auto;">
        
        <!-- Breadcrumb -->
        <nav class="seo-breadcrumb-bar" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span class="seo-breadcrumb-sep">/</span>
          <a href="{cat_url}">{cat_label}</a>
          <span class="seo-breadcrumb-sep">/</span>
          <span style="color:#0F172A;font-weight:600;">{name}</span>
        </nav>

        <div class="seo-card-main">
          <!-- Meta Pills -->
          <div class="seo-meta-pills-row">
            <span class="seo-pill teal">🛡️ NABL &amp; CAP Verified Lab</span>
            <span class="seo-pill">⏱️ {turnaround}</span>
            <span class="seo-pill orange">🌡️ {fasting_req}</span>
            <span class="seo-pill" style="background:#FEF9C3;color:#78350F;">⭐ 4.8/5 Rating | 52,000+ Reviews</span>
          </div>

          <h2 class="seo-content-h2">{about_title}</h2>
          <p class="seo-text-p">{overview}</p>

          <div class="seo-key-highlights-box">
            <div class="seo-key-highlights-title">✅ Key Diagnostic Highlights &amp; Inclusions</div>
            <ul class="seo-highlights-list">{highlights_html}</ul>
          </div>

          {localities_block}

          <!-- Enterprise Diagnostic Comparison Table (Google Snippet Optimized) -->
          <div style="margin-top:24px;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <div style="background:#0F172A;color:#FFF;padding:12px 18px;font-size:0.92rem;font-weight:700;">
              📊 Healthians Home Collection vs. Traditional Diagnostic Labs
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.84rem;text-align:left;">
                <thead>
                  <tr style="background:#F1F5F9;color:#334155;font-weight:700;border-bottom:1px solid #E2E8F0;">
                    <th style="padding:10px 14px;">Service Feature</th>
                    <th style="padding:10px 14px;background:#E6F7F8;color:#0F766E;">Healthians Doorstep</th>
                    <th style="padding:10px 14px;">Offline Pathology Labs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Home Sample Pickup</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ 100% Free (Zero Visit Fee)</td>
                    <td style="padding:10px 14px;color:#64748B;">₹150 - ₹300 Extra / Wait in Queue</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA;">
                    <td style="padding:10px 14px;font-weight:600;">Accreditation Standard</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ NABL &amp; CAP Verified Labs</td>
                    <td style="padding:10px 14px;color:#64748B;">⚠️ Often Unregistered / Variable</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Digital WhatsApp Reports</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ Same Day / Within 24 Hours</td>
                    <td style="padding:10px 14px;color:#64748B;">⌛ Collect in person next day</td>
                  </tr>
                  <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA;">
                    <td style="padding:10px 14px;font-weight:600;">Doctor Consultation</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ Included Free of Charge</td>
                    <td style="padding:10px 14px;color:#64748B;">❌ Requires Separate Doctor Fee</td>
                  </tr>
                  <tr style="background:#FFF;">
                    <td style="padding:10px 14px;font-weight:600;">Sample Safety &amp; Cool-Box</td>
                    <td style="padding:10px 14px;color:#0F766E;font-weight:700;background:#F0FAFA;">✅ 2°C - 8°C Monitored &amp; Barcoded</td>
                    <td style="padding:10px 14px;color:#64748B;">⚠️ Manual Labeling &amp; Handling</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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

    # Inject SEO section before FAQ
    faq_marker = r'(<section class="section"[^>]*>\s*<div class="container">\s*<div class="section-head">\s*<span class="sec-tag"[^>]*>Clear Answers</span>)'
    if re.search(faq_marker, page):
        page = re.sub(faq_marker, f"{seo_section}\n\\1", page, count=1)
    else:
        page = page.replace('</main>', f"{seo_section}\n</main>")

    # ── FAQ Accordion Replace ───────────────────────────────────────────────
    if faqs:
        faq_items_html = ""
        for idx, faq in enumerate(faqs):
            faq_items_html += f'''
          <div class="faq-row" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <button type="button" class="faq-question-btn" aria-expanded="false" itemprop="name">
              <span>{faq["q"]}</span>
              <span class="faq-plus">+</span>
            </button>
            <div class="faq-answer-box" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <div class="faq-answer-inner" itemprop="text">{faq["a"]}</div>
            </div>
          </div>
'''
        page = re.sub(
            r'(<div class="faq-container-minimal">).*?(</div>\s*</div>\s*</section>)',
            rf'\1\n{faq_items_html}\n        \2',
            page, flags=re.DOTALL
        )

    # ── Write file ──────────────────────────────────────────────────────────
    out_file = f"{out_dir}/index.html"
    ensure_dir(out_file)
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(page)
    total_pages += 1
    return canonical


# ════════════════════════════════════════════════════════════════════════════
#  6. UPGRADE index.html MASTER TEMPLATE
# ════════════════════════════════════════════════════════════════════════════

print("[Step 1/5] Upgrading index.html master template with Pro India SEO tags...")

template = raw_template

# Add India SEO head block safely without touching stylesheets or scripts
india_head = build_pro_head_block()
if '<!-- ═══ START INDIA SEO SIGNALS ═══ -->' in template:
    template = re.sub(r'<!-- ═══ START INDIA SEO SIGNALS ═══ -->.*?<!-- ═══ END INDIA SEO SIGNALS ═══ -->', india_head, template, flags=re.DOTALL)
else:
    template = template.replace('</head>', f'{india_head}\n</head>')

# Upgrade homepage schema with AggregateRating + all pro nodes
homepage_schema_str = f'<script type="application/ld+json">\n{build_homepage_schema()}\n</script>'
template = re.sub(r'<script type="application/ld\+json">.*?</script>', 
                  homepage_schema_str, template, count=1, flags=re.DOTALL)

# Update keywords meta tag
homepage_kw = ("blood test at home, ghar pe blood test, home blood collection, "
               "full body checkup near me, diagnostic centre near me, "
               "lab test from home, blood test price India, health checkup packages, "
               "pathology lab near me, Healthians, NABL certified lab, "
               "free home sample collection, book blood test online India, "
               "Lal Path Lab vs Healthians, 60 minute sample pickup, "
               "blood test home delivery, health checkup at home India")
template = re.sub(r'<meta name="keywords" content=".*?">', 
                  f'<meta name="keywords" content="{homepage_kw}">', template)

# Add twitter card enhancement
if 'twitter:image:alt' not in template:
    template = template.replace('<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:card" content="summary_large_image">\n'
        '  <meta name="twitter:site" content="@Healthians">\n'
        '  <meta name="twitter:image:alt" content="Healthians Home Blood Test — Free Doorstep Sample Collection India">')

# Update lang attribute for India
template = template.replace('<html lang="en">', '<html lang="en-IN">')

# Build and inject internal linking directory
print("[Step 2/5] Building SEO internal linking directory...")
internal_links_block = build_internal_links_html()
new_footer_wrap = f"{internal_links_block}\n</footer>"

if '<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY' in template:
    template = re.sub(r'<!-- SEO ENTERPRISE INTERNAL LINKING DIRECTORY.*?</footer>', 
                      new_footer_wrap, template, flags=re.DOTALL)
elif '<!-- SEO INTERNAL LINKING BLOCK -->' in template:
    template = re.sub(r'<!-- SEO INTERNAL LINKING BLOCK -->.*?</footer>', 
                      new_footer_wrap, template, flags=re.DOTALL)
else:
    template = template.replace('</footer>', f"{internal_links_block}\n</footer>")

# Save upgraded index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(template)
print("[OK] index.html upgraded with Pro India SEO!")


# ════════════════════════════════════════════════════════════════════════════
#  7. GENERATE ALL 82+ LANDING PAGES
# ════════════════════════════════════════════════════════════════════════════

print("[Step 3/5] Generating all SEO landing pages with pro schemas...")

categories = ['locations', 'tests', 'packages', 'articles', 'services']
for cat in categories:
    items = db.get(cat, [])
    for item in items:
        url = generate_seo_page(cat, item, template)
        if url:
            print(f"  [OK] {url}")

print(f"\n[OK] Total pages generated: {total_pages}")


# ════════════════════════════════════════════════════════════════════════════
#  8. GENERATE SITEMAP INDEX + SUB-SITEMAPS (Healthians format)
# ════════════════════════════════════════════════════════════════════════════

print("\n[Step 4/5] Generating Sitemap Index + Child Sitemaps...")
import subprocess
subprocess.run(["python", "build_sitemaps.py"], check=True)


# ════════════════════════════════════════════════════════════════════════════
#  9. GENERATE robots.txt (pro-grade)
# ════════════════════════════════════════════════════════════════════════════

print("\n[Step 5/5] Writing pro robots.txt...")

robots = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /?*

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: {BASE_URL}/sitemap.xml
"""

with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots)
print("[OK] robots.txt written")


# ════════════════════════════════════════════════════════════════════════════
#  DONE
# ════════════════════════════════════════════════════════════════════════════
print("")
print("=" * 60)
print("  PRO SEO MASTER BUILD v3.0 - COMPLETE!")
print("=" * 60)
print(f"  Total Landing Pages Generated : {total_pages}")
print(f"  Sitemap URLs                  : {len(sitemap_entries)}")
print("  Schema Types Applied          : WebPage, WebSite,")
print("                                  Organization, LocalBusiness,")
print("                                  MedicalClinic, DiagnosticLab,")
print("                                  MedicalTest, Product,")
print("                                  AggregateRating, FAQPage,")
print("                                  HowTo, Article, BreadcrumbList")
print("  India SEO Signals             : og:locale=en_IN,")
print("                                  hreflang=en-IN,")
print("                                  geo.region=IN,")
print("                                  Stars Rating Schema")
print("=" * 60)
print("  NEXT: git add -A, git commit, git push origin main")
print("=" * 60)

