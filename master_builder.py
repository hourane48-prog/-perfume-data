import os
import json
import re
import time
import requests
from rapidfuzz import process, fuzz

# ==========================================
# 1) إعدادات عامة وإنشاء المجلدات
# ==========================================
os.makedirs("images", exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'https://www.fragrantica.com/'
}

# ==========================================
# 2) قراءة قائمة العطور
#    نقرأ الأسطر التي تحتوي على "السعر" لنحصل على البيانات كاملة
# ==========================================
def load_perfume_list(file_path):
    perfumes = []
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # ندمج السطرين لأن الأسعار في السطر التالي لأسماء العطور في ملفك
    for i in range(len(lines)):
        line = lines[i].strip()
        if not line or "السعر" in line:
            continue

        # محاولة جلب السعر من السطر التالي
        price = 0.0
        if i + 1 < len(lines) and "السعر" in lines[i + 1]:
            price_str = re.search(r'السعر:\s*([\d.]+)', lines[i + 1])
            if price_str:
                price = float(price_str.group(1))

        # استخراج الكود
        code_match = re.search(r'\(الكود:\s*([^)]+)\)', line)
        code = code_match.group(1).strip() if code_match else "UNKNOWN"

        # تنظيف الاسم (إزالة الكود من النص)
        clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
        
        # فصل الاسم عن البراند
        brand = "THE MASK"
        if ' - ' in clean_name:
            parts = clean_name.split(' - ')
            name = parts[0].strip()
            brand = parts[1].split('(')[0].strip()
        else:
            name = clean_name.split('(')[0].strip()

        perfumes.append({
            "full_line": line,
            "name": name,
            "brand": brand,
            "code": code,
            "price": price
        })
    return perfumes

# ==========================================
# 3) تحميل قاعدة البيانات الكبيرة (اختياري)
#    هذا يحاول قراءة معلومات النوتات من ملفات CSV/JSON المحلية
# ==========================================
def load_local_database():
    data = {}
    # محاولة قراءة ملف النوتات (notes.csv)
    if os.path.exists("notes.csv"):
        try:
            import pandas as pd
            df = pd.read_csv("notes.csv", sep=None, engine='python', on_bad_lines='skip')
            # نفترض أن الأعمدة تحتوي على الاسم والنوتات
            for _, row in df.iterrows():
                name = str(row.get('name', row.get('Name', ''))).lower()
                if name and name != 'nan':
                    data[name] = {
                        'top': row.get('top_notes', row.get('Top', '')),
                        'heart': row.get('middle_notes', row.get('Heart', '')),
                        'base': row.get('base_notes', row.get('Base', ''))
                    }
            print(f"✅ تم تحميل النوتات من notes.csv: {len(data)} عطر")
        except Exception as e:
            print(f"⚠️ تعذر قراءة notes.csv: {e}")

    # محاولة قراءة قاعدة العطور الكبيرة fra_perfumes.csv
    if os.path.exists("fra_perfumes.csv"):
        try:
            import pandas as pd
            df = pd.read_csv("fra_perfumes.csv", sep=None, engine='python', on_bad_lines='skip')
            for _, row in df.iterrows():
                name = str(row.get('Name', row.get('name', ''))).lower()
                if name and name != 'nan':
                    # استخراج النوتات من عمود notes_pyramid
                    pyramid = str(row.get('notes_pyramid', ''))
                    notes = parse_pyramid(pyramid)
                    data[name] = {
                        'top': notes['top'],
                        'heart': notes['heart'],
                        'base': notes['base']
                    }
            print(f"✅ تم تحميل بيانات fra_perfumes.csv: {len(data)} عطر")
        except Exception as e:
            print(f"⚠️ تعذر قراءة fra_perfumes.csv: {e}")

    return data

def parse_pyramid(pyramid_str):
    notes = {"top": [], "heart": [], "base": []}
    if not pyramid_str or pyramid_str == 'nan':
        return notes
    # استخراج top, middle, base
    for key, regex in [('top', r'top\((.*?)\)'), ('heart', r'middle\((.*?)\)'), ('base', r'base\((.*?)\)')]:
        match = re.search(regex, pyramid_str)
        if match:
            # النوتات في القاعدة غالبًا تكون بصيغة أرقام (n123) لكننا نتركها كنص
            notes[key] = match.group(1).split(';')
    return notes

