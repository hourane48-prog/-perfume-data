import json
import os

# المسارات
BASE_DIR = os.getcwd()
DATA_DIR = os.path.join(BASE_DIR, 'DATA')
CHEM_DIR = os.path.join(BASE_DIR, 'CHEM')

# تحميل الملفات
def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

chemical_data = load_json(os.path.join(CHEM_DIR, 'chemical_master.json'))
gcms_data = load_json(os.path.join(CHEM_DIR, 'gcms_master.json'))
rules_data = load_json(os.path.join(CHEM_DIR, 'chemical_rules.json'))
perfume_catalog = load_json(os.path.join(DATA_DIR, 'perfume_catalog.json'))

# دالة الحصول على البصمة الكيميائية
def get_gcms_formula(perfume_name):
    for key, formula in gcms_data.items():
        if perfume_name.lower() in key.lower():
            return formula
    return None

# دالة فحص IFRA
def check_ifra(compound_name, percentage):
    compound = chemical_data.get(compound_name, {})
    max_limit = compound.get('ifra_max_pct', 100.0)
    return percentage <= max_limit

# دالة تعديل النسبة تلقائياً
def enforce_ifra(compound_name, percentage):
    compound = chemical_data.get(compound_name, {})
    max_limit = compound.get('ifra_max_pct', 100.0)
    if percentage > max_limit:
        return max_limit
    return percentage

# دالة الحصول على الكثافة
def get_density(compound_name):
    compound = chemical_data.get(compound_name, {})
    return compound.get('density', 1.0)

# دالة الحصول على السعر
def get_price(compound_name):
    compound = chemical_data.get(compound_name, {})
    return compound.get('price_per_kg_jod', 0.0)

# دالة حساب الوزن بالجرام
def calculate_weight(volume_ml, compound_name):
    density = get_density(compound_name)
    return volume_ml * density

# دالة بناء التركيبة الصناعية الكاملة
def build_industrial_formula(perfume_name, total_batch_grams, concentration, family):
    """بناء التركيبة النهائية بناءً على البصمة الكيميائية"""
    
    # 1. الحصول على البصمة الكيميائية
    gcms_formula = get_gcms_formula(perfume_name)
    if not gcms_formula:
        return None
    
    # 2. حساب كمية الزيت العطري
    oil_amount = total_batch_grams * concentration
    
    # 3. الحصول على المعززات المناسبة للعائلة
    family_rules = rules_data.get('family_enhancers', {}).get(family, {})
    enhancers = []
    primary = family_rules.get('primary')
    primary_pct = family_rules.get('pct', 0.0)
    if primary:
        enhancers.append({'name': primary, 'pct': primary_pct})
    secondary = family_rules.get('secondary')
    secondary_pct = family_rules.get('sec_pct', 0.0)
    if secondary:
        enhancers.append({'name': secondary, 'pct': secondary_pct})
    
    # 4. حساب المذيبات
    solvents = []
    # DPG
    dpg_rule = rules_data.get('solvents_rules', {}).get('DPG', {})
    dpg_pct = dpg_rule.get('optimal_pct', 0.01)
    solvents.append({'name': 'DPG (Dipropylene Glycol)', 'pct': dpg_pct})
    # IPM
    ipm_rule = rules_data.get('solvents_rules', {}).get('IPM', {})
    ipm_pct = ipm_rule.get('optimal_pct', 0.01)
    solvents.append({'name': 'IPM (Isopropyl Myristate)', 'pct': ipm_pct})
    # BHT
    bht_rule = rules_data.get('solvents_rules', {}).get('BHT', {})
    bht_pct = bht_rule.get('optimal_pct', 0.0005)
    solvents.append({'name': 'BHT', 'pct': bht_pct})
    
    # 5. بناء التركيبة النهائية
    formula = []
    
    # إضافة الزيت العطري
    formula.append({
        'name': perfume_name,
        'weight': oil_amount,
        'pct': concentration * 100,
        'type': 'oil',
        'role': 'الزيت العطري الأساسي'
    })
    
    # إضافة المعززات
    for enhancer in enhancers:
        enhancer_weight = total_batch_grams * enhancer['pct']
        formula.append({
            'name': enhancer['name'],
            'weight': enhancer_weight,
            'pct': enhancer['pct'] * 100,
            'type': 'enhancer',
            'role': 'معزز'
        })
    
    # إضافة المذيبات
    for solvent in solvents:
        solvent_weight = total_batch_grams * solvent['pct']
        formula.append({
            'name': solvent['name'],
            'weight': solvent_weight,
            'pct': solvent['pct'] * 100,
            'type': 'solvent',
            'role': 'مذيب'
        })
    
    # إضافة الكحول (المتبقي)
    total_added_weight = sum([item['weight'] for item in formula])
    ethanol_weight = total_batch_grams - total_added_weight
    formula.append({
        'name': 'Ethanol 96%',
        'weight': ethanol_weight,
        'pct': (ethanol_weight / total_batch_grams) * 100,
        'type': 'solvent',
        'role': 'وسط ناقل'
    })
    
    return formula

# دالة حساب التكلفة
def calculate_cost(formula):
    """حساب التكلفة الإجمالية للتركيبة"""
    total_cost = 0.0
    for item in formula:
        if item['type'] == 'oil':
            total_cost += item['weight'] * 0.15
        else:
            price_per_kg = get_price(item['name'])
            total_cost += (item['weight'] / 1000) * price_per_kg
    return total_cost

# تجربة المحرك
def test_engine():
    perfume_name = "Luzi - AMBER WOOD"
    total_batch = 100
    concentration = 0.18
    family = 'woody'
    
    # بناء التركيبة
    formula = build_industrial_formula(perfume_name, total_batch, concentration, family)
    
    if formula:
        print(f"⚗️ التركيبة الصناعية الكاملة لـ {perfume_name}:")
        for item in formula:
            print(f"   • {item['name']}: {item['weight']:.2f} جرام ({item['pct']:.2f}%)")
        
        # حساب التكلفة
        cost = calculate_cost(formula)
        print(f"\n💰 التكلفة الإجمالية: {cost:.2f} د.أ")
    
    # فحص البصمة الكيميائية
    gcms_formula = get_gcms_formula(perfume_name)
    if gcms_formula:
        print(f"\n🔬 البصمة الكيميائية:")
        for molecule in gcms_formula.get('key_molecules', []):
            compound = molecule['compound']
            peak_pct = molecule['peak_pct']
            role = molecule['role']
            
            if check_ifra(compound, peak_pct):
                status = "✅ آمن"
            else:
                adjusted = enforce_ifra(compound, peak_pct)
                status = f"⚠️ تعديل إلى {adjusted}%"
            
            print(f"   • {compound} ({peak_pct}%) - {role} - {status}")

# تشغيل الاختبار
test_engine()
