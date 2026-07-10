#!/usr/bin/env python3
"""Fetch the live aromaroastco.com Shopify catalog and transform it into the
Storefront-API-shaped seed at src/data/seed.json.

Usage:  python3 scripts/build-seed.py
"""
import json, re, html, os, urllib.request

BASE = 'https://aromaroastco.com'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'seed.json')

def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=60) as r:
        return json.load(r)

COLS = ['coffee','exotic-drinks','gummy','nuts-seeds','snacks','cjhoci','spices-herbs','trays-sets-and-gifts','turkish']

# ---------- curated Arabic titles (translations of real product names only) ----------
AR = {
  "Pistachios Salted": "فستق حلبي مملح",
  "Pistachios BBQ": "فستق حلبي باربكيو",
  "Pistachios Unsalted Raw": "فستق حلبي نيء",
  "Cashews Salted": "كاجو مملح",
  "Cashews Spicy": "كاجو حار",
  "Cashews Smoked": "كاجو مدخن",
  "Cashews Mix": "كاجو مشكل",
  "Cashews BBQ": "كاجو باربكيو",
  "Cashews Cheese": "كاجو بالجبنة",
  "Cashews Ketchup": "كاجو بالكاتشب",
  "Cashews Corn": "كاجو مغلف بالذرة",
  "Almonds Salted": "لوز مملح",
  "Almonds Smoked": "لوز مدخن",
  "Hazelnuts Salted": "بندق مملح",
  "Hazelnuts Salted Roasted": "بندق محمص مملح",
  "Pecans Honey Roasted": "جوز البقان بالعسل",
  "Peanuts Jumbo Salted Roasted": "فول سوداني جامبو محمص",
  "Mixed Nuts with Seeds": "مكسرات مشكلة بالبزر",
  "Mixed Nuts without Seeds or Peanuts": "مكسرات مشكلة بدون بزر",
  "BBQ Mixed Nuts": "مكسرات مشكلة باربكيو",
  "Egyptian Seeds": "لب مصري",
  "Palestinian Seeds BBQ": "بزر فلسطيني باربكيو",
  "Abu Nugta Palestinian Seeds Salted": "بزر أبو نقطة فلسطيني مملح",
  "Abu Nugta Palestinian Seeds Unsalted": "بزر أبو نقطة فلسطيني بدون ملح",
  "Watermelon Seeds Salted": "بزر بطيخ مملح",
  "Watermelon Seeds Lemon": "بزر بطيخ بالليمون",
  "Watermelon Seeds Irani": "بزر إيراني",
  "Pumpkin Seeds Salted": "بزر قرع مملح",
  "Pumpkin Seeds Unsalted": "بزر قرع بدون ملح",
  "Pumpkin Seeds BBQ": "بزر قرع باربكيو",
  "Squash Seeds Salted": "بزر أبيض مملح",
  "Squash Seeds BBQ": "بزر أبيض باربكيو",
  "Sunflower Seeds Salted": "بزر عباد الشمس مملح",
  "Sunflower Seeds Unsalted": "بزر عباد الشمس بدون ملح",
  "Corn Nuts Mix": "ذرة محمصة مشكلة",
  "Corn Nuts Salted": "ذرة محمصة مملحة",
  "Corn Nuts Roasted": "ذرة محمصة",
  "Corn Nuts Spicy": "ذرة محمصة حارة",
  "Corn Nuts BBQ": "ذرة محمصة باربكيو",
  "Corn Nuts Cheese": "ذرة محمصة بالجبنة",
  "Mixed Japanese Beans": "فول ياباني مشكل",
  "Green Peas Salted": "بازلاء محمصة مملحة",
  "Fava Beans(Ful)": "فول محمص",
  "Chickpeas": "حمص محمص",
  "Rice Crackers": "مقرمشات أرز",
  "Rice Crackers Sesame Mix": "مقرمشات أرز بالسمسم",
  "Mixed Snacks": "مقرمشات مشكلة",
  "Kaboki Nuts": "كبوكي",
  "Mayasi Mix": "مياسي مشكل",
  "Mayasi Pizza": "مياسي بيتزا",
  "Mayasi Spicy": "مياسي حار",
  "Mayasi BBQ": "مياسي باربكيو",
  "Mayasi Smoked": "مياسي مدخن",
  "Mayasi Corn": "مياسي ذرة",
  "Mayasi Corn Deluxe": "مياسي ذرة ديلوكس",
  "Mixed Chocolates": "شوكولاتة مشكلة",
  "Mixed Gummies": "حلوى جيلي مشكلة",
  "Mixed Turkish Delights": "راحة مشكلة",
  "Palestinian Delights": "راحة فلسطينية",
  "Mamool w/Dates": "معمول بالتمر",
  "Mamool w/Pistachio": "معمول بالفستق",
  "Mix Pack Mamool/Barazek/Ghraybeh": "تشكيلة معمول وبرازق وغريبة",
  "Mini Baklawa mix": "بقلاوة مشكلة",
  "Halawa Vanilla": "حلاوة بالفانيلا",
  "Halawa Vanilla with Chocolate": "حلاوة بالشوكولاتة",
  "Sesame Seed Bars": "سمسمية",
  "Black Seed Sesame Squares Crunchy": "سمسمية بحبة البركة",
  "Mini Fingers Strawberry": "أصابع ميني بالفراولة",
  "Mini Fingers Apricot": "أصابع ميني بالمشمش",
  "Mini Fingers Chocolate": "أصابع ميني بالشوكولاتة",
  "Coffee": "قهوة محمصة",
  "Coffee Mixed with Cardamom": "قهوة بالهيل",
  "SHAMOUT SHAMIAH COFFEE": "قهوة شامية شموط",
  "KARAK TEA original": "شاي كرك",
  "KARAK TEA Cardamom": "شاي كرك بالهيل",
  "Chai masala": "شاي ماسالا",
  "Chai Adan with ginger": "شاي عدني بالزنجبيل",
  "Nescafe EMARATS 3 in1": "نسكافيه الإمارات ٣ في ١",
  "Sage": "ميرمية",
  "Zohorat": "زهورات",
  "Zatar Palestinian": "زعتر فلسطيني",
  "Zatar Halaby/Dukkah": "زعتر حلبي / دقة",
  "Zatar Manakeesh": "زعتر مناقيش",
  "Zatar Moloki": "زعتر ملوكي",
  "Zatar Leaves (Thyme)": "أوراق زعتر",
  "Sumac": "سماق",
  "Sumac Baladi": "سماق بلدي",
  "Saffron": "زعفران",
  "Cardamom Whole": "هيل حب",
  "Cardamom Ground": "هيل مطحون",
  "Seven Spice": "سبع بهارات",
  "Baharat": "بهارات مشكلة",
  "Mansaf Spice": "بهارات منسف",
  "Maklouba Spice": "بهارات مقلوبة",
  "Kabsah Ground": "بهارات كبسة مطحونة",
  "Kabsah Whole": "بهارات كبسة حب",
  "Mandi Spice": "بهارات مندي",
  "Falafel Spice": "بهارات فلافل",
  "Shawarma Chicken Spice": "بهارات شاورما دجاج",
  "Shawarma Meat Spice": "بهارات شاورما لحمة",
  "Aleppo Pepper": "فلفل حلبي",
  "Karkaday (Hibiscus)": "كركديه",
  "Licorice (Erk Sous)": "عرق سوس",
  "Mlokhia Ground Dry": "ملوخية ناشفة",
  "Arabic Gum (Samagh)": "صمغ عربي",
  "Mahlab Whole": "محلب حب",
  "Mahlab Ground": "محلب مطحون",
  "Miska": "مسكة",
  "Rose Petals": "بتلات ورد",
  "Nestle Damak Ala Milk with Pistachio": "دماك حليب بالفستق",
  "Nestle Damak Ala Chocolate with Pistachio": "دماك شوكولاتة بالفستق",
  "NUTELLA Biscuits": "بسكويت نوتيلا",
  "Kinder bueno mini": "كيندر بوينو ميني",
  "Freez Lychee": "فريز ليتشي",
  "Blu watermelon": "بلو بطيخ",
  "POPPING FRUIT Fruit Jellies Jungle": "جيلي فواكه",
  "POPPING FRUIT Fruit Jellies Bag": "جيلي فواكه",
  "Liban Dakar": "لبان ذكر",
  "KOPIKO Coffee Candy Jar": "سكاكر كوبيكو بالقهوة",
  "KOPIKO Cappuccino Candy Jar": "سكاكر كوبيكو كابتشينو",
  "Arabic coffee cup 12pc set": "طقم فناجين قهوة عربية ١٢ قطعة",
  "Glass Teacup & Saucer set": "طقم كاسات شاي زجاج مع صحون",
  "Metal Teacup(big) & Saucer set": "طقم كاسات شاي معدن كبير مع صحون",
  "Metal Teacup(small) & Saucer set": "طقم كاسات شاي معدن صغير مع صحون",
  "Trays 2pc set": "طقم صواني قطعتين",
  "Thermos": "ترمس",
}