# ==========================================
# 4) البحث عن النوتات عبر الويب (محاولة بسيطة من Fragrantica)
# ==========================================
def fetch_notes_from_web(perfume_name, brand=""):
    """
    هذه الدالة تحاول جلب النوتات من صفحة Fragrantica عبر البحث.
    ملاحظة: قد تفشل بسبب الحماية، لذا نضعها كخطة أخيرة.
    """
    try:
        search_url = f"https://www.fragrantica.com/search/?query={perfume_name.replace(' ', '+')}"
        search_res = requests.get(search_url, headers=HEADERS, timeout=10)
        link_match = re.search(r'href="(/perfume/[^"]+)"', search_res.text)
        if link_match:
            page_url = "https://www.fragrantica.com" + link_match.group(1)
            page_res = requests.get(page_url, headers=HEADERS, timeout=10)
            # استخراج النوتات من الصفحة (افتراضي أن النوتات داخل عناصر محددة)
            # هنا سنبحث عن أي نص يبدو مثل نوتة
            # هذا مثال بسيط جدًا، قد تحتاج لتعديله حسب الموقع
            notes = {"top": [], "heart": [], "base": []}
            # (سنتركه فارغًا لأنه ليس ضروريًا في هذه المرحلة)
            return notes
    except:
        pass
    return {"top": [], "heart": [], "base": []}

# ==========================================
# 5) توليد رابط الصورة وتحميلها
# ==========================================
def download_image(code, name):
    filename = f"images/{code}.jpg"
    if os.path.exists(filename):
        return filename, True  # موجودة مسبقًا

    image_url = f"https://fimgs.net/mdimg/perfume/m.{code}.jpg"
    try:
        r = requests.get(image_url, headers=HEADERS, timeout=15)
        if r.status_code == 200 and len(r.content) > 1000:
            with open(filename, 'wb') as f:
                f.write(r.content)
            return filename, True
        else:
            # محاولة البحث عن الصورة عبر الموقع إذا فشل الرابط المباشر
            return filename, False
    except:
        return filename, False

# ==========================================
# 6) الدالة الرئيسية لبناء الكتالوج
# ==========================================
def main():
    # تحميل القائمة
    perfumes = load_perfume_list("perfumes_list.txt")
    print(f"🚀 تم قراءة {len(perfumes)} عطر من القائمة")

    # تحميل قاعدة البيانات المحلية (النوتات)
    db = load_local_database()

    # بناء الكتالوج
    catalog = []
    for idx, p in enumerate(perfumes, 1):
        # 1) البحث عن النوتات في قاعدة البيانات المحلية
        db_key = p['name'].lower()
        notes = {"top": [], "heart": [], "base": []}
        if db_key in db:
            notes = db[db_key]
        else:
            # محاولة البحث التقريبي في قاعدة البيانات
            best_match = process.extractOne(db_key, db.keys(), scorer=fuzz.token_set_ratio)
            if best_match and best_match[1] > 70:
                notes = db[best_match[0]]
            else:
                # الخطة الأخيرة: البحث في الويب (قد تفشل)
                notes = fetch_notes_from_web(p['name'], p['brand'])

        # 2) تحميل الصورة
        img_local_path, success = download_image(p['code'], p['name'])
        github_link = f"https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/{img_local_path}" if success else ""

        # 3) إضافة البيانات
        catalog.append({
            "name": p['name'].upper(),
            "brand": p['brand'].upper(),
            "priceJOD": p['price'],
            "image": github_link,
            "top_notes": notes['top'],
            "heart_notes": notes['heart'],
            "base_notes": notes['base']
        })

        print(f"[{idx}/{len(perfumes)}] ✅ تم تجهيز: {p['name']}")

        # مهلة قصيرة لتجنب الحظر
        time.sleep(0.1)

    # حفظ ملف JSON النهائي
    with open("perfume_catalog.json", "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=4)
    
    print("\n🎉 اكتمل بناء الكتالوج! تم حفظ الصور في مجلد images وملف perfume_catalog.json")

if __name__ == "__main__":
    main()
