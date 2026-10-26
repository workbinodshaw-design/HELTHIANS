import re, json

def check_page(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    title = re.search(r'<title>(.*?)</title>', html)
    desc = re.search(r'<meta name="description" content="(.*?)">', html)
    keywords = re.search(r'<meta name="keywords" content="(.*?)">', html)
    robots = re.search(r'<meta name="robots" content="(.*?)">', html)
    
    t = title.group(1) if title else 'MISSING'
    d = desc.group(1) if desc else 'MISSING'
    k = keywords.group(1) if keywords else 'MISSING'
    r = robots.group(1) if robots else 'MISSING'
    
    print(f"Path: {path}")
    print(f"  Title ({len(t)} chars): {t[:80]}")
    print(f"  Description ({len(d)} chars): {d[:100]}")
    print(f"  Keywords: {k[:80]}")
    print(f"  Robots: {r}")
    print()

check_page('tests/cbc-test/index.html')
check_page('locations/delhi/index.html')
check_page('packages/full-body-checkup/index.html')
check_page('articles/fasting-rules-before-blood-test/index.html')
check_page('index.html')
