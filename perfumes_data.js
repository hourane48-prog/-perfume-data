// perfumes_data.js - الإصدار المتوافق مع تنسيق سطر اسم ثم سطر سعر
async function loadPerfumesData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/hourane48-prog/-perfume-data/main/Perfumes_list.txt');
        const text = await response.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);

        if (!window.perfumeDB) window.perfumeDB = {};
        let added = 0;
        let skipped = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('السعر:')) {
                const priceMatch = line.match(/السعر:\s*(\d+\.?\d*)/);
                if (priceMatch && i > 0) {
                    const priceAED = parseFloat(priceMatch[1]);
                    let nameLine = lines[i - 1].trim();
                    if (!nameLine) continue;

                    let name = nameLine
                        .replace(/^عطر\s+/, '')
                        .replace(/\s*\(الكود:.*?\)\s*/g, '')
                        .replace(/\s*\([^)]*\)\s*$/g, '')
                        .replace(/\s*-\s*/g, ' - ')
                        .trim();

                    if (!name) name = nameLine;

                    const key = "Luzi - " + name;
                    if (priceAED > 0 && !window.perfumeDB[key]) {
                        window.perfumeDB[key] = {
                            pricePerKgAED: priceAED,
                            priceJOD: +(priceAED * 0.71).toFixed(2),
                            family: "luxury",
                            color: "gold"
                        };
                        added++;
                    } else {
                        skipped++;
                    }
                }
            }
        }

        // حقن لوحة المبيعات
        injectDashboard();

        // تحديث قائمة الاقتراحات
        if (typeof populateDatalist === 'function') populateDatalist();

        alert(`✅ تم تحميل ${added} عطر جديد بنجاح! (تم تخطي ${skipped} مكرر/غير صالح)`);
    } catch (err) {
        alert("فشل التحميل: " + err.message);
    }
}

function injectDashboard() {
    let target = document.querySelector('.ota-box') || document.querySelector('#updateUrlInput')?.parentElement;
    if (!target) return;
    if (!document.getElementById('injectedDashboard')) {
        const div = document.createElement('div');
        div.id = 'injectedDashboard';
        div.style.cssText = "background:#1a1a1a;color:#fff;padding:12px;border-radius:8px;margin:10px 0;border:2px solid #d4af37;";
        div.innerHTML = `
            <h3 style="margin:0 0 8px;color:#d4af37;text-align:center;">📊 لوحة المبيعات</h3>
            <div style="display:flex;gap:10px;justify-content:space-between;">
                <div style="background:#2a2a2a;padding:10px;border-radius:6px;flex:1;text-align:center;">
                    <span style="font-size:11px;color:#aaa;">إجمالي المبيعات</span>
                    <div id="totalSales" style="font-size:16px;font-weight:bold;color:#d4af37;">0.00 د.أ</div>
                </div>
                <div style="background:#2a2a2a;padding:10px;border-radius:6px;flex:1;text-align:center;">
                    <span style="font-size:11px;color:#aaa;">عدد الطلبات</span>
                    <div id="totalOrders" style="font-size:16px;font-weight:bold;color:#4CAF50;">0</div>
                </div>
            </div>
            <button onclick="resetDashboard()" style="background:#d9534f;color:white;border:none;padding:5px;border-radius:4px;font-size:12px;width:100%;margin-top:8px;cursor:pointer;">تصفير الإحصائيات</button>
        `;
        target.appendChild(div);
    }
    window.recordSale = function(name, priceJOD, qty) {
        let sales = JSON.parse(localStorage.getItem('perfumeSales') || '[]');
        sales.push({ name, price: priceJOD, qty, total: (priceJOD * qty).toFixed(2) });
        localStorage.setItem('perfumeSales', JSON.stringify(sales));
        updateDashboardUI();
    };
    window.updateDashboardUI = function() {
        let sales = JSON.parse(localStorage.getItem('perfumeSales') || '[]');
        let total = sales.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const salesEl = document.getElementById('totalSales');
        const ordersEl = document.getElementById('totalOrders');
        if(salesEl) salesEl.innerText = total.toFixed(2) + " د.أ";
        if(ordersEl) ordersEl.innerText = sales.length;
    };
    window.resetDashboard = function() {
        if(confirm("تصفير سجل المبيعات؟")) {
            localStorage.removeItem('perfumeSales');
            updateDashboardUI();
        }
    };
    updateDashboardUI();
}

// استدعاء الدالة فوراً
loadPerfumesData();
