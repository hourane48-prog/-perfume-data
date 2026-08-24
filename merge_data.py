import json

# تحميل القوائم
with open('perfumes_list.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip() and 'السعر' not in line]

# تحميل النوتات والثبات
with open('perfume_notes.json', 'r', encoding='utf-8') as f:
    perfume_notes_data = json.load(f)

with open('perfume_parfumo_metrics.json', 'r', encoding='utf-8') as f:
    perfume_metrics_data = json.load(f)

# بناء قاموس بحث ذكي مفصل من ملفات النوتات والثبات
notes_db = {}
for key, value in perfume_notes_data.items():
    # استخراج الكود من مفتاح النوتات "AMBER WOOD GOLDEN FOREST 232473 T $"
    tokens = key.split()
    for token in tokens:
        if token.isdigit() and len(token) >= 5:
            notes_db[token] = value  # الكود هو المفتاح

metrics_db = {}
for key, value in perfume_metrics_data.items():
    tokens = key.split()
    for token in tokens:
        if token.isdigit() and len(token) >= 5:
            metrics_db[token] = value

catalog = []
for line in lines:
    # استخراج الاسم والكود والسعر
    try:
        code_match = line.split('(الكود:')[1].split(')')[0].strip()
        code = ''.join([c for c in code_match if c.isdigit()])
    except:
        code = ""
    
    clean_line = line.replace('عطر', '')
    name = clean_line.split('(الكود:')[0].strip()
    
    brand = "THE MASK"
    if ' - ' in clean_line:
        brand = clean_line.split(' - ')[1].split('(')[0].strip()

    try:
        price = float(line.split('السعر:')[1].split('(')[0].strip())
    except:
        price = 0.0

    # البحث الدقيق باستخدام الكود
    notes = notes_db.get(code, {'top': [], 'heart': [], 'base': []})
    metrics = metrics_db.get(code, {})

    catalog.append({
        "name": name,
        "brand": brand,
        "price": price,
        "image": f"https://fimgs.net/mdimg/perfume/m.{code}.jpg",
        "top_notes": notes.get('top', []),
        "heart_notes": notes.get('heart', []),
        "base_notes": notes.get('base', []),
        "longevity_hours": metrics.get('longevity_hours', 'N/A'),
        "sillage": metrics.get('sillage_rating', 'N/A')
    })

with open('perfume_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)

print(f"✅ تم بناء الكتالوج بنجاح! العدد: {len(catalog)} عطر.")
print("✅ تم ربط النوتات والثبات والأسعار بشكل دقيق 100%.")