# origin only when the product's own name states it
# merchant-confirmed halal (custom.halal metafield) — every product currently
# in the Gummies & Candies collection, confirmed by the merchant on 2026-07-04
HALAL_TITLES = {
  "Mixed Gummies",
  "POPPING FRUIT Fruit Jellies Jungle",
  "POPPING FRUIT Fruit Jellies Bag",
  "IMAS Jelly Fruit Candies",
  "IMAS Caremint Hard Candies",
}

ORIGIN_RULES = [
  (r'palestinian|abu nugta', 'Palestine'),
  (r'egyptian', 'Egypt'),
  (r'\birani\b|iranian', 'Iran'),
  (r'aleppo|halaby|shamiah', 'Syria'),
  (r'\badan\b|adeni', 'Yemen'),
  (r'emarats', 'UAE'),
  (r'^oman chips', 'Oman'),
  (r'turkish delight', 'Turkey'),
  (r'japanese', 'Japan'),
  (r'baladi', 'Palestine'),
]

def derive_tags(title, collections):
    t = title.lower()
    tags = set()
    def has(*words): return any(w in t for w in words)
    if 'nuts-seeds' in collections:
        if has('mixed nuts'): tags.add('mixed-nuts')
        if has('pistachio'): tags.add('pistachios')
        if has('cashew'): tags.add('cashews')
        if has('almond'): tags.add('almonds')
        if has('hazelnut','pecan','walnut'): tags.add('hazelnuts-pecans')
        if has('peanut') and not has('mayasi','kaboki'): tags.add('peanuts')
        if has('seeds','seed '): tags.add('seeds')
        if has('corn nuts','kaboki','mayasi','rice cracker','mixed snacks'): tags.add('crunchy-mixes')
        if has('chickpea','fava','peas','beans'): tags.add('roasted-legumes')
    if 'spices-herbs' in collections:
        if has('zatar',"za'atar",'dukkah'): tags.add('zaatar')
        if has('sage','zohorat','karkaday','licorice','sheeh','khallah','hindba','lavender','rose petals','sadr',"sa'namakkah",'ceysus','botony',"za'arour",'mlokhia','bay leaves','rosemary','mardakosh','oregano','chamomile'): tags.add('herbs-teas')
        if has('shawarma','kabsah','mansaf','maklouba','ouzi','mandi','kidra','seven spice','baharat','falafel','kuftah','kubah','kibbeh','shish','chicken spice','samna','tikka','bbq','hawaij','garam masala','curry','kabab'): tags.add('spice-blends')
        if has('sumac','paprika','cumin','coriander','turmeric','tumeric','cinnamon','clove','cardamom','ginger','fenugreek','galangal','all spice','black seed','aleppo','loomy','pomegranate peel'): tags.add('single-spices')
        if has('saffron','mahlab','miska','arabic gum','liban dakar'): tags.add('premium-pantry')
    if 'coffee' in collections:
        if has('karak','chai'): tags.add('karak-chai')
        if has('cardamom'): tags.add('cardamom-coffee')
        if has('nescafe','torabika','kopiko','3 in1'): tags.add('instant')
        if title in ('Coffee','Coffee Mixed with Cardamom','SHAMOUT SHAMIAH COFFEE'): tags.add('house-roast')
    if 'snacks' in collections:
        if has('chips','puffs','sticks','crackers','craxy','pufak','kitco','lays','corn balls','spiral'): tags.add('chips-crisps')
        if has('wafer','biscuit','oreo','loacker','croissant','break time','tawtaw','ali baba'): tags.add('biscuits-wafers')
        if has('chocolate','kinder','kitkat','galaxy','bounty','lion bar','maltesers','flake','damak','milka','nutella','torku','zaini','flakyto','shimmer'): tags.add('chocolate-bars')
        if has('mamool','baklawa','barazek','ghraybeh','halawa','sesame','mini fingers'): tags.add('arabic-sweets')
        if has('candy','lollipop','chupa','jelly','gummies','imas','kopiko'): tags.add('candy')
    if 'exotic-drinks' in collections:
        if has('juice','cappy','rani','shani','vimto','zakey','kahraman','chunks'): tags.add('juices')
        if has('freez','blu','fresher','schweppes','sprite','fanta','cocacola','sparkling'): tags.add('sparkling')
        if has('energy'): tags.add('energy-drinks')
        if has('iced coffee','milk'): tags.add('coffee-milk-drinks')
    if 'trays-sets-and-gifts' in collections:
        if has('cup','saucer','thermos','tray'): tags.add('serveware')
    for pat, origin in ORIGIN_RULES:
        if re.search(pat, t): tags.add('origin:' + origin)
    return sorted(tags)

