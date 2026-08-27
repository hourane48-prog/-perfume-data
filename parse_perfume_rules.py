import json
import re

def extract_rules():
    with open("al_mosad_full_archive.json", "r", encoding="utf-8") as f:
        articles = json.load(f)

    keywords = ["تعتيق", "كحول", "مثبت", "ايفرا", "ifra", "نسبة", "قاعدة", "قمة", "قلب", "هرم", "زيت"]
    extracted_knowledge = []

    for item in articles:
        text = item["content"]
        title = item["title"]
        
        # البحث عن الفقرات التي تحتوي على نسب أو توجيهات فنية
        relevant_paragraphs = []
        for p in text.split("\n"):
            p_clean = p.strip()
            if any(k in p_clean.lower() for k in keywords) and len(p_clean) > 20:
                relevant_paragraphs.append(p_clean)

        if relevant_paragraphs:
            extracted_knowledge.append({
                "title": title,
                "url": item["url"],
                "key_points": relevant_paragraphs
            })

    with open("perfume_extracted_rules.json", "w", encoding="utf-8") as f:
        json.dump(extracted_knowledge, f, ensure_ascii=False, indent=2)

    print(f"✅ تم استخراج القواعد التقنية من {len(extracted_knowledge)} مقال متخصص.")

if __name__ == "__main__":
    extract_rules()
