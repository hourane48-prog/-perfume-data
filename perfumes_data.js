// perfumes_data.js الشامل (عطور + وصفات + لوحة التحكم)
async function loadPerfumesData() {
    try {
        // 1. جلب قائمة العطور والأسعار
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
                            priceJOD: +(priceAED * 0.71).toFixed(2),
                            family: "luxury",
                            color: "gold"
                        };
                        added++;
                    }
                }
            }
        }

        // 2. جلب طرق التصنيع الخاصة
        try {
            const responseProfiles = await fetch('https://hourane48-prog.github.io/-perfume-data/perfume_profiles.json');
            const profiles = await responseProfiles.json();
            window.perfumeProfiles = profiles;
        } catch (e) {
            console.log("لا توجد وصفات خاصة إضافية.");
        }

        // 3. دالة فحص طريقة التحضير (لكل عطر)
        window.getPreparationMethod = function(perfumeName) {
            if (window.perfumeProfiles && window.perfumeProfiles[perfumeName]) {
                return window.perfumeProfiles[perfumeName];
            }
            return {
                maturation: 15,
                heat: "عادي",
                special: "طريقة التصنيع القياسية حسب العائلة."
            };
        };

        // 4. حقن لوحة التحكم (Dashboard) تلقائياً داخل التطبيق إذا لم تكن موجودة
        if (!document.getElementById('myDashboard')) {
            const dashboardHTML = `
            <div id="myDashboard" style="background: #1a1a1a; color: #fff; padding: 15px; border-radius: 10px; margin: 15px 0; border: 1px solid #d4af37; font-family: Tahoma, sans-serif;">
                <h3 style="margin-top: 0; color: #d4af37; font-size: 16px; text-align: center;">📊 لوحة التحكم والمبيعات</h3>
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                    <div style="background: #2a2a2a; padding: 10px; border-radius: 5px; width: 48%; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #aaa;">إجمالي المبيعات</p>
                        <h4 id="totalSales" style="margin: 5px 0; color: #d4af37;">0.00 د.أ</h4>
                    </div>
                    <div style="background: #2a2a2a; padding: 10px; border-radius: 5px; width: 48%; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #aaa;">عدد الطلبات</p>
                        <h4 id="totalOrders" style="margin: 5px 0; color: #4CAF50;">0</h4>
                    </div>
                </div>
                <button onclick="resetDashboard()" style="background: #d9534f; color: white; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; width: 100%;">إعادة ضبط الإحصائيات</button>
            </div>`;
            
            // وضع لوحة التحكم في بداية الشاشة أو في مكان مناسب
            const container = document.body || document.firstElementChild;
            if (container) {
                const div = document.createElement('div');
                div.innerHTML = dashboardHTML;
                container.insertBefore(div, container.firstChild);
            }
        }

        // دوال إدارة لوحة التحكم
        window.recordSale = function(perfumeName, priceJOD, quantity) {
            let salesData = JSON.parse(localStorage.getItem('perfumeSales')) || [];
            salesData.push({ name: perfumeName, price: priceJOD, qty: quantity, total: (priceJOD * quantity).toFixed(2) });
            localStorage.setItem('perfumeSales', JSON.stringify(salesData));
            updateDashboardUI();
        };

        window.updateDashboardUI = function() {
            let salesData = JSON.parse(localStorage.getItem('perfumeSales')) || [];
            let totalRevenue = salesData.reduce((sum, item) => sum + parseFloat(item.total), 0);
            
            const salesEl = document.getElementById('totalSales');
            const ordersEl = document.getElementById('totalOrders');
            if (salesEl) salesEl.innerText = totalRevenue.toFixed(2) + " د.أ";
            if (ordersEl) ordersEl.innerText = salesData.length;
        };

        window.resetDashboard = function() {
            if (confirm("هل تريد تصفير سجل المبيعات؟")) {
                localStorage.removeItem('perfumeSales');
                updateDashboardUI();
                alert("✅ تم التصفير بنجاح.");
            }
        };

        // تحديث واجهة اللوحة فورياً
        updateDashboardUI();

        if (typeof populateDatalist === 'function') populateDatalist();
        alert(`✅ تم تحميل ${added} عطر، تفعيل الوصفات، وظهور لوحة التحكم بنجاح!`);
    } catch (err) {
        alert("فشل التحميل: " + err.message);
    }
}
