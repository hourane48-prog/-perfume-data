import os, json, re, time
import requests
import pandas as pd
from rapidfuzz import process, fuzz

os.makedirs('images', exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'https://www.fragrantica.com/'
}

print("⏳ جاري تحميل قاعدة البيانات الكبيرة (31MB)...")
try:
    # 🔴 قراءة الملف الكبير بفاصلة (,) وليس ; أو |
    df = pd.read_csv('fra_perfumes.csv', sep=',', engine='python', on_bad_lines='skip')
    
    # 🧠 الخدعة الذكية: استخراج الـ PID الحقيقي من عمود URL
    name_to_pid = {}
    for index, row in df.iterrows():
        name = str(row.get('Name', '')).lower()
        url = str(row.get('url', ''))
        match = re.search(r'/(\d+)\.html', url)
        if match and name and name != 'nan':
            pid = match.group(1)
            name_to_pid[name] = pid
            
    print(f"✅ تم استخراج {len(name_to_pid)} معرّف حقيقي (PID) بنجاح!")
except Exception as e:
    print(f"❌ خطأ في قراءة الملف: {e}")
    exit()

# قراءة قائمتك
with open('perfumes_list.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip() and "السعر" not in line]

catalog = []
print(f"🚀 بدء السحب لـ {len(lines)} عطراً...")

for idx, line in enumerate(lines, 1):
    match = re.search(r'\(الكود:\s*(\d+)', line)
    sku = match.group(1) if match else f"NO_CODE_{idx}"

    clean_name = re.sub(r'\(الكود:.*?\)', '', line).strip()
    search_name = clean_name.split('-')[0].split('(')[0].strip()

    # 🔍 البحث باسمك داخل الملف الكبير
    search_result = process.extractOne(search_name.lower(), name_to_pid.keys(), scorer=fuzz.token_set_ratio)
    
    real_pid = ""
    if search_result and search_result[1] > 30:
        real_pid = name_to_pid[search_result[0]]
    
    # 🖼️ بناء رابط الصورة باستخدام الـ PID الحقيقي (أو كودك الخاص كخطة بديلة)
    image_source_url = f"https://fimgs.net/mdimg/perfume/m.{real_pid}.jpg" if real_pid else f"https://fimgs.net/mdimg/perfume/m.{sku}.jpg"

    filename = f"images/{sku}.jpg"
    github_image = f"https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/images/{sku}.jpg"

    if image_source_url.startswith('http') and not os.path.exists(filename):
        try:
            r = requests.get(image_source_url, headers=HEADERS, timeout=15)
            if r.status_code == 200 and len(r.content) > 1000:
                with open(filename, 'wb') as f_img:
                    f_img.write(r.content)
                print(f"[{idx}/{len(lines)}] ✅ تم تحميل: {search_name} (PID: {real_pid})")
            else:
                github_image = ""
                print(f"[{idx}/{len(lines)}] ⚠️ غير موجود: {search_name}")
        except:
            github_image = ""
            print(f"[{idx}/{len(lines)}] ❌ خطأ: {search_name}")
    elif os.path.exists(filename):
        print(f"[{idx}/{len(lines)}] ✅ جاهزة مسبقاً: {search_name}")
    else:
        github_image = ""
        print(f"[{idx}/{len(lines)}] ⚠️ لا مصدر: {search_name}")

    prices = {"extra": 25.0, "edp": 18.0, "edt": 12.0, "commercial": 6.0}

    catalog.append({
        "name": clean_name.upper(),
        "brand": "THE MASK",
        "prices": prices,
        "image": github_image,
        "top_notes": [],
        "heart_notes": [],
        "base_notes": []
    })
    time.sleep(0.1)

with open('perfume_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)

print(f"\n🎉 انتهى! تم بناء الكتالوج وتحميل الصور المتاحة.")
