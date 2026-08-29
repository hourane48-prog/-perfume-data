// =========================================================================
// THE MASK - Master Lab AI (Comprehensive Chemical & Olfactory Engine)
// =========================================================================

const translations = {
    ar: {
        brand: "🎭 THE MASK - Pro Lab",
        nav_fine: "🧪 العطور الفاخرة والدمج",
        nav_musk: "🧴 المسكات العطرية الفاخرة",
        nav_splash: "🌸 معطرات الشعر والجسم",
        nav_bakhoor: "🪵 البخور والمعمول والدخون",
        nav_mukhallat: "🏺 المخلطات والأدهان بالتولة",
        nav_spray: "💨 معطرات الجو والمفارش",
        nav_qc_ifra: "🛡️ فحص السلامة IFRA والجودة",
        search_ph: "🔍 بحث فوري عن العطر أو النوتة...",
        single_mode: "عطر منفرد",
        dual_mode: "دمج عطرين هجين",
        suggest_btn: "✨ اقتراح الدمج المثالي",
        btn_calc: "⚖️ تطبيق الحسابات والبروتوكول",
        btn_cost: "💵 حساب التكلفة والربحية",
        btn_passport: "📄 توليد وثيقة العطر (Passport)"
    },
    en: {
        brand: "🎭 THE MASK - Pro Lab",
        nav_fine: "🧪 Fine Fragrance & Layering",
        nav_musk: "🧴 Perfumed Musk Oils Lab",
        nav_splash: "🌸 Hair & Body Mists Lab",
        nav_bakhoor: "🪵 Incense, Bakhoor & Maamoul",
        nav_mukhallat: "🏺 Pure Attar & Tola Lab",
        nav_spray: "💨 Room & Mosque Sprays",
        nav_qc_ifra: "🛡️ IFRA Safety & QC Lab",
        search_ph: "🔍 Search fragrance or note...",
        single_mode: "Single Fragrance",
        dual_mode: "Dual Layering Blend",
        suggest_btn: "✨ Suggest Ideal Match",
        btn_calc: "⚖️ Apply Protocol & Math",
        btn_cost: "💵 Calculate Cost & Margins",
        btn_passport: "📄 Generate Perfume Passport"
    },
    fr: {
        brand: "🎭 THE MASK - Pro Lab",
        nav_fine: "🧪 Parfumerie Fine & Layering",
        nav_musk: "🧴 Huiles de Musc Parfumées",
        nav_splash: "🌸 Brumes Corps & Cheveux",
        nav_bakhoor: "🪵 Encens, Bakhoor & Maamoul",
        nav_mukhallat: "🏺 Attars Purs & Huiles Tola",
        nav_spray: "💨 Sprays d'Ambiance & Linge",
        nav_qc_ifra: "🛡️ Sécurité IFRA & Qualité",
        search_ph: "🔍 Rechercher parfum ou note...",
        single_mode: "Parfum Unique",
        dual_mode: "Mélange Superposé",
        suggest_btn: "✨ Suggérer Accord Parfait",
        btn_calc: "⚖️ Exécuter le Protocole",
        btn_cost: "💵 Calculer Coût & Marges",
        btn_passport: "📄 Générer le Passeport"
    }
};

let currentLang = "ar";
let activeView = "fine";

// قاعدة بيانات العطور المركزية
let perfumesDataset = [
    { id: 1, name: "Aventus (Creed)", brand: "Creed", family: "Chypre Fruity", top: "Bergamot, Pineapple, Apple", heart: "Birch, Patchouli, Jasmine", base: "Oakmoss, Musk, Ambergris, Vanilla", baseRatio: 0.35, longevitySkin: 8, longevityClothes: 24, projectionHrs: 3.5, bestPairs: ["Baccarat Rouge 540", "Tuscan Leather", "Oud Wood"] },
    { id: 2, name: "Baccarat Rouge 540 (MFK)", brand: "MFK", family: "Amber Floral", top: "Saffron, Jasmine", heart: "Amberwood, Ambergris", base: "Fir Resin, Cedar", baseRatio: 0.55, longevitySkin: 12, longevityClothes: 36, projectionHrs: 5.0, bestPairs: ["Aventus", "Lost Cherry", "Grand Soir"] },
    { id: 3, name: "Sauvage (Dior)", brand: "Dior", family: "Aromatic Fougère", top: "Calabrian Bergamot, Pepper", heart: "Lavender, Pink Pepper, Vetiver", base: "Ambroxan, Cedar, Labdanum", baseRatio: 0.45, longevitySkin: 9, longevityClothes: 28, projectionHrs: 4.0, bestPairs: ["Tobacco Vanille", "Bleu de Chanel"] },
    { id: 4, name: "Tobacco Vanille (Tom Ford)", brand: "Tom Ford", family: "Amber Spicy", top: "Tobacco Leaf, Spices", heart: "Tonka, Tobacco Blossom, Vanilla", base: "Dry Fruit, Woody Notes", baseRatio: 0.60, longevitySkin: 14, longevityClothes: 48, projectionHrs: 4.5, bestPairs: ["Sauvage", "Tuscan Leather"] },
    { id: 5, name: "Oud Wood (Tom Ford)", brand: "Tom Ford", family: "Amber Woody", top: "Cardamom, Rosewood", heart: "Oud, Sandalwood, Vetiver", base: "Tonka, Vanilla, Amber", baseRatio: 0.50, longevitySkin: 8, longevityClothes: 20, projectionHrs: 2.5, bestPairs: ["Baccarat Rouge 540", "Aventus"] },
    { id: 6, name: "Tuscan Leather (Tom Ford)", brand: "Tom Ford", family: "Leather", top: "Raspberry, Saffron, Thyme", heart: "Olibanum, Jasmine", base: "Leather, Suede, Amber", baseRatio: 0.55, longevitySkin: 12, longevityClothes: 36, projectionHrs: 4.0, bestPairs: ["Aventus", "Tobacco Vanille"] }
];

