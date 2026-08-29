import os, json, re, time
import requests
import pandas as pd
from rapidfuzz import process, fuzz

# إنشاء مجلد للصور
os.makedirs('images', exist_ok=True)

# ترويسة المتصفح لتجنب الحظر
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'https://www.fragrantica.com/'
}

# تحميل قاموس النوتات (لو موجود)
try:
    with open('notes_dict.json', 'r', encoding='utf-8') as f:
        notes_map = json.load(f)
except:
    notes_map = {}

# دالة لقراءة النوتات من ملف fragdb.csv الصحيح
def get_notes(pyramid_str):
    notes = {"top": [], "heart": [], "base": []}
    if not isinstance(pyramid_str, str) or pyramid_str == 'nan': return notes
    for key, regex in [('top', r'top\((.*?)\)'), ('heart', r'middle\((.*?)\)'), ('base', r'base\((.*?)\)')]:
        match = re.search(regex, pyramid_str)
        if match:
            for note in match.group(1).split(';'):
                if not note: continue
                nid = note.split(',')[0].replace('n', '').strip()
                if nid in notes_map: notes[key].append(notes_map[nid])
    return notes

print("⏳ جاري قراءة قاعدة البيانات...")
try:
    # 🔴 التعديل الحاسم: استخدام الفاصل "|" بدلاً من الفاصلة
    df = pd.read_csv('fragdb.csv', sep='|', engine='python', on_bad_lines='skip')
except Exception as e:
    print(f"❌ خطأ في القراءة: {e}")
    exit()

db_records = df.to_dict('records')
# بناء قاموس للبحث السريع بالاسم
name_to_record = {}
for row in db_records:
    name = str(row.get('name', '')).lower()
    if name and name != 'nan':
        name_to_record[name] = row

# قراءة قائمة عطورك
try:
    with open('perfumes_list.txt', 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip() and "السعر" not in line]
except:
    print("❌ ملف القائمة غير موجود!")
    exit()

catalog = []
print(f"🚀 بدء التحميل لـ {len(lines)} عطراً...")

for idx, line in enumerate(lines, 1):
    match = re.search(r'\(الكود:\s*(\d+)', line)
    if not match: match = re.search(r'\b(\d{5,7})\b', line)
    sku = match.group(1) if match else f"NO_CODE_{idx}"

    clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
    search_name = clean_name.split('-')[0].split('(')[0].strip()

    # البحث في قاعدة بيانات النوتات
    search_result = process.extractOne(search_name.lower(), name_to_record.keys(), scorer=fuzz.token_set_ratio)
    db_item = {}
    if search_result and search_result[1] > 65:
        db_item = name_to_record[search_result[0]]

    notes = get_notes(db_item.get('notes_pyramid', ''))
    brand_raw = str(db_item.get('brand', 'THE MASK')).split(';')[0].upper()
    brand = brand_raw if brand_raw and brand_raw != 'NAN' else 'THE MASK'

    # 🔴 التعديل الحاسم: بناء رابط الصورة من القاعدة مباشرة (وليس من رابط GitHub)
    pid = str(db_item.get('pid', ''))  # الحقل الصحيح في الملف هو "pid"
    if pid and pid != 'nan':
        image_source_url = f"https://fimgs.net/mdimg/perfume/m.{pid}.jpg"
    else:
        # في حال عدم وجود pid، نحاول استخدام الكود الخاص بك
        image_source_url = f"https://fimgs.net/mdimg/perfume/m.{sku}.jpg"

    filename = f"images/{sku}.jpg"
    # سيتم وضع الرابط المحلي أو رابط GitHub لاحقاً
    github_image = f"https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/images/{sku}.jpg"

    # تحميل الصورة
    if image_source_url.startswith('http') and not os.path.exists(filename):
        try:
            r = requests.get(image_source_url, headers=HEADERS, timeout=10)
            if r.status_code == 200 and len(r.content) > 1000:
                with open(filename, 'wb') as f_img:
                    f_img.write(r.content)
                print(f"[{idx}/{len(lines)}] 📸 تم تحميل: {search_name}")
            else:
                github_image = ""  # لا توجد صورة، نمسح الرابط
                print(f"[{idx}/{len(lines)}] ⚠️ الصورة غير موجودة: {search_name}")
        except Exception as e:
            github_image = ""
            print(f"[{idx}/{len(lines)}] ❌ خطأ في الاتصال: {search_name}")
    elif os.path.exists(filename):
        print(f"[{idx}/{len(lines)}] ✅ الصورة موجودة مسبقاً: {search_name}")
    else:
        github_image = ""
        print(f"[{idx}/{len(lines)}] ⚠️ لا يوجد رابط صورة: {search_name}")

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
    time.sleep(0.1)

with open('perfume_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)

print(f"\n🎉 تم الانتهاء! تم إنشاء الملف ورفع الصور للـ {len(catalog)} عطر.")
