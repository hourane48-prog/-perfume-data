import os, json, re, time
import requests
import pandas as pd
from rapidfuzz import process, fuzz

# إنشاء مجلد للصور
os.makedirs('images', exist_ok=True)

# ترويسة المتصفح
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'https://www.fragrantica.com/'
}

def get_notes(pyramid_str):
    notes = {"top": [], "heart": [], "base": []}
    if not isinstance(pyramid_str, str) or pyramid_str == 'nan': return notes
    for key, regex in [('top', r'top\((.*?)\)'), ('heart', r'middle\((.*?)\)'), ('base', r'base\((.*?)\)')]:
        match = re.search(regex, pyramid_str)
        if match:
            for note in match.group(1).split(';'):
                if not note: continue
                nid = note.split(',')[0].replace('n', '').strip()
                # سنترك الأكواد مؤقتاً بدون قاموس حتى لا تتعطل
                notes[key].append(nid)
    return notes

# ⏳ قراءة قاعدة البيانات الضخمة (32MB)
print("⏳ جاري تحميل قاعدة البيانات الضخمة (32MB)...")
name_to_record = {}
try:
    # استخدام sep='|' لتخمين الفاصل تلقائياً
    df = pd.read_csv('fra_perfumes.csv', sep='|', engine='python', on_bad_lines='skip')
    for row in df.to_dict('records'):
        name = str(row.get('name', '')).lower()
        if name and name != 'nan':
            name_to_record[name] = row
    print(f"✅ تم تحميل {len(name_to_record)} عطر من الملف الكبير.")
except Exception as e:
    print(f"⚠️ تعذر قراءة الملف الكبير (سيتم الاعتماد على البحث المباشر): {e}")

# قراءة القائمة
try:
    with open('perfumes_list.txt', 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip() and "السعر" not in line]
except:
    print("❌ ملف القائمة غير موجود!")
    exit()

catalog = []
print(f"🚀 بدء السحب لـ {len(lines)} عطراً...")

for idx, line in enumerate(lines, 1):
    match = re.search(r'\(الكود:\s*(\d+)', line)
    sku = match.group(1) if match else f"NO_CODE_{idx}"

    clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
    search_name = clean_name.split('-')[0].split('(')[0].strip()

    # 🔍 البحث في القاعدة الكبيرة
    db_item = {}
    search_result = process.extractOne(search_name.lower(), name_to_record.keys(), scorer=fuzz.token_set_ratio)
    if search_result and search_result[1] > 70:
        db_item = name_to_record[search_result[0]]

    notes = get_notes(db_item.get('notes_pyramid', ''))
    brand = "THE MASK"
    image_source_url = ""

    # 🟢 1. إذا وجدناه في القاعدة الكبيرة، استخدم الـ PID الحقيقي
    if db_item:
        brand = str(db_item.get('brand', 'THE MASK')).split(';')[0].upper()
        pid = str(db_item.get('pid', ''))
        if pid and pid != 'nan':
            image_source_url = f"https://fimgs.net/mdimg/perfume/m.{pid}.jpg"

    # 🟡 2. إذا لم نجده في القاعدة، نجرب الرابط بكودك الخاص
    if not image_source_url and sku:
        image_source_url = f"https://fimgs.net/mdimg/perfume/m.{sku}.jpg"

    # 🔴 3. إذا فشل كل ما سبق، نبحث مباشرة في موقع Fragrantica
    if not image_source_url or "Not Found" in image_source_url:
        try:
            search_url = f"https://www.fragrantica.com/search/?query={search_name.replace(' ', '+')}"
            search_res = requests.get(search_url, headers=HEADERS, timeout=10)
            product_link = re.search(r'href="(/perfume/[^"]+)"', search_res.text)
            if product_link:
                page_res = requests.get("https://www.fragrantica.com" + product_link.group(1), headers=HEADERS, timeout=10)
                og_image = re.search(r'<meta property="og:image" content="([^"]+)"', page_res.text)
                if og_image:
                    image_source_url = og_image.group(1)
                brand_match = re.search(r'<span class="brand-name">([^<]+)</span>', page_res.text)
                if brand_match:
                    brand = brand_match.group(1).upper()
        except:
            pass

    # تحميل الصورة
    filename = f"images/{sku}.jpg"
    github_image = f"https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/images/{sku}.jpg"

    if image_source_url.startswith('http') and not os.path.exists(filename):
        try:
            r = requests.get(image_source_url, headers=HEADERS, timeout=15)
            if r.status_code == 200 and len(r.content) > 1000:
                with open(filename, 'wb') as f_img:
                    f_img.write(r.content)
                print(f"[{idx}/{len(lines)}] 📸 تم تحميل: {search_name}")
            else:
                github_image = ""
                print(f"[{idx}/{len(lines)}] ⚠️ غير موجود: {search_name}")
        except:
            github_image = ""
            print(f"[{idx}/{len(lines)}] ❌ خطأ: {search_name}")
    elif os.path.exists(filename):
        print(f"[{idx}/{len(lines)}] ✅ موجود: {search_name}")
    else:
        github_image = ""
        print(f"[{idx}/{len(lines)}] ⚠️ لا مصدر: {search_name}")

    prices = {"extra": 35.0, "edp": 25.0, "edt": 15.0, "commercial": 10.0} if any(p in brand.lower() for p in ['creed', 'amouage', 'roja', 'xerjoff', 'tom ford', 'marly', 'initio', 'byredo']) else {"extra": 25.0, "edp": 18.0, "edt": 12.0, "commercial": 6.0}

    catalog.append({
        "name": clean_name.upper(),
        "brand": brand,
        "prices": prices,
        "image": github_image,
        "top_notes": notes['top'],
        "heart_notes": notes['heart'],
        "base_notes": notes['base']
    })
    time.sleep(0.3)

with open('perfume_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)

print(f"\n🎉 انتهى! تم تجهيز الكتالوج لـ {len(catalog)} عطر.")