// قاعدة بيانات معايير الأمان الدولية IFRA 51st Amendment
const ifraDatabase = [
    { name: "Oakmoss Absolute (أوكموس طبيعي)", maxFinishedPct: 0.10, reason: "تحسس جلدي شديد (Dermal Sensitization)", status: "Restricted" },
    { name: "Bergamot Oil Expressed (برغموت معصور)", maxFinishedPct: 0.40, reason: "سمية ضوئية / بيرغابتين (Phototoxicity)", status: "Restricted" },
    { name: "Cinnamon Bark Oil (زيت قرفة)", maxFinishedPct: 0.05, reason: "تهيج وحروق جلدية (Cinnamaldehyde)", status: "Restricted" },
    { name: "Clove Oil / Eugenol (قرنفل / يوجينول)", maxFinishedPct: 2.50, reason: "تحسس جلدي", status: "Restricted" },
    { name: "Rose Absolute (مطلق الورد)", maxFinishedPct: 0.25, reason: "احتمالية سمية جينية (Methyl Eugenol)", status: "Restricted" },
    { name: "Iso E Super", maxFinishedPct: 21.40, reason: "سقف التشبع الأقصى للبشرة", status: "Restricted" },
    { name: "Cashmeran (كشميران)", maxFinishedPct: 3.80, reason: "تراكم حيوي وسمية بيئية/جلدية", status: "Restricted" },
    { name: "Lilial / Lysmeral (ليليال)", maxFinishedPct: 0.00, reason: "محظور عالمياً (Reprotoxic / مهدد للخصوبة)", status: "Banned" },
    { name: "Lyral / HICC (ليرال)", maxFinishedPct: 0.00, reason: "محظور عالمياً (حساسية مفرطة)", status: "Banned" }
];

let lastCostCalculations = null;
let currentPassportData = null;

document.addEventListener("DOMContentLoaded", () => {
    switchLanguage('ar');
});

function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    // تحديث نصوص القائمة
    document.getElementById('sidebar-brand-txt').innerText = translations[lang].brand;
    document.getElementById('nav-fine-txt').innerText = translations[lang].nav_fine;
    document.getElementById('nav-musk-txt').innerText = translations[lang].nav_musk;
    document.getElementById('nav-splash-txt').innerText = translations[lang].nav_splash;
    document.getElementById('nav-bakhoor-txt').innerText = translations[lang].nav_bakhoor;
    document.getElementById('nav-mukhallat-txt').innerText = translations[lang].nav_mukhallat;
    document.getElementById('nav-spray-txt').innerText = translations[lang].nav_spray;
    document.getElementById('nav-qc-txt').innerText = translations[lang].nav_qc_ifra;

    renderActiveView();
}

function selectSection(viewName) {
    activeView = viewName;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`nav-${viewName}`).classList.add('active');
    renderActiveView();
}

function renderActiveView() {
    const viewport = document.getElementById("main-viewport");

    if (activeView === "fine") {
        viewport.innerHTML = renderFineFragranceView();
        populatePerfumeDropdowns();
        setupSearchFilter();
        calculateFineCompounding();
    } else if (activeView === "musk") {
        viewport.innerHTML = renderMuskLabView();
        calculateMuskFormula();
    } else if (activeView === "splash") {
        viewport.innerHTML = renderSplashView();
        calculateSplashFormula();
    } else if (activeView === "bakhoor") {
        viewport.innerHTML = renderBakhoorView();
        calculateBakhoor();
    } else if (activeView === "mukhallat") {
        viewport.innerHTML = renderMukhallatView();
        calculateMukhallat();
    } else if (activeView === "spray") {
        viewport.innerHTML = renderRoomSprayView();
        calculateRoomSpray();
    } else if (activeView === "qc_ifra") {
        viewport.innerHTML = renderQcIfraView();
        populateIfraDropdown();
        verifyIfraSafety();
    }
}

