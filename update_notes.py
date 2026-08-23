import pandas as pd
import json
import re
from rapidfuzz import process, fuzz

# ================== الإعدادات العامة ==================
CSV_PATH = 'fra_perfumes.csv'
NOTES_DICT_PATH = 'notes_dict.json'
ARABIC_NAMES_PATH = 'arabic_names.json'
PERFUMES_LIST_PATH = 'perfumes_list.txt'
OUTPUT_PATH = 'perfume_catalog.json'

# الماركات الفخمة (فئة أ)
LUXURY_BRANDS = ['creed', 'tom ford', 'amouage', 'roja', 'xerjoff', 'parfums de marly', 'initio', 'byredo']

# ================== دوال تحميل البيانات ==================
def load_fragrance_database():
    """قراءة قاعدة العطور الضخمة بحماية من الأخطاء"""
    try:
        df = pd.read_csv(CSV_PATH, sep=',', engine='python', on_bad_lines='skip')
        # إزالة الفراغات من الأسماء وتحويلها لحروف صغيرة للمطابقة
        db_dict = {}
        for _, row in df.iterrows():
            name = str(row.get('Name', row.get('name', ''))).strip().lower()
            if name and name != 'nan':
                db_dict[name] = row
        print(f"[✓] تم تحميل قاعدة العطور: {len(db_dict)} عطر.")
        return db_dict
    except Exception as e:
        print(f"[!] تحذير: تعذر تحميل قاعدة البيانات الكبيرة، سيتم الاعتماد على القائمة فقط. ({e})")
        return {}

def load_json_file(path):
    """تحميل ملفات JSON بأمان"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

# ================== دوال المعالجة والترجمة ==================
def translate_notes(pyramid_str, notes_map):
    """فك تشفير الهرم العطري (افتتاحية/قلب/قاعدة) وتحويل الأرقام لأسماء"""
    notes = {"top": [], "heart": [], "base": []}
    if not isinstance(pyramid_str, str):
        return notes

    # الأقسام: top, middle, base
    for key, regex in [('top', r'top\((.*?)\)'), ('heart', r'middle\((.*?)\)'), ('base', r'base\((.*?)\)')]:
        match = re.search(regex, pyramid_str)
        if match:
            for raw_note in match.group(1).split(';'):
                if not raw_note:
                    continue
                # استخراج الرقم (n123) وتحويله لاسم
                note_id = raw_note.split(',')[0].replace('n', '').strip()
                notes[key].append(notes_map.get(note_id, note_id))

    return notes

def generate_smart_prices(brand_name):
    """توليد الأسعار الأربعة بناءً على فخامة البراند"""
    if any(b in brand_name.lower() for b in LUXURY_BRANDS):
        # فئة أ (فخم)
        return {"extra": 30.0, "edp": 20.0, "edt": 15.0, "commercial": 8.0}
    else:
        # فئة ب (عادي)
        return {"extra": 20.0, "edp": 15.0, "edt": 10.0, "commercial": 5.0}

def build_image_url(pid, db_item):
    """توليد رابط الصورة بأمان (ID الخاص بك أولاً، ثم من قاعدة البيانات)"""
    if pid:
        # الروابط المباشرة من CDN (مضمونة)
        return f"https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/images/{pid}.jpg"
    
    # خطة بديلة من قاعدة البيانات
    if db_item:
        raw_photo = str(db_item.get('main_photo', ''))
        if raw_photo and raw_photo != 'nan':
            return raw_photo

    return ""

# ================== الدالة الرئيسية ==================
def main():
    print("⏳ بدء عملية بناء الكتالوج الاحترافي...")
    
    # تحميل الملفات الأساسية
    db_dict = load_fragrance_database()
    notes_map = load_json_file(NOTES_DICT_PATH)
    arabic_map = load_json_file(ARABIC_NAMES_PATH)
    
    # قراءة قائمة العطور الخاصة بك
    with open(PERFUMES_LIST_PATH, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip() and 'السعر' not in line]

    catalog = []
    
    for line in lines:
        # استخراج الكود (PID)
        match = re.search(r'\(الكود:\s*(\d+)', line)
        pid = match.group(1) if match else ""
        
        # تنظيف الاسم لتسهيل البحث
        clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
        search_name = clean_name.split('-')[0].split('(')[0].strip()
        
        # المطابقة الذكية (Fuzzy Match) مع قاعدة البيانات
        brand = 'THE MASK'
        notes = {"top": [], "heart": [], "base": []}
        
        result = process.extractOne(search_name.lower(), db_dict.keys(), scorer=fuzz.token_set_ratio)
        if result and result[1] > 50:
            item = db_dict[result[0]]
            brand_raw = str(item.get('Brand', item.get('brand', 'THE MASK')))
            brand = brand_raw.split(';')[0].upper() if brand_raw != 'nan' else 'THE MASK'
            notes = translate_notes(item.get('notes_pyramid', ''), notes_map)

        # الاسم العربي (من ملف الأسماء العربية)
        name_ar = arabic_map.get(clean_name.upper(), clean_name)
        
        # توليد الصور والأسعار
        image_url = build_image_url(pid, result[1] > 50 if result else None)
        prices = generate_smart_prices(brand)

        # إضافة العطر للكتالوج
        catalog.append({
            "name": clean_name.upper(),
            "name_ar": name_ar,
            "brand": brand,
            "prices": prices,
            "image": image_url,
            "top_notes": notes['top'],
            "heart_notes": notes['heart'],
            "base_notes": notes['base']
        })

    # حفظ الملف النهائي
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=4)
    
    print(f"🎉 تم بناء الكتالوج الاحترافي بنجاح! ({len(catalog)} عطر) (الصور والنوتات والأسعار والأسماء العربية جاهزة).")

if __name__ == "__main__":
    main()
