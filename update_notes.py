import pandas as pd, json, re
from rapidfuzz import process, fuzz

# تحميل قاعدة البيانات
df = pd.read_csv('fragdb.csv', sep='|', encoding='utf-8')
db_dict = {str(row.get('name', '')).lower(): row for _, row in df.iterrows()}

# تحميل قاموس النوتات (تم تنزيله سابقاً)
try:
    with open('notes_dict.json', 'r', encoding='utf-8') as f:
        notes_map = json.load(f)
except:
    notes_map = {}

def get_notes(pyramid_str):
    notes = {"top": [], "heart": [], "base": []}
    if not isinstance(pyramid_str, str): return notes
    for key, regex in [('top', r'top\((.*?)\)'), ('heart', r'middle\((.*?)\)'), ('base', r'base\((.*?)\)')]:
        match = re.search(regex, pyramid_str)
        if match:
            for note in match.group(1).split(';'):
                note_id = note.split(',')[0].replace('n', '').strip()
                notes[key].append(notes_map.get(note_id, note_id))
    return notes

# المحاسب الآلي
luxury = ['creed', 'tom ford', 'amouage', 'roja', 'xerjoff', 'parfums de marly', 'initio', 'byredo']
def get_prices(brand):
    if any(b in brand.lower() for b in luxury):
        return {"extra": 30.0, "edp": 20.0, "edt": 15.0, "commercial": 8.0}
    return {"extra": 20.0, "edp": 15.0, "edt": 10.0, "commercial": 5.0}

with open('perfumes_list.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip() and "السعر" not in line]

catalog = []
for line in lines:
    match = re.search(r'\(الكود:\s*(\d+)', line); pid = match.group(1) if match else ""
    clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
    parts = clean_name.split(' - ')
    search_name = parts[-1].split('(')[0].strip() if len(parts) > 1 else clean_name.split('(')[0].strip()
    brand = 'THE MASK'
    result = process.extractOne(search_name.lower(), db_dict.keys(), scorer=fuzz.token_set_ratio)
    notes = {"top": [], "heart": [], "base": []}
    if result and result[1] > 65:
        item = db_dict[result[0]]
        brand_raw = str(item.get('brand', 'THE MASK'))
        brand = brand_raw.split(';')[0].upper() if brand_raw != 'nan' else 'THE MASK'
        notes = get_notes(item.get('notes_pyramid', ''))
    image_url = f"https://fimgs.net/mdimg/perfume/m.{pid}.jpg" if pid else ""
    catalog.append({
        "name": clean_name.upper(), "brand": brand, "prices": get_prices(brand),
        "image": image_url, "top_notes": notes['top'], "heart_notes": notes['heart'], "base_notes": notes['base']
    })

with open('perfume_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)
print(f"🎉 تم بناء الكتالوج النهائي بـ {len(catalog)} عطر!")
