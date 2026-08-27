import json

def refine():
    with open("perfume_extracted_rules.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    categorized = {
        "maturation_and_aging": [],
        "alcohol_and_solvents": [],
        "pyramid_and_notes": [],
        "safety_and_ifra": []
    }

    aging_kw = ["تعتيق", "تخزين", "بارد", "حرارة", "نضج", "استقرار", "أسبوع", "أشهر", "تفاعل", "راحة"]
    alcohol_kw = ["كحول", "إيثانول", "مذيب", "dpg", "ماء مقطر", "تخفيف", "تركيز"]
    safety_kw = ["ايفرا", "ifra", "تحسس", "مخاطر", "ضرر", "سلامة", "حظر", "سام"]
    pyramid_kw = ["قاعدة", "قمة", "قلب", "هرم", "فوحان", "ثبات", "نسبة", "نوتة", "افتتاحية"]

    for item in data:
        title = item["title"]
        for p in item["key_points"]:
            p_clean = p.strip()
            entry = {"source": title, "rule": p_clean}
            
            # فحص مستقل لكل تصنيف
            if any(k in p_clean.lower() for k in aging_kw):
                categorized["maturation_and_aging"].append(entry)
            if any(k in p_clean.lower() for k in alcohol_kw):
                categorized["alcohol_and_solvents"].append(entry)
            if any(k in p_clean.lower() for k in safety_kw):
                categorized["safety_and_ifra"].append(entry)
            if any(k in p_clean.lower() for k in pyramid_kw):
                categorized["pyramid_and_notes"].append(entry)

    with open("structured_perfume_rules.json", "w", encoding="utf-8") as f:
        json.dump(categorized, f, ensure_ascii=False, indent=2)

    print("📊 التبويب المحدث بعد التحسين:")
    for k, v in categorized.items():
        print(f"  - {k}: {len(v)} قاعدة")

if __name__ == "__main__":
    refine()
