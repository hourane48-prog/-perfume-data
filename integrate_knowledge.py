import json

def categorize_knowledge():
    with open("perfume_extracted_rules.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    categorized = {
        "maturation_and_aging": [],  # التعتيق والتخزين
        "alcohol_and_solvents": [],  # الكحول والمذيبات
        "pyramid_and_notes": [],     # الهرم العطري والخلط
        "safety_and_ifra": []        # معايير السلامة
    }

    for item in data:
        title = item["title"]
        points = item["key_points"]
        
        for p in points:
            p_lower = p.lower()
            entry = {"source": title, "rule": p}
            
            if any(k in p_lower for k in ["تعتيق", "تخزين", "بارد", "حرارة", "نضج"]):
                categorized["maturation_and_aging"].append(entry)
            elif any(k in p_lower for k in ["كحول", "إيثانول", "مذيب", "dpg", "ماء مقطر"]):
                categorized["alcohol_and_solvents"].append(entry)
            elif any(k in p_lower for k in ["ايفرا", "ifra", "تحسس", "مخاطر", "ضرر"]):
                categorized["safety_and_ifra"].append(entry)
            elif any(k in p_lower for k in ["قاعدة", "قمة", "قلب", "هرم", "فوحان", "ثبات", "نسبة"]):
                categorized["pyramid_and_notes"].append(entry)

    with open("structured_perfume_rules.json", "w", encoding="utf-8") as f:
        json.dump(categorized, f, ensure_ascii=False, indent=2)

    print("📊 ملخص تبويب القواعد:")
    print(f"  - قواعد التعتيق والتخزين: {len(categorized['maturation_and_aging'])}")
    print(f"  - قواعد الكحول والمذيبات: {len(categorized['alcohol_and_solvents'])}")
    print(f"  - قواعد الهرم العطري والتوليف: {len(categorized['pyramid_and_notes'])}")
    print(f"  - معايير السلامة والتنظيم: {len(categorized['safety_and_ifra'])}")
    print("\n✅ تم حفظ القواعد المصنفة داخل: structured_perfume_rules.json")

if __name__ == "__main__":
    categorize_knowledge()
