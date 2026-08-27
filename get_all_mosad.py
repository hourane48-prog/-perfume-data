import requests
import json
from bs4 import BeautifulSoup
import time

def fetch_entire_site():
    base_url = "https://www.al-mosad.com"
    all_articles = []
    start_index = 1
    max_results = 150
    headers = {"User-Agent": "Mozilla/5.0 (Linux; Android 10)"}

    print("🚀 بدء سحب مقالات وأرشيف الموقع بالكامل...")

    while True:
        feed_url = f"{base_url}/feeds/posts/default?alt=json&start-index={start_index}&max-results={max_results}"
        try:
            res = requests.get(feed_url, headers=headers, timeout=15)
            if res.status_code != 200:
                break
            
            data = res.json()
            entries = data.get("feed", {}).get("entry", [])
            if not entries:
                break

            for entry in entries:
                title = entry.get("title", {}).get("$t", "بدون عنوان")
                content_html = entry.get("content", {}).get("$t", "") or entry.get("summary", {}).get("$t", "")
                
                soup = BeautifulSoup(content_html, "html.parser")
                clean_text = soup.get_text(separator="\n", strip=True)
                
                link = ""
                for l in entry.get("link", []):
                    if l.get("rel") == "alternate":
                        link = l.get("href")
                        break

                all_articles.append({
                    "id": len(all_articles) + 1,
                    "title": title,
                    "url": link,
                    "content": clean_text
                })

            print(f"📦 تم جلب {len(all_articles)} مقال...")
            start_index += max_results
            time.sleep(1)

        except Exception as e:
            print(f"⚠️ خطأ أثناء المعالجة: {e}")
            break

    with open("al_mosad_full_archive.json", "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)

    print(f"\n✅ اكتمل السحب بنجاح! تم حفظ إجمالي {len(all_articles)} مقال في: al_mosad_full_archive.json")

if __name__ == "__main__":
    fetch_entire_site()
