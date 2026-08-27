import requests
import json
from bs4 import BeautifulSoup
import time

headers = {"User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile)"}
base_url = "https://www.al-mosad.com"

def fetch_feed(feed_type="posts"):
    items = []
    start_index = 1
    max_results = 150
    print(f"📡 جاري سحب {feed_type}...")
    
    while True:
        url = f"{base_url}/feeds/{feed_type}/default?alt=json&start-index={start_index}&max-results={max_results}"
        try:
            r = requests.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                break
            data = r.json()
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                break
                
            for entry in entries:
                title = entry.get("title", {}).get("$t", "بدون عنوان")
                content_html = entry.get("content", {}).get("$t", "") or entry.get("summary", {}).get("$t", "")
                soup = BeautifulSoup(content_html, "html.parser")
                text = soup.get_text(separator="\n", strip=True)
                
                link = ""
                for l in entry.get("link", []):
                    if l.get("rel") == "alternate":
                        link = l.get("href")
                        break
                        
                items.append({
                    "type": feed_type,
                    "title": title,
                    "url": link,
                    "content": text
                })
                
            start_index += max_results
            time.sleep(0.5)
        except Exception as e:
            print(f"⚠️ خطأ أثناء جلب {feed_type}: {e}")
            break
            
    print(f"✔️ تم جلب {len(items)} عنصر من {feed_type}.")
    return items

# 1. سحب المقالات والصفحات الثابتة معاً
all_data = fetch_feed("posts") + fetch_feed("pages")

with open("al_mosad_full_archive.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

# 2. استخراج القواعد والنسب التقنية
keywords = ["تعتيق", "كحول", "مثبت", "ايفرا", "ifra", "نسبة", "قاعدة", "قمة", "قلب", "هرم", "زيت", "عطر", "نوتة", "فوحان", "ثبات"]
extracted = []

for item in all_data:
    paragraphs = [p.strip() for p in item["content"].split("\n") if len(p.strip()) > 15]
    matched = [p for p in paragraphs if any(k in p.lower() for k in keywords)]
    if matched:
        extracted.append({
            "title": item["title"],
            "url": item["url"],
            "key_points": matched
        })

with open("perfume_extracted_rules.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)

print(f"\n✅ اكتملت العملية! تم استخراج القواعد من {len(extracted)} مقال/صفحة داخل: perfume_extracted_rules.json")
