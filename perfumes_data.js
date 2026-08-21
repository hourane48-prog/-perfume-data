// perfumes_data.js الجديد والمعدل
async function loadPerfumesData() {
    try {
        const response = await fetch('https://hourane48-prog.github.io/-perfume-data/Perfumes_list.txt');
        const text = await response.text();
        const lines = text.split('\n');
        let added = 0;
        
        if (!window.perfumeDB) window.perfumeDB = {};

        // هذه الحلقة تقرأ سطرين سطرين (سطر للاسم، وسطر للسعر)
        for (let i = 0; i < lines.length - 1; i += 2) {
            let nameLine = lines[i].trim();
            let priceLine = lines[i+1] ? lines[i+1].trim() : "";

            // التحقق إذا كان هناك اسم وسعر
            if (nameLine && priceLine.includes("سعر:")) {
                // استخراج الرقم من جملة "سعر: 297.81"
                const priceMatch = priceLine.match(/سعر:\s*(\d+\.?\d*)/);
                
                if (priceMatch) {
                    const priceAED = parseFloat(priceMatch[1]);
                    const name = "Luzi - " + nameLine;

                    if (!window.perfumeDB[name] && priceAED > 0) {
                        window.perfumeDB[name] = {
                            pricePerKgAED: priceAED,
                            priceJOD: +(priceAED * 0.71).toFixed(2), // التحويل للدينار
                            family: "luxury",
                            color: "gold"
                        };
                        added++;
                    }
                }
            }
        }
        
        if (typeof populateDatalist === 'function') populateDatalist();
        alert(`✅ تم تحميل ${added} عطر بنجاح!`);
    } catch (err) {
        alert("فشل تحميل البيانات: " + err.message);
    }
}
