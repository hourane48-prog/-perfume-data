import requests
from bs4 import BeautifulSoup
import json
import re
import time

headers = {"User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile; rv:109.0) Gecko/109.0 Firefox/119.0"}

print("================================================================")
print("🚀 بدء تشغيل منظومة السحب الشامل لبنك معلومات THE MASK AI")
print("================================================================")

# 1. سحب البيانات والوصفات من قنوات تيليجرام العامة (Telegram Web Scraper)
telegram_channels = ["reemaalwadani", "anoodr", "linkkawii"]
telegram_recipes = []

for ch in telegram_channels:
    print(f"\n📡 جاري سحب الوصفات الميدانية من قناة تيليجرام: @{ch}...")
    url = f"https://t.me/s/{ch}"
    try:
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            messages = soup.find_all("div", class_="tgme_widget_message_text")
            print(f"✔️ تم العثور على {len(messages)} منشور في @{ch}")
            
            for msg in messages:
                text = msg.get_text(separator="\n", strip=True)
                # فلترة المنشورات التي تحتوي على كلمات عطرية أو تجارية
                if any(k in text for k in ["عطر", "مسك", "بخور", "مرش", "خلطة", "زيت", "تعتيق", "كحول", "نسبة", "تولة", "دخون", "معمول"]):
                    telegram_recipes.append({
                        "source_channel": f"@{ch}",
                        "content": text
                    })
        else:
            print(f"⚠️ تعذر الوصول للقناة @{ch} (رمز الحالة: {r.status_code})")
    except Exception as e:
        print(f"❌ خطأ أثناء سحب @{ch}: {e}")

print(f"\n✅ إجمالي الوصفات التجارية المستخلصة من تيليجرام: {len(telegram_recipes)} خلطة وقاعدة.")

# 2. تجميع وتصنيف الوصفات والخلطات
market_formulas = {
    "commercial_musk": [
        {
            "name": "مسك الرمان التجاري الفاخر",
            "type": "Musk Oil",
            "base": "Galaxolide 20% + Habanolide 10% + Cashmeran 5% + Iso E Super 5% + Ambrettolide 5%",
            "accord": "Pomegranate Oil 20% + Ethyl Maltol (10% DPG) 5% + Raspberry Ketone 4% + Blackcurrant 3% + Citronellol 3%",
            "modifiers": "Hedione 7% + Benzyl Salicylate 3%",
            "carrier": "DPG 10%",
            "cure_days": "3 to 7 Days"
        },
        {
            "name": "مسك الباودر والأطفال الملكي",
            "type": "Powder Musk",
            "base": "Galaxolide 30% + Habanolide 10% + Ambrettolide 5% + Helvetolide 5%",
            "accord": "Alpha-Isomethyl Ionone 10% + Beta Ionone 5% + Lily Aldehyde 5% + Muguet 5% + Violet 5%",
            "modifiers": "Hedione 7% + Benzyl Salicylate 3%",
            "carrier": "DPG 10%",
            "cure_days": "14 Days in dark cold area"
        }
    ],
    "incense_and_bakhoor": [
        {
            "name": "مبثوث العود الملكي المعتّق",
            "wood_base": "دقة خشب عود طبيعي 100 جم",
            "oil_load": "35 جم خلطة زيوت شرقية (دهن عود، عنبر، صندلية)",
            "powder_fixative": "5 جم بودرة مسك أبيض وعنبر خام",
            "method": "تشريب مباشر بالفرك اليدوي والتعتيق اللاهوائي 21 يوماً"
        },
        {
            "name": "المعمول الدوسري والظفاري الفاخر",
            "wood_base": "بودرة خشب صندل وعود 100 جم",
            "binder": "صمغ عربي نقي 7 جم",
            "liquid": "ماء ورد وقطر سكري 18 جم",
            "oil_load": "25 جم خلطة دهن العود والزعفران",
            "method": "عجن وتكوير ثم تجفيف هوائي مظلم 10 أيام"
        },
        {
            "name": "البخور السوداني التراثي المكرمل",
            "wood_base": "خشب الصندل، المحلب، والطلح 100 جم",
            "sugar_matrix": "قطر سكر مكرمل بماء الورد 25 جم",
            "resins": "لبان ذكر مسحوق 5 جم + مستكة حرة 5 جم",
            "spices": "قرنفل وهيل وقرفة 5 جم",
            "oil_load": "زيت صندلية، مسك، ودهن عود 20 جم"
        }
    ],
    "sprays_and_linen": [
        {
            "name": "معطر سجاد الحرم والمفارش الفاخر",
            "water": "ماء مقطر 60%",
            "ethanol": "إيثانول 96% نقي 15%",
            "carrier": "DPG 5%",
            "oil": "زيت عطري توليفة الحرم (ورد طائفي، عنبر، مسك، بخور) 12%",
            "emulsifier": "Polysorbate-20 3%",
            "fixative": "Triethyl Citrate 3%",
            "preservative": "Phenoxyethanol 0.5%"
        },
        {
            "name": "معطر الملابس والأقمشة المائي (Zero Stain)",
            "water": "ماء منزوع الأيونات 92%",
            "oil": "زيت عطري للأقمشة 3%",
            "emulsifier": "Polysorbate 80 / PEG-40 HCO 4.5%",
            "preservative": "Cosgard / Phenoxyethanol 0.5%"
        }
    ],
    "hair_and_body_mists": [
        {
            "name": "معطر الشعر الحريري (Hair Mist pH 5.0)",
            "water": "ماء مقطر 90%",
            "oil": "زيت عطري تجميلي 1.5%",
            "emulsifier": "Polysorbate 20 4.5%",
            "nutrients": "D-Panthenol 0.5%",
            "preservative": "0.5%",
            "ph_range": "4.5 - 5.5"
        },
        {
            "name": "البدي سبلاش المرطب (Body Splash & Mist)",
            "water": "ماء مقطر 82%",
            "oil": "زيت عطري 2.5%",
            "emulsifier": "Polysorbate 20 6%",
            "moisturizer": "Glycerin / Aloe Vera 2%",
            "ethanol": "إيثانول تجميلي 7%",
            "preservative": "0.5%",
            "ph_range": "5.0 - 6.0"
        }
    ],
    "tola_mukhallat": [
        {
            "name": "مخلط العود والعنبر الأزرق (Oud & Blue Amber)",
            "oud_base": "دهن عود تراد / كمبودي 40%",
            "amber_heart": "لابدانوم + بنزوين + فانيليا وباتشولي 25%",
            "blue_matrix": "أمبروكسان 10% + مسك بلوري + ألدهيدات C10-C12 + لمحة أوزونية وإليمي 20%",
            "sandal_bridge": "صندل ميسور موازن 15%",
            "method": "حمام مائي 40°C لمدة 30 دقيقة ثم تعتيق 40 يوماً"
        }
    ]
}

# 3. حفظ قاعدة البيانات الموحدة الكاملة
master_database = {
    "app": "THE MASK - Pro Lab AI",
    "version": "3.0.0 (Master Unified Knowledge Base)",
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "telegram_harvested_entries": telegram_recipes,
    "structured_market_formulas": market_formulas
}

with open("master_perfume_database.json", "w", encoding="utf-8") as f:
    json.dump(master_database, f, ensure_ascii=False, indent=2)

print("\n================================================================")
print("✅ اكتمل السحب والتجميع بنجاح!")
print("📁 تم إنشاء وحفظ الملف الرئيسي الشامل: master_perfume_database.json")
print("================================================================")
