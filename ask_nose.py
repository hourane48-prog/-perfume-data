import json
import sys

def search_rules(query):
    try:
        with open("structured_perfume_rules.json", "r", encoding="utf-8") as f:
            rules = json.load(f)
    except FileNotFoundError:
        print("❌ لم يتم العثور على ملف structured_perfume_rules.json. تأكد من تشغيل integrate_knowledge.py أولاً.")
        return
    except Exception as e:
        print(f"❌ خطأ أثناء قراءة البيانات: {e}")
        return

    results = []
    for category, entries in rules.items():
        for item in entries:
            rule_text = item.get("rule", "")
            if query.lower() in rule_text.lower():
                results.append((category, item.get("source", "مقال متخصص"), rule_text))

    if not results:
        print(f"🔍 لم يتم العثور على نتائج للبحث عن: '{query}'")
        return

    print(f"\n💡 نتائج البحث عن '{query}' ({len(results)} تطابق):")
    print("=" * 55)
    for cat, src, rule in results[:8]:
        print(f"📌 [القسم: {cat}] | المصدر: {src}")
        print(f"   💬 {rule}\n")

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) > 1 else "كحول"
    search_rules(q)
