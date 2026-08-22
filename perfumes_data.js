// perfumes_data.js المحدث للحقن المباشر داخل مركز التحديث
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

        // 3. دالة فحص طريقة التحضير
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

        // 4. حقن لوحة التحكم مباشرة داخل صندوق "مركز التحديث" الظاهر على شاشتك
        let targetContainer = null;
        const allDivs = document.querySelectorAll('div, section, form');
        for (let div of allDivs) {
            if (div.innerText && div.innerText.includes('مركز التحديث')) {
                targetContainer = div;
                break;
            }
        }

        // إذا لم يتم العثور على القسم، سنبحث عن زر جلب التحديث ونحقن اللوحة تحته
        if (!targetContainer) {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.innerText && btn.innerText.includes('جلب التحديث')) {
                    targetContainer = btn.parentElement;
                    break;
                }
            }
        }

        let existingDashboard = document.getElementById('injectedDashboard');
        if (!existingDashboard && targetContainer) {
            const dashboardDiv = document.createElement('div');
            dashboardDiv.id = 'injectedDashboard';
            dashboardDiv.style.cssText = "background: #1a1a1a; color: #fff; padding: 12px; border-radius: 8px; margin: 10px 0; border: 2px solid #d4af37; font-family: Tahoma, sans-serif;";
            
            dashboardDiv.innerHTML = `
                <h3 style="margin: 0 0 8px 0; color: #d4af37; font-size: 14px; text-align: center;">📊 لوحة المبيعات (أطياب)</h3>
                <div style="display: flex; justify-content: space-between; gap: 6px; margin-bottom: 8px;">
                    <div style="background: #2a2a2a; padding: 8px; border-radius: 6px; width: 48%; text-align: center;">
                        <span style="font-size: 10px; color: #aaa;">إجمالي المبيعات</span>
                        <div id="totalSales" style="font-size: 13px; font-weight: bold; color: #d4af37;">0.00 د.أ</div>
                    </div>
                    <div style="background: #2a2a2a; padding: 8px; border-radius: 6px; width: 48%; text-align: center;">
                        <span style="font-size: 10px; color: #aaa;">عدد الطلبات</span>
                        <div id="totalOrders" style="font-size: 13px; font-weight: bold; color: #4CAF50;">0</div>
                    </div>
                </div>
                <button onclick="resetDashboard()" style="background: #d9534f; color: white; border: none; padding: 5px; border-radius: 4px; font-size: 10px; cursor: pointer; width: 100%;">تصفير الإحصائيات</button>
            `;
            targetContainer.appendChild(dashboardDiv);
        }

        // دوال الحسابات
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

        updateDashboardUI();

        if (typeof populateDatalist === 'function') populateDatalist();
        alert(`✅ تم التحديث بنجاح، وظهرت لوحة التحكم في مركز التحديث!`);
    } catch (err) {
        alert("فشل التحميل: " + err.message);
    }
}
