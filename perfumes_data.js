// perfumes_data.js المحدث لجلب العطور وطرق التصنيع الخاصة معا
async function loadPerfumesData() {
    try {
        // 1. جلب قائمة العطور والأسعار من ملف النصوص
        const responseList = await fetch('https://hourane48-prog.github.io/-perfume-data/Perfumes_list.txt');
        const text = await responseList.text();
        const lines = text.split('\n');
        let added = 0;
        
        if (!window.perfumeDB) window.perfumeDB = {};

        for (let i = 0; i < lines.length - 1; i += 2) {
            let nameLine = lines[i].trim();
            let priceLine = lines[i+1] ? lines[i+1].trim() : "";

            if (nameLine && priceLine.includes("سعر:")) {
                const priceMatch = priceLine.match(/سعر:\s*(\d+\.?\d*)/);
                
                if (priceMatch) {
                    const priceAED = parseFloat(priceMatch[1]);
                    const name = "Luzi - " + nameLine;

                    if (!window.perfumeDB[name] && priceAED > 0) {
                        window.perfumeDB[name] = {
                            pricePerKgAED: priceAED,
                            priceJOD: +(priceAED * 0.71).toFixed(2), // الصرف بالدينار الأردني
                            family: "luxury",
                            color: "gold"
                        };
                        added++;
                    }
                }
            }
        }

        // 2. جلب طرق التصنيع الخاصة ودمجها مع التطبيق
        try {
            const responseProfiles = await fetch('https://hourane48-prog.github.io/-perfume-data/perfume_profiles.json');
            const profiles = await responseProfiles.json();
            
            if (typeof window.perfumeProfiles !== 'undefined') {
                window.perfumeProfiles = { ...window.perfumeProfiles, ...profiles };
            } else {
                window.perfumeProfiles = profiles;
            }
            console.log("✅ تم دمج طرق التصنيع الخاصة بنجاح.");
        } catch (profileErr) {
            console.log("ملاحظة: لم يتم العثور على ملف وصفات خاص إضافي.");
        }
        
        if (typeof populateDatalist === 'function') populateDatalist();
        alert(`✅ تم تحميل ${added} عطر وتحديث البيانات وطرق التصنيع بنجاح!`);
    } catch (err) {
        alert("فشل التحميل: " + err.message);
    }
}