// -------------------------------------------------------------
// 1. واجهة العطور السائلة الفاخرة والدمج (Fine Fragrance Studio)
// -------------------------------------------------------------
function renderFineFragranceView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">🧪 1. استوديو العطور الفاخرة والدمج الهجين (Fine Fragrance Studio)</h2>
            <label style="cursor:pointer; color:var(--accent-blue); font-size:0.85em;">
                📂 استيراد CSV <input type="file" accept=".csv" onchange="loadCustomCSV(event)" style="display:none;">
            </label>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">
                    <span>صياغة التركيبة والدمج النغمي (Formulation & Layering)</span>
                    <button onclick="suggestBestBlend()" style="width:auto; padding:4px 12px; background:#6366f1; color:#fff; font-size:0.85em;">${translations[currentLang].suggest_btn}</button>
                </div>

                <div class="search-container">
                    <input type="text" id="perfume-search-input" placeholder="${translations[currentLang].search_ph}">
                    <div id="search-results-list"></div>
                </div>

                <div style="display:flex; gap:15px; margin-bottom:12px; background:#060b14; padding:8px; border-radius:5px;">
                    <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                        <input type="radio" name="blend-mode" id="blend-mode-single" value="single" checked onchange="toggleBlendMode()" style="width:auto;"> ${translations[currentLang].single_mode}
                    </label>
                    <label style="display:flex; align-items:center; gap:5px; cursor:pointer; color:var(--accent-blue);">
                        <input type="radio" name="blend-mode" id="blend-mode-dual" value="dual" onchange="toggleBlendMode()" style="width:auto;"> ${translations[currentLang].dual_mode}
                    </label>
                </div>

                <div class="grid-2">
                    <div>
                        <label>العطر الأساسي:</label>
                        <select id="perfume-select-1" onchange="calculateFineCompounding()"></select>
                    </div>
                    <div id="blend-controls" style="display:none; grid-template-columns:2fr 1fr; gap:6px;">
                        <div>
                            <label>العطر المكمل للدمج:</label>
                            <select id="perfume-select-2" onchange="calculateFineCompounding()"></select>
                        </div>
                        <div>
                            <label>نسبة الدمج (%):</label>
                            <input type="number" id="blend-ratio-1" value="60" oninput="calculateFineCompounding()">
                        </div>
                    </div>
                </div>

                <div class="grid-3" style="margin-top:8px;">
                    <div>
                        <label>حجم العبوة (مل):</label>
                        <input type="number" id="fine-vol" value="100" oninput="calculateFineCompounding()">
                    </div>
                    <div>
                        <label>تركيز العطر (%):</label>
                        <select id="fine-conc" onchange="calculateFineCompounding()">
                            <option value="30">Parfum / Extrait (30%)</option>
                            <option value="20" selected>Eau de Parfum - EDP (20%)</option>
                            <option value="15">Eau de Toilette - EDT (15%)</option>
                        </select>
                    </div>
                </div>

                <div id="fine-compounding-result" style="margin-top:12px;"></div>
            </div>

            <div class="card">
                <div class="card-header" style="color:var(--accent-gold);">💰 التحليل المالي وهوامش الربح</div>
                <div class="grid-2">
                    <div><label>العملة:</label><input type="text" id="cost-currency" value="JOD"></div>
                    <div><label>هامش الربح (%):</label><input type="number" id="target-margin" value="60"></div>
                </div>
                <div class="grid-3">
                    <div><label>سعر كغم الزيت:</label><input type="number" id="cost-oil-kg" value="120"></div>
                    <div><label>سعر لتر الكحول:</label><input type="number" id="cost-alc-liter" value="6"></div>
                    <div><label>الزجاج والعلبة:</label><input type="number" id="cost-pack" value="2.75"></div>
                </div>
                <button class="btn-gold" onclick="calculateFinancials()">${translations[currentLang].btn_cost}</button>
                <div id="cost-analysis-result" style="margin-top:10px;"></div>
            </div>

            <div class="card">
                <div class="card-header" style="color:var(--accent-green);">🏷️ وثيقة العطر THE MASK Passport</div>
                <p style="font-size:0.85em; color:var(--text-muted); margin-bottom:10px;">توليد الشهادة الفنية والمطابقة الكيميائية:</p>
                <button class="btn-green" onclick="generatePassport()">${translations[currentLang].btn_passport}</button>
                <div id="passport-view-box" style="display:none; margin-top:10px;"></div>
            </div>
        </div>
    `;
}

function toggleBlendMode() {
    const isDual = document.getElementById("blend-mode-dual").checked;
    document.getElementById("blend-controls").style.display = isDual ? "grid" : "none";
    calculateFineCompounding();
}

function calculateFineCompounding() {
    const isDual = document.getElementById("blend-mode-dual")?.checked || false;
    const p1 = perfumesDataset.find(p => p.id === parseInt(document.getElementById("perfume-select-1").value)) || perfumesDataset[0];
    const p2 = isDual ? (perfumesDataset.find(p => p.id === parseInt(document.getElementById("perfume-select-2").value)) || perfumesDataset[1]) : null;

    let ratio1 = isDual ? parseFloat(document.getElementById("blend-ratio-1").value) || 60 : 100;
    let ratio2 = isDual ? (100 - ratio1) : 0;

    const bottleVol = parseFloat(document.getElementById("fine-vol").value) || 100;
    const concPct = parseFloat(document.getElementById("fine-conc").value) || 20;

    const totalOilGrams = (bottleVol * (concPct / 100)) * 0.95;
    const totalAlcoholMl = bottleVol * (1 - (concPct / 100));

    const oil1G = totalOilGrams * (ratio1 / 100);
    const oil2G = totalOilGrams * (ratio2 / 100);

    // المعززات التخصصية بحسب العائلة (Dynamic Booster Affinity)
    let boosterHtml = "";
    let isoEG = 0, ambroxanG = 0, hedioneG = 0, benzylBenzG = 0;

    if (p1.family.includes("Woody") || p1.family.includes("Leather") || p1.family.includes("Chypre")) {
        isoEG = bottleVol * 0.025; // 2.5%
        ambroxanG = bottleVol * 0.005; // 0.5%
        boosterHtml = `• Iso E Super (هالة مخملية خشبية): <b>${isoEG.toFixed(2)} جم</b><br>• Ambroxan (ثبات عنبري عميق): <b>${ambroxanG.toFixed(2)} جم</b>`;
    } else if (p1.family.includes("Floral") || p1.family.includes("Citrus") || p1.family.includes("Fruity")) {
        hedioneG = bottleVol * 0.020; // 2.0%
        boosterHtml = `• Hedione HC (إشراق زهري وانفتاح نغمي): <b>${hedioneG.toFixed(2)} جم</b>`;
    } else {
        benzylBenzG = bottleVol * 0.015;
        boosterHtml = `• Benzyl Benzoate (تثبيت بلسمي ومذيب): <b>${benzylBenzG.toFixed(2)} جم</b>`;
    }

    // حساب فيزياء التبخر والفوحان على البشرة والملابس
    const weightedBase = isDual ? ((p1.baseRatio * ratio1) + (p2.baseRatio * ratio2)) / 100 : p1.baseRatio;
    const baseLongSkin = isDual ? ((p1.longevitySkin * ratio1) + (p2.longevitySkin * ratio2)) / 100 : p1.longevitySkin;
    const baseLongClothes = isDual ? ((p1.longevityClothes * ratio1) + (p2.longevityClothes * ratio2)) / 100 : p1.longevityClothes;

    const calcSkinLong = Math.round(baseLongSkin * (concPct / 20) * (1 + (weightedBase * 0.15)));
    const calcClothesLong = Math.round(baseLongClothes * (concPct / 20) * (1 + (weightedBase * 0.25)));
    const calcProj = (p1.projectionHrs * Math.sqrt(concPct / 20)).toFixed(1);

    // كاشف كتمان العطر (Scent Choking Detector)
    let chokeWarning = "";
    if (weightedBase > 0.55 && hedioneG === 0) {
        chokeWarning = `<div style="background:#3a1c1c; border-right:3px solid #f43f5e; padding:8px; border-radius:4px; margin-top:8px; color:#fca5a5;">⚠️ <b>تنبيه كتمان العطر:</b> نسبة القاعدة الثقيلة مرتفعة جداً (${(weightedBase*100).toFixed(0)}%)؛ يُنصح بإضافة 1.5% Hedione لفتح المسام النغمية.</div>`;
    }

    document.getElementById("fine-compounding-result").innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-blue);">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:0.9em; margin-bottom:12px;">
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px; border-right:3px solid var(--accent-gold);">
                    <strong style="color:var(--accent-gold);">1. الزيوت العطرية (${totalOilGrams.toFixed(2)} جم):</strong><br>
                    • ${p1.name} (${ratio1}%): <b>${oil1G.toFixed(2)} جم</b> (~${Math.round(oil1G*30)} قطرة)<br>
                    ${isDual ? `• ${p2.name} (${ratio2}%): <b>${oil2G.toFixed(2)} جم</b> (~${Math.round(oil2G*30)} قطرة)<br>` : ''}
                    <small style="color:#94a3b8;">نسبة المطابقة الأصلية: <b>≥93%</b></small>
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px; border-right:3px solid var(--accent-green);">
                    <strong style="color:var(--accent-green);">2. المعززات التخصصية:</strong><br>
                    ${boosterHtml}
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px; border-right:3px solid var(--accent-blue);">
                    <strong style="color:var(--accent-blue);">3. المذيب والأداء الفيزيائي:</strong><br>
                    • كحول 96%: <b>${(totalAlcoholMl * 0.85).toFixed(1)} مل</b> \vert{} ماء مقطر: <b>${(totalAlcoholMl * 0.15).toFixed(1)} مل</b><br>
                    • الثبات على الجلد: <b style="color:#4ade80;">${calcSkinLong} ساعات</b> \vert{} على الملابس: <b style="color:#38bdf8;">${calcClothesLong} ساعة</b><br>
                    • انتشار الهالة (Sillage): <b>~${calcProj} متر</b>
                </div>
            </div>
            ${chokeWarning}

            <div style="background:#091220; padding:12px; border-radius:6px; font-size:0.85em; line-height:1.6; border:1px solid #1e3a5f; margin-top:10px;">
                <strong style="color:var(--accent-gold);">⚗️ بروتوكول التصنيع والتعتيق المخبري (THE MASK SOP):</strong>
                <ol style="margin:6px 0 0 0; padding-right:18px; color:#cbd5e1;">
                    <li><strong>تسلسل الإضافة:</strong> ضع زيوت القاعدة أولاً في بيشر زجاجي، ثم أضف المعززات المتوافقة، ثم زيوت القمة، وحرّك بقضيب زجاجي بهدوء لمدة 3 دقائق دون إحداث دوامات هوائية.</li>
                    <li><strong>المذيب المائي الكحولي:</strong> اخلط الكحول 96% مع 15% ماء مقطر منزوع الأيونات لكسر اللدغة الكحولية ومنح العطر طابع "التغليف المائي النقي"، ثم أضفه تدريجياً للزيت.</li>
                    <li><strong>الصدمة التبريدية (Chilling):</strong> احفظ الخليط في التبريد عند درجة حرارة <strong>(-4°C)</strong> لمدة <strong>48 ساعة</strong> لترسيب الشموع النباتية غير الذائبة.</li>
                    <li><strong>الترشيح الميكروني:</strong> رشّح العطر وهو بارد عبر ورق ترشيح دقيق (0.45 Micron) مع قليل من بودرة التلك التجميلية غير المعطرة لضمان النقاء الكريستالي.</li>
                    <li><strong>التعتيق المظلم (Maturation):</strong> احفظ العبوة في مكان بارد ومظلم (15°C) لمدة <strong>28 يوماً</strong> لاكتمال تفاعل الأسترة.</li>
                </ol>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 2. مختبر المسكات العطرية الفاخرة (Musk Oils Lab)
// -------------------------------------------------------------
function renderMuskLabView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">🧴 2. مختبر المسكات العطرية الفاخرة (Specialty Perfumed Musk Oils)</h2>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">صياغة المسكات الزيتية اللزجة الخالية من الكحول (Attar Grade)</div>
                <div class="grid-2">
                    <div>
                        <label>نوع المسك المستهدف:</label>
                        <select id="musk-preset" onchange="calculateMuskFormula()">
                            <option value="pomegranate" selected>مسك الرمان الفاخر (Pomegranate Musk)</option>
                            <option value="powder">مسك الباودر والأطفال (Baby Powder Musk)</option>
                            <option value="custom">مسك مخصص (Custom Blend)</option>
                        </select>
                    </div>
                    <div>
                        <label>الوزن الكلي المطلوب (جرام):</label>
                        <input type="number" id="musk-total-weight" value="100" oninput="calculateMuskFormula()">
                    </div>
                </div>
                <div id="musk-result-box" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function calculateMuskFormula() {
    const type = document.getElementById("musk-preset").value;
    const totalWeight = parseFloat(document.getElementById("musk-total-weight").value) || 100;
    const resBox = document.getElementById("musk-result-box");

    let details = "";
    if (type === "pomegranate") {
        details = `
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:10px;">
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-rose);">1. القاعدة المسكية (45%): ${(totalWeight * 0.45).toFixed(1)} جم</strong><br>
                    • Galaxolide: ${(totalWeight * 0.20).toFixed(1)} جم | Habanolide:${(totalWeight * 0.10).toFixed(1)} جم<br>
                    • Cashmeran: ${(totalWeight * 0.05).toFixed(1)} جم | Iso E Super:${(totalWeight * 0.05).toFixed(1)} جم<br>
                    • Ambrettolide: ${(totalWeight * 0.05).toFixed(1)} جم
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-gold);">2. أكورد الرمان الفاكهي (35%): ${(totalWeight * 0.35).toFixed(1)} جم</strong><br>
                    • مركب الرمان: ${(totalWeight * 0.20).toFixed(1)} جم | Ethyl Maltol (10% DPG):${(totalWeight * 0.05).toFixed(1)} جم<br>
                    • Raspberry Ketone: ${(totalWeight * 0.04).toFixed(1)} جم | Blackcurrant + Citronellol:${(totalWeight * 0.06).toFixed(1)} جم
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-blue);">3. التنعيم والمذيب (20%): ${(totalWeight * 0.20).toFixed(1)} جم</strong><br>
                    • Hedione: ${(totalWeight * 0.07).toFixed(1)} جم | Benzyl Salicylate:${(totalWeight * 0.03).toFixed(1)} جم<br>
                    • مذيب DPG أو IPM اللزج: ${(totalWeight * 0.10).toFixed(1)} جم
                </div>
            </div>
            <div style="padding:8px; background:#060b14; border-radius:4px; color:#cbd5e1;">⏳ <b>بروتوكول الاستقرار:</b> يُمزج المزيج ويُترك في وعاء زجاجي محكم لمدة <b>3 إلى 7 أيام</b> حتى تندمج الجزيئات السكرية مع المسك.</div>
        `;
    } else if (type === "powder") {
        details = `
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:10px;">
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-blue);">1. قلب المسك الأبيض (50%): ${(totalWeight * 0.50).toFixed(1)} جم</strong><br>
                    • Galaxolide: ${(totalWeight * 0.30).toFixed(1)} جم | Habanolide: ${(totalWeight * 0.10).toFixed(1)} جم<br>
                    • Ambrettolide: ${(totalWeight * 0.05).toFixed(1)} جم | Helvetolide: ${(totalWeight * 0.05).toFixed(1)} جم
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-purple);">2. النوتة البودرية الزهرية (30%): ${(totalWeight * 0.30).toFixed(1)} جم</strong><br>
                    • Alpha-Isomethyl Ionone: ${(totalWeight * 0.10).toFixed(1)} جم | Beta Ionone: ${(totalWeight * 0.05).toFixed(1)} جم<br>
                    • Lily Aldehyde: ${(totalWeight * 0.05).toFixed(1)} جم | Muguet + Violet: ${(totalWeight * 0.10).toFixed(1)} جم
                </div>
                <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                    <strong style="color:var(--accent-green);">3. التنعيم والمذيب (20%): ${(totalWeight * 0.20).toFixed(1)} جم</strong><br>
                    • Hedione: ${(totalWeight * 0.07).toFixed(1)} جم | Benzyl Salicylate: ${(totalWeight * 0.03).toFixed(1)} جم<br>
                    • مذيب DPG النقي: ${(totalWeight * 0.10).toFixed(1)} جم
                </div>
            </div>
            <div style="padding:8px; background:#060b14; border-radius:4px; color:#cbd5e1;">⏳ <b>بروتوكول الاستقرار:</b> يُعتّق لمدة <b>14 يوماً</b> للوصول إلى النعومة البودرية التامة ومنع أي حدة ألدهايدية.</div>
        `;
    } else {
        details = `
            <div style="background:var(--bg-card-hover); padding:10px; border-radius:5px;">
                <strong>النموذج المفتوح لأي مسك (Custom):</strong><br>
                • القاعدة المسكية الأساسية (45%): ${(totalWeight * 0.45).toFixed(1)} جم (Galaxolide / Cashmeran / Habanolide)<br>
                • الأكورد المختار (ورد / فانيلا / توت / عنبر) (35%): ${(totalWeight * 0.35).toFixed(1)} جم<br>
                • مواد التنعيم (Hedione + Benzyl Salicylate) (10%): ${(totalWeight * 0.10).toFixed(1)} جم<br>
                • المذيب الحامل DPG (10%): ${(totalWeight * 0.10).toFixed(1)} جم
            </div>
        `;
    }

    resBox.innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-rose); font-size:0.9em;">
            <div style="color:var(--accent-rose); font-weight:bold; margin-bottom:8px;">🔬 الوصفة المخبرية الدقيقة لإنتاج ${totalWeight} جم مسك لزج فاخر:</div>
            ${details}
        </div>
    `;
}