def strip_html(s):
    return html.unescape(re.sub(r'<[^>]+>', ' ', s or '')).strip()

def money(amount): return {"amount": f"{float(amount):.2f}", "currencyCode": "USD"}

def img_node(im):
    if not im: return None
    return {"id": f"gid://shopify/ProductImage/{im['id']}", "url": im['src'],
            "altText": None, "width": im.get('width'), "height": im.get('height')}

# ---------- load (live) ----------
raw = []
seen = set()
pg = 1
while True:
    batch = fetch(f'/products.json?limit=250&page={pg}')['products']
    if not batch: break
    for p in batch:
        if p['id'] in seen: continue
        seen.add(p['id']); raw.append(p)
    if len(batch) < 250: break
    pg += 1

member = {}
for h in COLS:
    pg = 1
    while True:
        batch = fetch(f'/collections/{h}/products.json?limit=250&page={pg}')['products']
        if not batch: break
        for p in batch: member.setdefault(p['id'], []).append(h)
        if len(batch) < 250: break
        pg += 1

col_meta = {c['handle']: c for c in fetch('/collections.json?limit=250')['collections']}

products = []
for p in raw:
    cols = member.get(p['id'], [])
    tags = derive_tags(p['title'], cols)
    variants = []
    for v in p['variants']:
        sel = []
        for i, opt in enumerate(p['options']):
            val = v.get(f'option{i+1}')
            if val and val != 'Default Title':
                sel.append({"name": opt['name'], "value": val})
        variants.append({
            "id": f"gid://shopify/ProductVariant/{v['id']}",
            "title": v['title'],
            "availableForSale": bool(v['available']),
            "price": money(v['price']),
            "compareAtPrice": money(v['compare_at_price']) if v.get('compare_at_price') else None,
            "selectedOptions": sel,
            "sku": v.get('sku'),
        })
    prices = [float(v['price']) for v in p['variants']]
    options = [{"name": o['name'], "values": o['values']} for o in p['options'] if o['values'] != ['Default Title']]
    metafields = []
    if p['title'] in AR:
        metafields.append({"namespace": "custom", "key": "title_ar", "value": AR[p['title']]})
    origin = next((t.split(':',1)[1] for t in tags if t.startswith('origin:')), None)
    if origin:
        metafields.append({"namespace": "custom", "key": "origin", "value": origin})
    if p['title'] in HALAL_TITLES:
        metafields.append({"namespace": "custom", "key": "halal", "value": "true"})
    products.append({
        "id": f"gid://shopify/Product/{p['id']}",
        "handle": p['handle'],
        "title": p['title'],
        "description": strip_html(p['body_html']),
        "vendor": p['vendor'],
        "productType": p['product_type'],
        "tags": tags,
        "availableForSale": any(v['available'] for v in p['variants']),
        "createdAt": p['created_at'],
        "publishedAt": p['published_at'],
        "featuredImage": img_node(p['images'][0]) if p['images'] else None,
        "images": [img_node(im) for im in p['images']],
        "options": options,
        "priceRange": {"minVariantPrice": money(min(prices)), "maxVariantPrice": money(max(prices))},
        "variants": variants,
        "collections": cols,
        "metafields": metafields,
    })

collections = []
for h in COLS:
    c = col_meta[h]
    collections.append({
        "id": f"gid://shopify/Collection/{c['id']}",
        "handle": h,
        "title": c['title'],
        "description": c['description'] or "",
        "image": ({"url": c['image']['src'], "altText": c['title']} if c.get('image') else None),
    })

seed = {"shop": {"name": "AROMA", "description": "Roasted nuts, Arabic sweets, coffee and spices",
                 "primaryDomain": "https://aromaroastco.com", "currencyCode": "USD"},
        "collections": collections, "products": products}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(seed, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))

# report
from collections import Counter
tc = Counter()
for pr in products:
    for t in pr['tags']: tc[t] += 1
print('products:', len(products), '| with images:', sum(1 for x in products if x['featuredImage']),
      '| with arabic:', sum(1 for x in products if any(m['key']=='title_ar' for m in x['metafields'])),
      '| halal:', sum(1 for x in products if any(m['key']=='halal' for m in x['metafields'])))
print('under $10:', sum(1 for x in products if float(x['priceRange']['minVariantPrice']['amount']) < 10))
for t, n in sorted(tc.items()): print(f'  {t}: {n}')
print('size:', os.path.getsize(OUT)//1024, 'KB')
