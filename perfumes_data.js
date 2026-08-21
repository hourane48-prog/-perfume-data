// perfumes_data.js
async function loadPerfumesData() {
    try {
        const response = await fetch('https://hourane48-prog.github.io/-perfume-data/Perfumes_list.txt');
        const text = await response.text();
        const lines = text.split('\n');
        let added = 0;
        
        if (!window.perfumeDB) window.perfumeDB = {};

        lines.forEach(line => {
            const match = line.match(/(.+?)[\s\-:]+(\d+\.?\d*)/);
            if (match && match[1] && match[2]) {
                const name = match[1].trim();
                const priceUSD = parseFloat(match[2]);
                if (!window.perfumeDB[name] && priceUSD > 0) {
                    window.perfumeDB[name] = {
                        priceUSD: priceUSD,
                        priceJOD: +(priceUSD * 0.71).toFixed(2),
                        family: "luxury",
                        color: "gold"
                    };
                    added++;
                }
            }
        });
        
        if (typeof populateDatalist === 'function') populateDatalist();
        alert(`✅ تم تحميل ${added} عطر بنجاح وتحديث الأسعار بالدينار الأردني!`);
    } catch (err) {
        alert("فشل التحميل: " + err.message);
    }
}