// -------------------------------------------------------------
// 3. مختبر معطرات الشعر والجسم وضبط الـ pH (Hair & Body Mists)
// -------------------------------------------------------------
function renderSplashView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">🌸 3. مختبر صياغة معطرات الشعر والجسم وضبط الـ pH (Hair & Body Mists)</h2>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">الصياغة المائية الآمنة غير الدهنية</div>
                <div class="grid-3">
                    <div>
                        <label>نوع المعطر:</label>
                        <select id="mist-type" onchange="calculateSplashFormula()">
                            <option value="hair" selected>معطر الشعر المائي (Hair Mist - pH 5.0)</option>
                            <option value="body">معطر الجسم المرطب (Body Splash - pH 5.5)</option>
                            <option value="hybrid">الرذاذ الهجين للشعر والجسم (100 مل)</option>
                        </select>
                    </div>
                    <div>
                        <label>حجم العبوة (مل):</label>
                        <input type="number" id="mist-vol" value="100" oninput="calculateSplashFormula()">
                    </div>
                    <div>
                        <label>تركيز الزيت العطري (%):</label>
                        <input type="number" id="mist-oil-pct" value="2" oninput="calculateSplashFormula()">
                    </div>
                </div>
                <div id="mist-result-box" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function calculateSplashFormula() {
    const type = document.getElementById("mist-type").value;
    const vol = parseFloat(document.getElementById("mist-vol").value) || 100;
    const oilPct = parseFloat(document.getElementById("mist-oil-pct").value) || 2;
    const resBox = document.getElementById("mist-result-box");

    let details = "";
    if (type === "hair") {
        const oilG = vol * (oilPct / 100);
        const solubilizerG = oilG * 2.5; // Polysorbate 20
        const panthenolG = vol * 0.008; // 0.8% D-Panthenol
        const preservativeG = vol * 0.005; // 0.5%
        const waterMl = vol - (oilG + solubilizerG + panthenolG + preservativeG);

        details = `
            • <b>الزيت العطري التجميلي:</b> ${oilG.toFixed(2)} جم<br>
            • <b>مستحلب Polysorbate 20 (خفيف للشعر):</b> ${solubilizerG.toFixed(2)} جم (نسبة 1:2.5 لمنع إثقال البصيلات)<br>
            • <b>مرطب ومغذي D-Panthenol:</b> ${panthenolG.toFixed(2)} جم (لمعان ونعومة للأطراف)<br>
            • <b>مادة حافظة مائية (Cosgard / Phenoxyethanol):</b> ${preservativeG.toFixed(2)} جم<br>
            • <b>ماء مقطر نقي معقم:</b> <span style="color:var(--accent-blue); font-weight:bold;">${waterMl.toFixed(1)} مل</span><br>
            • <b>الأس الهيدروجيني المستهدف:</b> <span style="color:#4ade80; font-weight:bold;">pH 4.5 – 5.5</span> (يُضبط بحمض الستريك المخفف).
        `;
    } else if (type === "body") {
        const oilG = vol * (oilPct / 100);
        const solubilizerG = oilG * 2.0;
        const glycerinG = vol * 0.02; // 2% جلسرين / صبار
        const alcoholMl = vol * 0.10; // 10% كحول تجميلي لانتعاش سريع
        const preservativeG = vol * 0.005;
        const waterMl = vol - (oilG + solubilizerG + glycerinG + alcoholMl + preservativeG);

        details = `
            • <b>الزيت العطري:</b> ${oilG.toFixed(2)} جم | <b>مستحلب Polysorbate 20:</b> ${solubilizerG.toFixed(2)} جم<br>
            • <b>جلسرين نباتي نقي / خلاصة الصبار:</b> ${glycerinG.toFixed(2)} جم<br>
            • <b>كحول إيثيلي تجميلي 96%:</b> ${alcoholMl.toFixed(1)} مل (سرعة تطاير وانتعاش)<br>
            • <b>ماء مقطر نقي:</b> ${waterMl.toFixed(1)} مل | <b>مادة حافظة:</b> ${preservativeG.toFixed(2)} جم<br>
            • <b>الأس الهيدروجيني المستهدف:</b> <span style="color:#4ade80; font-weight:bold;">pH 5.0 – 6.0</span>.
        `;
    } else {
        details = `
            • <b>الزيت العطري:</b> ${(vol * 0.08).toFixed(1)} جم (8%) | <b>المثبت DPG:</b> ${(vol * 0.02).toFixed(1)} جم (2%)<br>
            • <b>مرطب بانثينول / جلسرين:</b> ${(vol * 0.015).toFixed(1)} جم (1.5%)<br>
            • <b>المستحلب Polysorbate 20:</b> ${(vol * 0.16).toFixed(1)} جم (16% - ضعف الزيت)<br>
            • <b>كحول إيثيلي تجميلي 96%:</b> ${(vol * 0.625).toFixed(1)} مل (62.5%)<br>
            • <b>ماء مقطر نقي:</b> ${(vol * 0.10).toFixed(1)} مل (10%)
        `;
    }

    resBox.innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-purple); font-size:0.9em;">
            <div style="color:var(--accent-purple); font-weight:bold; margin-bottom:8px;">🌸 التركيبة المخبرية لـ (${vol} مل):</div>
            ${details}
            <div style="margin-top:10px; padding:8px; background:var(--bg-card-hover); border-radius:4px; color:#cbd5e1;">
                🧪 <b>طريقة الخلط لمنع التعكر:</b> اخلط الزيت العطري مع المستحلب أولاً ورجه جيداً حتى الشفافية التامة، ثم أضف المكونات المرطبة والكحول، وأخيراً أضف الماء المقطر تدريجياً مع التحريك المستمر.
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 4. مختبر البخور والمعمول والدخون (Incense Studio)
// -------------------------------------------------------------
function renderBakhoorView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">🪵 4. مختبر البخور والمعمول والدخون والتراثي المكرمل (Incense Studio)</h2>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">تصميم خلطات البخور والمعمول والاحتراق البطيء</div>
                <div class="grid-2">
                    <div>
                        <label>نوع الصنف المستهدف:</label>
                        <select id="bakhoor-type" onchange="calculateBakhoor()">
                            <option value="mabthooth" selected>مبثوث عود ملكي فاخر</option>
                            <option value="maamoul">معمول عود مقولب (أقراص/كرات)</option>
                            <option value="dakhoun">دخون ظفاري / دوسري بالظفر</option>
                            <option value="sudanese">بخور سوداني تراثي مكرمل</option>
                        </select>
                    </div>
                    <div>
                        <label>وزن خشب العود / الدقة الأساسي (جرام):</label>
                        <input type="number" id="bakhoor-wood" value="100" oninput="calculateBakhoor()">
                    </div>
                </div>
                <div id="bakhoor-result-box" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function calculateBakhoor() {
    const type = document.getElementById("bakhoor-type").value;
    const baseWeight = parseFloat(document.getElementById("bakhoor-wood").value) || 100;
    const resBox = document.getElementById("bakhoor-result-box");

    let details = "";
    if (type === "mabthooth") {
        details = `
            • <b>دقة خشب العود الطبيعي:</b> ${baseWeight} جم<br>
            • <b>خلطة الزيوت الشرقية المركزة (دهن عود + عنبر + صندل):</b> <span style="color:var(--accent-blue);">${(baseWeight * 0.35).toFixed(1)} جم</span> (35%)<br>
            • <b>بودرة المسك الأبيض والعنبر والظفر:</b> ${(baseWeight * 0.06).toFixed(1)} جم<br>
            <div style="margin-top:8px; padding:6px; background:#060b14; border-radius:4px; color:#cbd5e1;">💡 <b>طريقة التحضير:</b> فرك يدوي مباشر لدقة الخشب بالزيوت حتى التشبع التام، وتعتيق لاهوائي في أوانٍ زجاجية محكمة لمدة <b>21 يوماً</b>.</div>
        `;
    } else if (type === "maamoul") {
        details = `
            • <b>بودرة خشب العود والصندل:</b> ${baseWeight} جم<br>
            • <b>المادة الرابطة (صمغ عربي نقي / بودرة ماكو):</b> ${(baseWeight * 0.07).toFixed(1)} جم<br>
            • <b>سائل العجن (ماء ورد نقي مع قطر سكري):</b> ${(baseWeight * 0.18).toFixed(1)} جم<br>
            • <b>خلطة الزيوت العطرية المركزة:</b> ${(baseWeight * 0.25).toFixed(1)} جم<br>
            <div style="margin-top:8px; padding:6px; background:#060b14; border-radius:4px; color:#cbd5e1;">💡 <b>طريقة التحضير:</b> العجن والتشكيل في قوالب ثم التجفيف الهوائي في مكان مظلم لمدة <b>10 أيام</b>.</div>
        `;
    } else if (type === "dakhoun") {
        details = `
            • <b>دقة العود المحسن / الصندل:</b> ${baseWeight} جم<br>
            • <b>بودرة الظفر المعطر المحمص والمستكة:</b> ${(baseWeight * 0.08).toFixed(1)} جم<br>
            • <b>خلطة دهن العود والزعفران والعنبر:</b> ${(baseWeight * 0.30).toFixed(1)} جم<br>
            • <b>سائل الربط والتكرمل:</b> ${(baseWeight * 0.12).toFixed(1)} جم
        `;
    } else {
        details = `
            • <b>خشب الصندل، المحلب، السدر، والطلح:</b> ${baseWeight} جم<br>
            • <b>مصفوفة القطر السكري المكرمل بماء الورد:</b> ${(baseWeight * 0.25).toFixed(1)} جم (للاحتراق البطيء وإطلاق الرائحة بتدرج)<br>
            • <b>الراتنجات الطبيعية (لبان ذكر مسحوق + مستكة حرة + مر):</b> ${(baseWeight * 0.10).toFixed(1)} جم<br>
            • <b>التوابل المحفزة (قرنفل + هيل + قرفة مطحونة):</b> ${(baseWeight * 0.05).toFixed(1)} جم<br>
            • <b>أدهان الصندلية والمسك ودهن العود:</b> ${(baseWeight * 0.20).toFixed(1)} جم
        `;
    }

    resBox.innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-gold); font-size:0.9em;">
            <div style="color:var(--accent-gold); font-weight:bold; margin-bottom:8px;">🪵 المقادير والأوزان الدقيقة (${type.toUpperCase()}):</div>
            ${details}
        </div>
    `;
}

// -------------------------------------------------------------
// 5. مصمم المخلطات الشرقية والأدهان بالتولة (Pure Attar Lab)
// -------------------------------------------------------------
function renderMukhallatView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">🏺 5. مصمم المخلطات الشرقية والأدهان بالتولة (Pure Attar & Tola Lab)</h2>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">توليف الأدهان الصافية وأكورد "العود والعنبر الأزرق"</div>
                <div class="grid-2">
                    <div>
                        <label>الكمية المستهدفة (تولة - 1 تولة = 11.66 جم):</label>
                        <input type="number" id="mukh-tolas" value="1" step="0.25" oninput="calculateMukhallat()">
                    </div>
                    <div>
                        <label>نوع المخلط:</label>
                        <select id="mukh-preset" onchange="calculateMukhallat()">
                            <option value="blue_amber" selected>مخلط العود والعنبر الأزرق (Oud & Blue Amber Accord)</option>
                            <option value="classic">مخلط ملكي كلاسيكي (عود، ورد، صندل، عنبر)</option>
                        </select>
                    </div>
                </div>
                <div id="mukh-result-box" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function calculateMukhallat() {
    const tolas = parseFloat(document.getElementById("mukh-tolas").value) || 1;
    const preset = document.getElementById("mukh-preset").value;
    const totalG = tolas * 11.66;
    const resBox = document.getElementById("mukh-result-box");

    let details = "";
    if (preset === "blue_amber") {
        details = `
            • <b>1. الأساس العودي (40%):</b> دهن عود تراد / براشين / كمبودي: <b>${(totalG * 0.40).toFixed(2)} جم</b> (~${Math.round(totalG*0.40*30)} قطرة)<br>
            • <b>2. قلب العنبر الراتنجي (25%):</b> لابدانوم + بنزوين جاوي + فانيليا وباتشولي: <b>${(totalG * 0.25).toFixed(2)} جم</b><br>
            • <b>3. الأكورد الأزرق المنعش (20%):</b> أمبروكسان 10% + مسك بلوري + ألدهيدات C10-C12 + لمحة أوزونية وإليمي: <b>${(totalG * 0.20).toFixed(2)} جم</b><br>
            • <b>4. الموازن والناقل (15%):</b> صندل ميسور نقي: <b>${(totalG * 0.15).toFixed(2)} جم</b>
        `;
    } else {
        details = `
            • <b>دهن العود الصافي (35%):</b> ${(totalG * 0.35).toFixed(2)} جم (~${Math.round(totalG*0.35*30)} قطرة)<br>
            • <b>ورد طائفي / اسطنبولي نقي (25%):</b> ${(totalG * 0.25).toFixed(2)} جم<br>
            • <b>صندل ميسور موازن (25%):</b> ${(totalG * 0.25).toFixed(2)} جم<br>
            • <b>عنبر الحوت ومسك الغزال (15%):</b> ${(totalG * 0.15).toFixed(2)} جم
        `;
    }

    resBox.innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-green); font-size:0.9em;">
            <div style="color:var(--accent-green); font-weight:bold; margin-bottom:8px;">🏺 تركيبة المخلط الزيتي الصافي (${tolas} تولة = ${totalG.toFixed(2)} جم):</div>
            ${details}
            <div style="margin-top:10px; padding:8px; background:var(--bg-card-hover); border-radius:4px; color:#a7f3d0;">
                🔥 <b>بروتوكول الدمج الحراري والتعتيق:</b> ضع الزجاجة في حمام مائي دافئ (Water Bath عند 40°C) لمدة 30 دقيقة لتحفيز اندماج الزيوت اللزجة، ثم عتّق في زجاجات عنبرية مظلمة لـ <b>40 يوماً</b>.
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 6. مصنع معطرات الجو والمفارش وسجاد المساجد (Room Sprays)
// -------------------------------------------------------------
function renderRoomSprayView() {
    return `
        <div class="top-bar">
            <h2 class="section-title">💨 6. مصنع معطرات الجو والمفارش وسجاد المساجد (Room & Mosque Sprays)</h2>
        </div>

        <div class="dashboard-grid">
            <div class="card card-full">
                <div class="card-header">صياغة مرشات الأقمشة والمفارش بدون بقع</div>
                <div class="grid-2">
                    <div>
                        <label>نوع المرش:</label>
                        <select id="spray-type" onchange="calculateRoomSpray()">
                            <option value="haram" selected>معطر سجاد الحرم والمساجد الفاخر (توليفة الحرم)</option>
                            <option value="linen">معطر الملابس والمفارش المائي الخفيف (Zero Stain)</option>
                        </select>
                    </div>
                    <div>
                        <label>حجم العبوة (مل):</label>
                        <input type="number" id="spray-vol" value="250" oninput="calculateRoomSpray()">
                    </div>
                </div>
                <div id="spray-result-box" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function calculateRoomSpray() {
    const type = document.getElementById("spray-type").value;
    const vol = parseFloat(document.getElementById("spray-vol").value) || 250;
    const resBox = document.getElementById("spray-result-box");

    let details = "";
    if (type === "haram") {
        details = `
            • <b>ماء مقطر نقي معقم (60%):</b> ${(vol * 0.60).toFixed(1)} مل<br>
            • <b>إيثانول نقي 96% (مساعد انتشار ومطهر) (15%):</b> ${(vol * 0.15).toFixed(1)} مل<br>
            • <b>المذيب الحامل DPG (5%):</b> ${(vol * 0.05).toFixed(1)} جم<br>
            • <b>الزيت العطري المركز (توليفة الحرم: ورد طائفي + مسك + عنبر + بخور) (12%):</b> <span style="color:var(--accent-gold); font-weight:bold;">${(vol * 0.12).toFixed(1)} جم</span><br>
            • <b>مستحلب Polysorbate-20 لمنع انفصال الطبقات (3%):</b> ${(vol * 0.03).toFixed(1)} جم<br>
            • <b>مثبت Triethyl Citrate (3%):</b> ${(vol * 0.03).toFixed(1)} جم | <b>مادة حافظة Phenoxyethanol (0.5%):</b> ${(vol * 0.005).toFixed(2)} جم
        `;
    } else {
        details = `
            • <b>ماء منزوع الأيونات (92%):</b> ${(vol * 0.92).toFixed(1)} مل<br>
            • <b>الزيت العطري للأقمشة والعبايات (3%):</b> ${(vol * 0.03).toFixed(1)} جم<br>
            • <b>مستحلب Polysorbate 80 / PEG-40 HCO (4.5%):</b> ${(vol * 0.045).toFixed(1)} جم (نسبة 1:1.5 مع الزيت)<br>
            • <b>مادة حافظة مائية واسعة الطيف (0.5%):</b> ${(vol * 0.005).toFixed(2)} جم
        `;
    }

    resBox.innerHTML = `
        <div style="background:#060b14; padding:14px; border-radius:6px; border:1px solid var(--accent-purple); font-size:0.9em;">
            <div style="color:var(--accent-purple); font-weight:bold

cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE MASK - Master Fragrance Laboratory</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <aside class="sidebar">
        <div class="sidebar-brand">
            <span id="sidebar-brand-txt">🎭 THE MASK - Pro Lab</span>
        </div>

        <div class="lang-selector">
            <button class="lang-btn active" id="lang-ar" onclick="switchLanguage('ar')">العربية</button>
            <button class="lang-btn" id="lang-en" onclick="switchLanguage('en')">English</button>
            <button class="lang-btn" id="lang-fr" onclick="switchLanguage('fr')">Français</button>
        </div>

        <ul class="nav-menu">
            <li class="nav-item active" id="nav-fine" onclick="selectSection('fine')">
                <span id="nav-fine-txt">🧪 العطور الفاخرة والدمج</span>
            </li>
            <li class="nav-item" id="nav-musk" onclick="selectSection('musk')">
                <span id="nav-musk-txt">🧴 المسكات العطرية الفاخرة</span>
            </li>
            <li class="nav-item" id="nav-splash" onclick="selectSection('splash')">
                <span id="nav-splash-txt">🌸 معطرات الشعر والجسم</span>
            </li>
            <li class="nav-item" id="nav-bakhoor" onclick="selectSection('bakhoor')">
                <span id="nav-bakhoor-txt">🪵 البخور والمعمول والدخون</span>
            </li>
            <li class="nav-item" id="nav-mukhallat" onclick="selectSection('mukhallat')">
                <span id="nav-mukhallat-txt">🏺 المخلطات والأدهان بالتولة</span>
            </li>
            <li class="nav-item" id="nav-spray" onclick="selectSection('spray')">
                <span id="nav-spray-txt">💨 معطرات الجو والمفارش</span>
            </li>
            <li class="nav-item" id="nav-qc_ifra" onclick="selectSection('qc_ifra')">
                <span id="nav-qc-txt">🛡️ فحص السلامة IFRA والجودة</span>
            </li>
        </ul>
    </aside>

    <main class="main-viewport" id="main-viewport">
        </main>

    <script src="app.js"></script>
</body>
</html>
