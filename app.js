(function () {
    'use strict';

    // منع تضمين التطبيق داخل صفحة أخرى (clickjacking)
    if (window.top !== window.self) {
        document.documentElement.style.display = 'none';
        try { window.top.location.href = window.location.href; } catch (e) {}
        return;
    }

    const $ = (id) => document.getElementById(id);
    const T = (k, ...a) => I18N.t(k, ...a);
    const L = () => I18N.lang;
    const catLabel = (c) => I18N.catLabel(c);
    const LOC = () => (L() === 'en' ? 'en-US' : 'ar-EG');

    // ===PURE_START===
    const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
    // مبلغ آمن: أرقام محدودة فقط (يمنع Infinity/NaN/أرقام ضخمة تبوّظ الرصيد). بيرجع NaN لو غير صالح
    const MAX_AMOUNT = 1e12;
    const amt = (n) => { const v = round2(n); return Number.isFinite(v) && Math.abs(v) <= MAX_AMOUNT ? v : NaN; };

    // ---- تحويل الأرقام المنطوقة (مصري/فصحى) إلى أرقام ----
    const NW = {};
    const MULT = { 'الف': 1000, 'الاف': 1000, 'تلاف': 1000, 'مليون': 1000000 };
    (function () {
        const add = (v, list) => list.split(' ').forEach((w) => { NW[w] = v; });
        add(0, 'صفر'); add(1, 'واحد واحده'); add(2, 'اتنين اثنين اثنان تنين'); add(3, 'تلاته ثلاثه تلات ثلاث');
        add(4, 'اربعه اربع'); add(5, 'خمسه خمس'); add(6, 'سته ست'); add(7, 'سبعه سبع');
        add(8, 'تمانيه ثمانيه تمان ثمان'); add(9, 'تسعه تسع'); add(10, 'عشره عشر');
        add(11, 'احداشر حداشر احدعشر'); add(12, 'اتناشر اثناعشر اتنعشر'); add(13, 'تلتاشر تلاتاشر');
        add(14, 'اربعتاشر'); add(15, 'خمستاشر'); add(16, 'ستاشر'); add(17, 'سبعتاشر'); add(18, 'تمنتاشر'); add(19, 'تسعتاشر');
        add(20, 'عشرين عشرون'); add(30, 'تلاتين ثلاثين'); add(40, 'اربعين'); add(50, 'خمسين'); add(60, 'ستين');
        add(70, 'سبعين'); add(80, 'تمانين ثمانين'); add(90, 'تسعين');
        add(100, 'ميه مايه'); add(200, 'ميتين مايتين'); add(300, 'تلتميه تلاتميه ثلاثميه ثلاثمايه');
        add(400, 'ربعميه اربعميه اربعمايه'); add(500, 'خمسميه خمسمايه'); add(600, 'ستميه ستمايه');
        add(700, 'سبعميه سبعمايه'); add(800, 'تمنميه تمانميه ثمانميه ثمانمايه'); add(900, 'تسعميه تسعمايه');
        add(2000, 'الفين');
    })();
    // للمطابقة الداخلية فقط (الكلمات الأصلية بتفضل زي ما هي في الوصف)
    const nw = (w) => w.replace(/[\u064B-\u065F\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه').replace(/ئ/g, 'ي').replace(/ؤ/g, 'و').replace(/[.,،؟!]/g, '');
    const isNumWord = (t) => { const n = nw(t); return (n in NW) || (n in MULT); };

    function convertDigits(text) {
        return text.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                   .replace(/٫/g, '.').replace(/(\d)[,٬](\d{3})/g, '$1$2');
    }

    function wordsToNumbers(text) {
        // "5 الاف" => 5000
        text = text.replace(/(\d+(?:\.\d+)?)\s*(?:[اأآ]لف|[اأآ]لاف|تلاف)(?=\s|$)/g, (m, n) => String(parseFloat(n) * 1000));
        const toks = text.split(/\s+/).filter(Boolean);
        const out = [];
        let i = 0;
        while (i < toks.length) {
            let t = toks[i];
            if (!isNumWord(t) && t.length > 1 && t[0] === 'و' && isNumWord(t.slice(1))) { out.push('و'); t = t.slice(1); }
            if (!isNumWord(t)) { out.push(toks[i]); i++; continue; }
            const run = [t]; i++;
            while (i < toks.length) {
                const c = toks[i];
                if (isNumWord(c)) { run.push(c); i++; }
                else if (c === 'و' && i + 1 < toks.length && isNumWord(toks[i + 1])) { i++; }
                else if (c.length > 1 && c[0] === 'و' && isNumWord(c.slice(1))) { run.push(c.slice(1)); i++; }
                else break;
            }
            let total = 0, cur = 0;
            run.forEach((w) => {
                const n = nw(w);
                if (n in MULT) { total += (cur || 1) * MULT[n]; cur = 0; } else cur += NW[n];
            });
            let val = total + cur;
            if (i < toks.length) { // "وخمسين ونص"
                const a = nw(toks[i]);
                if (a === 'ونص' || a === 'ونصف') { val += 0.5; i++; }
                else if (a === 'و' && i + 1 < toks.length && ['نص', 'نصف'].includes(nw(toks[i + 1]))) { val += 0.5; i += 2; }
            }
            out.push(String(val));
        }
        return out.join(' ');
    }

    // ---- English spoken numbers: "two hundred and fifty" => 250 ----
    const NE = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
        thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
        fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
    const NEM = { hundred: 100, thousand: 1000, grand: 1000, million: 1000000 };
    const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
    const ne = (w) => w.toLowerCase().replace(/[.,!?]/g, '');
    const isNe = (w) => { const n = ne(w); return hasOwn(NE, n) || hasOwn(NEM, n); };
    function wordsToNumbersEn(text) {
        text = text.replace(/(\d+(?:\.\d+)?)\s*(?:k|thousand|grand)\b/gi, (m, n) => String(parseFloat(n) * 1000))
                   .replace(/(\d+(?:\.\d+)?)\s*million\b/gi, (m, n) => String(parseFloat(n) * 1000000))
                   .replace(/(\d+(?:\.\d+)?)\s*hundred\b/gi, (m, n) => String(parseFloat(n) * 100))
                   .replace(/\ba\s+(hundred|thousand|million)\b/gi, 'one $1')
                   .replace(/([A-Za-z])-([A-Za-z])/g, '$1 $2');
        const toks = text.split(/\s+/).filter(Boolean), out = [];
        let i = 0;
        while (i < toks.length) {
            if (!isNe(toks[i])) { out.push(toks[i]); i++; continue; }
            const run = [toks[i]]; i++;
            while (i < toks.length) {
                const c = toks[i];
                if (isNe(c)) { run.push(c); i++; }
                else if (ne(c) === 'and' && i + 1 < toks.length && isNe(toks[i + 1]) && hasOwn(NEM, ne(run[run.length - 1]))) { i++; }
                else break;
            }
            if (run.length === 1 && ne(run[0]) === 'one') { out.push(run[0]); continue; } // "one coffee 50" يفضل كلمة عادية
            let total = 0, cur = 0;
            run.forEach((w) => {
                const n = ne(w);
                if (n === 'hundred') cur = (cur || 1) * 100;
                else if (hasOwn(NEM, n)) { total += (cur || 1) * NEM[n]; cur = 0; }
                else cur += NE[n];
            });
            let val = total + cur;
            if (i < toks.length && ne(toks[i]) === 'and') {
                if (i + 2 < toks.length && ne(toks[i + 1]) === 'a' && ne(toks[i + 2]) === 'half') { val += 0.5; i += 3; }
                else if (i + 1 < toks.length && ne(toks[i + 1]) === 'half') { val += 0.5; i += 2; }
            }
            out.push(String(val));
        }
        return out.join(' ');
    }

    const CURRENCY = ['جنيه', 'جنية', 'جنيها', 'جنيهات', 'ج', 'ج.م', 'جم', 'جنيهًا', 'egp', 'pound', 'pounds', 'le', 'l.e', 'l.e.'];
    const cleanDesc = (d, stripLeadAnd) => {
        let w = d.replace(/[,،.\-]+/g, ' ').split(/\s+/).filter(Boolean).filter((x) => !CURRENCY.includes(x.toLowerCase()));
        let r = w.join(' ');
        if (stripLeadAnd) r = r.replace(/^و\s+/, '').replace(/^و(?=\S)/, '').replace(/^and\s+/i, '');
        return r.replace(/\s+و$/, '').replace(/\s+and$/i, '').trim();
    };

    // يقسم الكلام عند كل رقم. بيدعم "قهوة 50 وعصير 20" و"50 قهوة و 20 عصير"
    function parseSegments(text) {
        text = convertDigits(text);
        const segs = [];
        if (/^\s*\d/.test(text)) { // الرقم الأول
            const re = /(\d+(?:\.\d+)?)([^\d]*)/g; let m;
            while ((m = re.exec(text))) segs.push({ amount: parseFloat(m[1]), desc: cleanDesc(m[2], false) });
            return segs;
        }
        const re = /([^\d]*)(\d+(?:\.\d+)?)/g; let m, last = 0;
        while ((m = re.exec(text))) { segs.push({ desc: m[1], amount: parseFloat(m[2]) }); last = re.lastIndex; }
        segs.forEach((s, i) => { s.desc = cleanDesc(s.desc, i > 0); });
        if (segs.length) {
            const tail = cleanDesc(text.slice(last), false);
            const ls = segs[segs.length - 1];
            if (tail) { if (!ls.desc) ls.desc = tail; else ls.extra = tail; }
        }
        return segs;
    }
    // ---- التواريخ المنطوقة: أمس / أول امبارح / من 3 أيام / yesterday / 3 days ago ----
    function extractDate(text) {
        const rules = [
            [/(?:^|\s)(?:من|منذ|قبل)\s+(\d+)\s+(?:يوم|ايام|أيام)(?=\s|$)/, (m) => parseInt(m[1], 10)],
            [/\b(\d+)\s+days?\s+ago\b/i, (m) => parseInt(m[1], 10)],
            [/(?:^|\s)(?:[اأإ]ول\s+(?:[اأإ]?م?بارح|[اأإ]مس)|قبل\s+(?:[اأإ]?م?بارح|[اأإ]مس))(?=\s|$)/, () => 2],
            [/\bday before yesterday\b/i, () => 2],
            [/(?:^|\s)(?:[اأإ]?م?بارح|[اأإ]مس)(?=\s|$)/, () => 1],
            [/\byesterday\b/i, () => 1],
            [/(?:^|\s)(?:النهارد[هة]|اليوم)(?=\s|$)/, () => 0],
            [/\btoday\b/i, () => 0]
        ];
        for (const [re, f] of rules) {
            const m = text.match(re);
            if (m) { const days = Math.min(f(m), 365); return { days, text: text.replace(re, ' ').replace(/\s+/g, ' ').trim() }; }
        }
        return { days: 0, text };
    }
    function daysAgoTs(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.getTime(); }
    // ===PURE_END===

    // ---------- ثوابت ----------
    const CATEGORIES = ['أكل وشرب 🍔', 'مواصلات 🚗', 'فواتير 🧾', 'ملابس 👕', 'صحة 🏥', 'ادخار 💎', 'أخرى 📦'];
    const INCOME_CATS = ['راتب 💼', 'دخل إضافي 🎁', 'دخل 💰'];
    const OTHER_CAT = 'أخرى 📦';
    const MAX_CUSTOM_CATS = 20;
    const expCats = () => CATEGORIES.concat(state.customCats.expense);
    const incCats = () => INCOME_CATS.concat(state.customCats.income);
    // اسم التصنيف بدون رموز/إيموجي للمطابقة في الأوامر الصوتية
    const catKey = (c) => String(c).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
    const findCustomCat = (list, text) => { const t = String(text).toLowerCase(); return list.find((c) => { const k = catKey(c); return k && t.includes(k); }); };
    // تنظيف أسماء التصنيفات المخصصة (يمنع الأسماء الخطرة مثل __proto__ والتكرار)
    function cleanCatName(n) { return String(n == null ? '' : n).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24); }
    function cleanCats(arr, builtin) {
        const out = [], seen = new Set(builtin.map((x) => x.toLowerCase()).concat(builtin.map(catKey).filter(Boolean)));
        (Array.isArray(arr) ? arr : []).forEach((n) => {
            const v = cleanCatName(n);
            const k = catKey(v);
            if (!v || (v in Object.prototype) || seen.has(v.toLowerCase()) || (k && seen.has(k)) || out.length >= MAX_CUSTOM_CATS) return;
            seen.add(v.toLowerCase()); if (k) seen.add(k); out.push(v);
        });
        return out;
    }
    const SAVING_CAT = 'ادخار 💎';
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const STORAGE_KEY = 'myWalletData';
    const PIN_KEY = 'walletPin';

    // ---------- أدوات مساعدة ----------
    const fmt = (n) => Number(n || 0).toLocaleString(L() === 'en' ? 'en-US' : undefined, { maximumFractionDigits: 2 });
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const monthKey = (ts) => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
    const monthLabel = (key) => { const [y, m] = key.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString(LOC(), { month: 'long', year: 'numeric' }); };
    const toLocalInput = (ts) => { const d = new Date(ts || Date.now()); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
    const fromLocalInput = (v) => { const t = new Date(v).getTime(); return isNaN(t) ? null : t; };
    function el(tag, opts, children) {
        const n = document.createElement(tag);
        if (opts) for (const k in opts) {
            if (k === 'text') n.textContent = opts[k];
            else if (k === 'class') n.className = opts[k];
            else if (k === 'on') for (const ev in opts.on) n.addEventListener(ev, opts.on[ev]);
            else n.setAttribute(k, opts[k]);
        }
        (children || []).forEach((c) => n.appendChild(c));
        return n;
    }
    const safeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const safeSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
    const safeDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };
    let toastTimer;
    function toast(msg, undoFn) {
        const t = $('toast'); t.textContent = msg; t.classList.remove('has-action');
        if (undoFn) {
            t.appendChild(el('button', { type: 'button', class: 'toast-undo', text: T('undoBtn'), on: { click: () => { t.classList.remove('show', 'has-action'); undoFn(); } } }));
            t.classList.add('has-action');
        }
        t.classList.add('show'); clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show', 'has-action'), undoFn ? 9000 : 4500);
    }
    function fillSelect(sel, list) { const prev = sel.value; sel.innerHTML = ''; list.forEach((c) => sel.appendChild(el('option', { value: c, text: catLabel(c) }))); if (prev && list.includes(prev)) sel.value = prev; }
    function downloadBlob(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    const b64 = (buf) => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(s); };
    const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

    // ---------- الوضع الليلي ----------
    const themeBtn = $('themeBtn');
    const currentTheme = safeGet('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.addEventListener('click', () => {
        const nt = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nt);
        safeSet('theme', nt);
        themeBtn.textContent = nt === 'dark' ? '☀️' : '🌙';
        updateChart();
    });

    // ---------- النوافذ ----------
    const openModal = (id) => { const tt = $('toast'); if (tt.classList.contains('has-action')) tt.classList.remove('show', 'has-action'); $(id).classList.add('active'); }; // إشعار التراجع ما يغطيش أزرار النوافذ
    const closeModal = (id) => $(id).classList.remove('active');
    document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.close)));
    document.querySelectorAll('.modal-overlay').forEach((o) => o.addEventListener('click', (e) => { if (e.target === o) o.classList.remove('active'); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach((o) => o.classList.remove('active')); });

    // ---------- قوائم منسدلة بتنسيق مخصص (بدل قائمة النظام) ----------
    (function enhanceSelects() {
        const TITLES = {
            accountSelect: 'account', txAccount: 'account', editAccount: 'account', goalAcc: 'account', recAcc: 'account', bpAcc: 'account',
            txCat: 'category', editCat: 'category', recCat: 'category', bpCat: 'category', budgetCat: 'category',
            transFrom: 'transFrom', transTo: 'transTo', catType: 'type', recType: 'type', typeFilter: 'type', periodSelect: 'period', chartMode: 'analysisType'
        };
        const overlay = el('div', { class: 'dd-overlay' });
        const sheet = el('div', { class: 'dd-sheet', role: 'dialog' });
        const title = el('div', { class: 'dd-title' });
        const list = el('div', { class: 'dd-list', role: 'listbox' });
        sheet.appendChild(title); sheet.appendChild(list); overlay.appendChild(sheet); document.body.appendChild(overlay);
        let current = null, lastOpen = 0;

        function close() {
            overlay.classList.remove('active');
            if (current) { const c = current; current = null; try { c.focus({ preventScroll: true }); } catch (e) {} }
        }
        function open(sel) {
            if (sel.disabled) return;
            current = sel; lastOpen = Date.now();
            title.textContent = (TITLES[sel.id] ? T(TITLES[sel.id]) : '') || sel.getAttribute('aria-label') || T('choose');
            list.innerHTML = '';
            Array.from(sel.options).forEach((o, i) => {
                list.appendChild(el('button', {
                    class: 'dd-opt', type: 'button', role: 'option', 'aria-selected': String(i === sel.selectedIndex), text: o.textContent,
                    on: { click: () => { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); close(); } }
                }));
            });
            overlay.classList.add('active');
            const chosen = list.querySelector('[aria-selected="true"]');
            if (chosen) { try { chosen.focus({ preventScroll: true }); chosen.scrollIntoView({ block: 'center' }); } catch (e) {} }
        }
        overlay.addEventListener('click', (e) => { if (e.target === overlay && Date.now() - lastOpen > 350) close(); });
        list.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            e.preventDefault();
            const items = Array.from(list.children), i = items.indexOf(document.activeElement);
            const next = items[e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1)];
            if (next) next.focus();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) { e.stopPropagation(); close(); } }, true);

        document.querySelectorAll('select').forEach((sel) => {
            let sx = 0, sy = 0, moved = false;
            sel.addEventListener('touchstart', (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; moved = false; }, { passive: true });
            sel.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (Math.abs(t.clientX - sx) > 10 || Math.abs(t.clientY - sy) > 10) moved = true; }, { passive: true });
            sel.addEventListener('touchend', (e) => { if (moved) return; e.preventDefault(); open(sel); });
            sel.addEventListener('mousedown', (e) => { e.preventDefault(); if (Date.now() - lastOpen > 400) open(sel); });
            sel.addEventListener('click', (e) => { e.preventDefault(); });
            sel.addEventListener('keydown', (e) => { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open(sel); } });
        });
    })();

    // ---------- البيانات ----------
    let state = emptyState();
    let period = 'all';
    function emptyState() { return { balances: { cash: 0, bank: 0 }, transactions: [], basket: [], budgets: {}, goals: [], recurring: [], customCats: { expense: [], income: [] }, lastBackup: 0 }; }

    function normalizeState(raw) {
        const s = emptyState();
        if (!raw || typeof raw !== 'object') return s;
        const b = raw.balances || {};
        s.balances.cash = amt(Number(b.cash)) || 0;
        s.balances.bank = amt(Number(b.bank)) || 0;
        const cc = (raw.customCats && typeof raw.customCats === 'object') ? raw.customCats : {};
        s.customCats.expense = cleanCats(cc.expense, CATEGORIES);
        s.customCats.income = cleanCats(cc.income, INCOME_CATS);
        s.transactions = (Array.isArray(raw.transactions) ? raw.transactions : []).map((t) => {
            if (!t || typeof t !== 'object') return null;
            const type = ['expense', 'income', 'transfer'].includes(t.type) ? t.type : null;
            const amount = amt(Number(t.amount));
            if (!type || !(amount > 0)) return null;
            const description = String(t.description == null ? '' : t.description).slice(0, 200);
            const tx = { id: String(t.id || uid()), type, amount, description, category: String(t.category || OTHER_CAT).slice(0, 40), ts: Number(t.ts) || 0 };
            if (t.goalId) tx.goalId = String(t.goalId);
            if (type === 'transfer') { tx.from = t.from === 'bank' ? 'bank' : 'cash'; tx.to = tx.from === 'cash' ? 'bank' : 'cash'; }
            else tx.account = (t.account === 'bank' || t.account === 'cash') ? t.account : ((description.includes('(كاش)') || description.includes('(Cash)')) ? 'cash' : 'bank');
            return tx;
        }).filter(Boolean);
        s.basket = (Array.isArray(raw.basket) ? raw.basket : []).map((i) => (i && i.text != null) ? { id: Number(i.id) || Date.now() + Math.random(), text: String(i.text).slice(0, 200), checked: !!i.checked } : null).filter(Boolean);
        if (raw.budgets && typeof raw.budgets === 'object') CATEGORIES.concat(s.customCats.expense).forEach((c) => { const v = amt(Number(raw.budgets[c])); if (v > 0) s.budgets[c] = v; });
        s.goals = (Array.isArray(raw.goals) ? raw.goals : []).map((g) => {
            const target = amt(Number(g && g.target));
            if (!g || !(target > 0)) return null;
            return { id: String(g.id || uid()), name: String(g.name || T('goalDefault')).slice(0, 40), target, saved: Math.max(0, amt(Number(g.saved)) || 0) };
        }).filter(Boolean);
        s.recurring = (Array.isArray(raw.recurring) ? raw.recurring : []).map((r) => {
            const amount = amt(Number(r && r.amount));
            if (!r || !(amount > 0)) return null;
            return {
                id: String(r.id || uid()), type: r.type === 'income' ? 'income' : 'expense', description: String(r.description || '').slice(0, 80),
                amount, category: String(r.category || OTHER_CAT).slice(0, 40), account: r.account === 'bank' ? 'bank' : 'cash',
                day: Math.min(28, Math.max(1, parseInt(r.day, 10) || 1)), lastMonth: /^\d{4}-\d{2}$/.test(r.lastMonth) ? r.lastMonth : monthKey(Date.now())
            };
        }).filter(Boolean);
        s.lastBackup = Number(raw.lastBackup) || 0;
        return s;
    }

    function loadData() {
        try { const saved = safeGet(STORAGE_KEY); if (saved) state = normalizeState(JSON.parse(saved)); }
        catch (e) {
            console.error('Corrupted data', e);
            safeSet(STORAGE_KEY + '_corrupt_' + Date.now(), safeGet(STORAGE_KEY) || '');
            state = emptyState();
        }
        updateUI();
    }
    function saveData() {
        if (!safeSet(STORAGE_KEY, JSON.stringify(state))) alert(T('saveFail'));
        updateUI();
    }

    // ---------- منطق العمليات ----------
    const txAccount = (t) => t.account || ((t.description.includes('(كاش)') || t.description.includes('(Cash)')) ? 'cash' : 'bank');
    function applyTx(t, sign) {
        const a = t.amount * sign;
        if (t.type === 'expense') { const k = txAccount(t); state.balances[k] = round2(state.balances[k] - a); }
        else if (t.type === 'income') { const k = txAccount(t); state.balances[k] = round2(state.balances[k] + a); }
        else { state.balances[t.from] = round2(state.balances[t.from] - a); state.balances[t.to] = round2(state.balances[t.to] + a); }
    }
    const hasNegative = () => state.balances.cash < 0 || state.balances.bank < 0;
    const snapBal = () => ({ cash: state.balances.cash, bank: state.balances.bank });

    function getCategory(text) {
        text = text.toLowerCase();
        const custom = findCustomCat(state.customCats.expense, text); if (custom) return custom;
        if (/أكل|اكل|قهوة|قهوه|عصير|مطعم|سوبر|خضار|فاكهة|لحمة|فراخ|شاي|عيش|جبنة|لبن|\b(?:food|meals?|lunch|dinner|breakfast|coffee|tea|juice|restaurant|grocer\w*|supermarket|vegetables?|fruits?|meat|chicken|bread|cheese|milk|snacks?|pizza|burger)\b/.test(text)) return CATEGORIES[0];
        if (/مواصلات|تاكسي|بنزين|أتوبيس|اتوبيس|ميكروباص|مترو|أوبر|اوبر|كريم|\b(?:transport\w*|taxi|uber|careem|fuel|petrol|gasoline|bus|metro|train|ride|tickets?)\b/.test(text)) return CATEGORIES[1];
        if (/كهربا|مية|غاز|نت|فاتورة|فاتوره|تليفون|شحن|\b(?:electricity|water|internet|wifi|bills?|phone|recharge|top.?up)\b/.test(text)) return CATEGORIES[2];
        if (/هدوم|ملابس|جزمة|جزمه|شنطة|شنطه|كوتشي|\b(?:clothes|clothing|shoes?|shirts?|bags?|sneakers|jeans|jacket|dress)\b/.test(text)) return CATEGORIES[3];
        if (/دوا|دكتور|صيدلية|صيدليه|علاج|مستشفى|\b(?:medicine|pharmacy|doctor|hospital|clinic|medical|drugs?|treatment)\b/.test(text)) return CATEGORIES[4];
        return OTHER_CAT;
    }
    function addTransaction(t) { t.id = uid(); t.ts = t.ts || Date.now(); state.transactions.push(t); return t; }

    // ---------- الفترة ----------
    function filteredTx() { return period === 'all' ? state.transactions : state.transactions.filter((t) => t.ts && monthKey(t.ts) === period); }
    function buildPeriodSelect() {
        const sel = $('periodSelect');
        const months = Array.from(new Set(state.transactions.filter((t) => t.ts).map((t) => monthKey(t.ts)))).sort().reverse();
        if (period !== 'all' && !months.includes(period)) period = 'all';
        sel.innerHTML = '';
        sel.appendChild(el('option', { value: 'all', text: T('allPeriods') }));
        months.forEach((m) => sel.appendChild(el('option', { value: m, text: monthLabel(m) })));
        sel.value = period;
    }
    $('periodSelect').addEventListener('change', (e) => { period = e.target.value; renderHistory(); renderSummary(); renderBudgets(); updateChart(); });
    $('chartMode').addEventListener('change', updateChart);
    $('searchBox').addEventListener('input', renderHistory);
    $('typeFilter').addEventListener('change', renderHistory);

    function renderSummary() {
        let inc = 0, exp = 0;
        filteredTx().forEach((t) => { if (t.type === 'income') inc += t.amount; else if (t.type === 'expense') exp += t.amount; });
        $('sumIncome').textContent = fmt(inc);
        $('sumExpense').textContent = fmt(exp);
    }

    function updateUI() {
        $('cashBalance').textContent = fmt(state.balances.cash) + ' ' + T('cur');
        $('bankBalance').textContent = fmt(state.balances.bank) + ' ' + T('cur');
        buildPeriodSelect(); renderHistory(); renderSummary(); renderBasket(); renderBudgets(); renderGoals(); renderRecurring(); renderBackupInfo(); updateChart();
    }

    // ---------- السجل ----------
    function renderHistory() {
        const list = $('historyList');
        list.innerHTML = '';
        const q = $('searchBox').value.trim().toLowerCase();
        const ft = $('typeFilter').value;
        const txs = filteredTx().map((t, i) => ({ t, i }))
            .filter(({ t }) => (ft === 'all' || t.type === ft) && (!q || (t.description + ' ' + t.category + ' ' + catLabel(t.category)).toLowerCase().includes(q)))
            .sort((a, b) => (b.t.ts - a.t.ts) || (b.i - a.i)).map((x) => x.t);
        if (!txs.length) { list.appendChild(el('li', { class: 'empty-msg', text: q || ft !== 'all' ? T('noMatches') : T('noTx') })); return; }
        txs.forEach((t) => {
            let icon = '🛍️', sign = '-', color = 'var(--danger)';
            if (t.type === 'income') { icon = '💰'; sign = '+'; color = 'var(--primary)'; }
            if (t.type === 'transfer') { icon = '🔄'; sign = ''; color = 'var(--info)'; }
            const meta = el('div', { class: 'history-meta' }, [el('span', { class: 'history-category', text: catLabel(t.category || OTHER_CAT) })]);
            const accTxt = t.type === 'transfer' ? (t.from === 'cash' ? T('cashToBank') : T('bankToCash')) : (txAccount(t) === 'cash' ? T('cash') : T('bank'));
            meta.appendChild(el('span', { class: 'chip', text: accTxt }));
            if (t.ts) meta.appendChild(el('span', { class: 'history-date', text: new Date(t.ts).toLocaleString(LOC(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }));
            const info = el('div', { class: 'history-info' }, [el('span', { class: 'history-desc' }, [el('span', { text: icon }), el('span', { text: t.type === 'transfer' ? T('transferTo', t.to === 'cash' ? T('cash') : T('bank')) : t.description })]), meta]);
            const side = el('div', { class: 'history-side' }, [
                el('span', { text: sign + ' ' + fmt(t.amount), style: 'color:' + color + '; font-weight:700;' }),
                el('button', { class: 'tx-btn', 'aria-label': T('edit'), text: '✏️', on: { click: () => openEdit(t.id) } }),
                el('button', { class: 'tx-btn del', 'aria-label': T('del'), text: '×', on: { click: () => deleteTransaction(t.id) } })
            ]);
            list.appendChild(el('li', { class: 'history-item ' + t.type }, [info, side]));
        });
    }

    function deleteTransaction(id) {
        const index = state.transactions.findIndex((t) => t.id === id);
        if (index === -1) return;
        const t = state.transactions[index];
        const before = snapBal();
        applyTx(t, -1);
        const goesNeg = hasNegative() && !(before.cash < 0 || before.bank < 0);
        if (!confirm(goesNeg ? T('delNegConfirm') : T('delConfirm'))) { state.balances = before; return; }
        if (t.goalId) { const g = state.goals.find((x) => x.id === t.goalId); if (g) g.saved = Math.max(0, round2(g.saved - t.amount)); }
        state.transactions.splice(index, 1);
        saveData();
    }

    // ---------- إضافة مصروف / دخل ----------
    let txType = 'expense';
    function openTxModal(type) {
        txType = type;
        $('txTitle').textContent = type === 'expense' ? T('txAddExpense') : T('txAddIncome');
        fillSelect($('txCat'), type === 'expense' ? expCats() : incCats());
        $('txCat').value = type === 'expense' ? OTHER_CAT : INCOME_CATS[2];
        $('txAmount').value = ''; $('txDesc').value = '';
        $('txDate').value = toLocalInput(Date.now());
        openModal('modalTx');
    }
    $('openExpenseBtn').addEventListener('click', () => openTxModal('expense'));
    $('openIncomeBtn').addEventListener('click', () => openTxModal('income'));
    $('txDesc').addEventListener('input', () => { if (txType === 'expense') $('txCat').value = getCategory($('txDesc').value); });
    $('txConfirmBtn').addEventListener('click', () => {
        const account = $('txAccount').value;
        const amount = amt(parseFloat($('txAmount').value));
        if (!(amount > 0)) return alert(T('invalidAmount'));
        if (txType === 'expense' && state.balances[account] < amount) return alert(T('insufficient'));
        const ts = fromLocalInput($('txDate').value) || Date.now();
        const desc = $('txDesc').value.trim().slice(0, 80) || (txType === 'expense' ? T('descExpense') : T('descManual'));
        const t = addTransaction({ type: txType, amount, description: desc, category: $('txCat').value, account, ts });
        applyTx(t, 1);
        saveData();
        closeModal('modalTx');
        const bw = txType === 'expense' ? budgetWarning([t.category], monthKey(ts)) : '';
        if (bw) toast('⚠️ ' + bw);
    });

    // ---------- التحويل ----------
    function updateToAccount() {
        const toBank = $('transFrom').value === 'cash';
        $('transTo').innerHTML = '';
        $('transTo').appendChild(el('option', { value: toBank ? 'bank' : 'cash', text: T(toBank ? 'toBankE' : 'toCashE') }));
    }
    $('transFrom').addEventListener('change', updateToAccount);
    $('openTransferBtn').addEventListener('click', () => { updateToAccount(); openModal('modalTransfer'); });
    $('transConfirmBtn').addEventListener('click', () => {
        const from = $('transFrom').value, to = $('transTo').value;
        const amount = amt(parseFloat($('transAmount').value));
        if (amount > 0 && state.balances[from] >= amount && from !== to) {
            const t = addTransaction({ type: 'transfer', amount, description: T('transferTo', to === 'cash' ? T('cash') : T('bank')), category: 'تحويل 🔄', from, to });
            applyTx(t, 1);
            saveData(); closeModal('modalTransfer'); $('transAmount').value = '';
        } else alert(T('transferInvalid'));
    });

    // ---------- تعديل عملية ----------
    let editingId = null;
    function openEdit(id) {
        const t = state.transactions.find((x) => x.id === id);
        if (!t) return;
        editingId = id;
        const isTr = t.type === 'transfer';
        $('editDesc').value = t.description; $('editAmount').value = t.amount;
        $('editDate').value = toLocalInput(t.ts || Date.now());
        $('editDesc').style.display = $('editCat').style.display = isTr ? 'none' : '';
        const accSel = $('editAccount'); accSel.innerHTML = '';
        if (isTr) {
            accSel.appendChild(el('option', { value: 'cash>bank', text: T('editCashToBank') }));
            accSel.appendChild(el('option', { value: 'bank>cash', text: T('editBankToCash') }));
            accSel.value = t.from + '>' + t.to;
        } else {
            accSel.appendChild(el('option', { value: 'cash', text: T('accCashE') }));
            accSel.appendChild(el('option', { value: 'bank', text: T('accBankE') }));
            accSel.value = txAccount(t);
            let cats = t.type === 'expense' ? expCats() : incCats();
            if (t.category && !cats.includes(t.category)) cats = cats.concat(t.category); // تصنيف محذوف: ما نغيّرهوش بصمت
            fillSelect($('editCat'), cats);
            $('editCat').value = cats.includes(t.category) ? t.category : cats[cats.length - 1];
        }
        openModal('modalEdit');
    }
    $('editConfirmBtn').addEventListener('click', () => {
        const t = state.transactions.find((x) => x.id === editingId);
        if (!t) return closeModal('modalEdit');
        const newAmount = amt(parseFloat($('editAmount').value));
        if (!(newAmount > 0)) return alert(T('invalidAmount'));
        const beforeBal = snapBal(), old = JSON.parse(JSON.stringify(t));
        applyTx(t, -1);
        t.amount = newAmount;
        t.ts = fromLocalInput($('editDate').value) || t.ts;
        if (t.type === 'transfer') { const [f, to] = $('editAccount').value.split('>'); t.from = f; t.to = to; }
        else {
            t.account = $('editAccount').value;
            t.description = $('editDesc').value.trim().slice(0, 80) || t.description;
            t.category = $('editCat').value;
        }
        applyTx(t, 1);
        if (hasNegative() && !(beforeBal.cash < 0 || beforeBal.bank < 0)) {
            state.balances = beforeBal;
            Object.keys(t).forEach((k) => delete t[k]); Object.assign(t, old);
            return alert(T('editNeg'));
        }
        if (t.goalId) { const g = state.goals.find((x) => x.id === t.goalId); if (g) g.saved = Math.max(0, round2(g.saved + newAmount - old.amount)); }
        saveData(); closeModal('modalEdit');
    });

    // ---------- الميزانية ----------
    function spentIn(key) {
        const totals = {};
        state.transactions.forEach((t) => { if (t.type === 'expense' && t.ts && monthKey(t.ts) === key) totals[t.category] = (totals[t.category] || 0) + t.amount; });
        return totals;
    }
    const budgetMonth = () => period !== 'all' ? period : monthKey(Date.now());
    function renderBudgets() {
        const sel = $('budgetCat');
        fillSelect(sel, expCats());
        const key = budgetMonth();
        $('budgetTitle').textContent = T('budgetOf', monthLabel(key));
        const list = $('budgetList'); list.innerHTML = '';
        const cats = Object.keys(state.budgets);
        if (!cats.length) { list.appendChild(el('div', { class: 'empty-msg', text: T('noBudget') })); return; }
        const spent = spentIn(key);
        cats.forEach((c) => {
            const limit = state.budgets[c], used = round2(spent[c] || 0), pct = Math.min(100, Math.round(used / limit * 100));
            list.appendChild(el('div', { class: 'budget-row' }, [
                el('div', { class: 'budget-top' }, [el('span', { text: catLabel(c) }), el('span', { text: fmt(used) + ' / ' + fmt(limit) }),
                    el('button', { 'aria-label': T('delBudget'), text: '×', on: { click: () => { delete state.budgets[c]; saveData(); } } })]),
                el('div', { class: 'bar' }, [el('i', { class: pct >= 100 ? 'over' : pct >= 80 ? 'mid' : '', style: 'width:' + pct + '%' })])
            ]));
        });
    }
    $('budgetSaveBtn').addEventListener('click', () => {
        const limit = amt(parseFloat($('budgetLimit').value));
        if (!(limit > 0)) return alert(T('invalidLimit'));
        state.budgets[$('budgetCat').value] = limit; $('budgetLimit').value = ''; saveData();
    });
    function budgetWarning(cats, key) {
        const spent = spentIn(key), msgs = [];
        cats.forEach((c) => {
            const limit = state.budgets[c]; if (!limit) return;
            if ((spent[c] || 0) > limit) msgs.push(T('overBudget', catLabel(c)));
            else if ((spent[c] || 0) >= limit * 0.8) msgs.push(T('nearBudget', catLabel(c)));
        });
        return msgs.join(' - ');
    }

    // ---------- أهداف الادخار ----------
    let goalId = null;
    function renderGoals() {
        const list = $('goalList'); list.innerHTML = '';
        if (!state.goals.length) { list.appendChild(el('div', { class: 'empty-msg', text: T('noGoals') })); return; }
        state.goals.forEach((g) => {
            const pct = Math.min(100, Math.round(g.saved / g.target * 100));
            list.appendChild(el('div', { class: 'budget-row' }, [
                el('div', { class: 'budget-top' }, [el('span', { text: g.name + (pct >= 100 ? ' 🎉' : '') }), el('span', { text: fmt(g.saved) + ' / ' + fmt(g.target) }),
                    el('span', { class: 'goal-btns' }, [
                        el('button', { class: 'tx-btn', style: 'color:var(--primary)', 'aria-label': T('addAmount'), text: '➕', on: { click: () => { goalId = g.id; $('goalModalTitle').textContent = T('addToGoalName', g.name); $('goalAmt').value = ''; $('goalAcc').value = 'none'; openModal('modalGoal'); } } }),
                        el('button', { 'aria-label': T('delGoal'), text: '×', on: { click: () => { if (confirm(T('delGoalConfirm'))) { state.goals = state.goals.filter((x) => x.id !== g.id); saveData(); } } } })
                    ])]),
                el('div', { class: 'bar' }, [el('i', { class: pct >= 100 ? '' : 'mid', style: 'width:' + pct + '%' })])
            ]));
        });
    }
    $('goalAddBtn').addEventListener('click', () => {
        const name = $('goalName').value.trim(), target = amt(parseFloat($('goalTarget').value));
        if (!name || !(target > 0)) return alert(T('goalNeedBoth'));
        state.goals.push({ id: uid(), name: name.slice(0, 40), target, saved: 0 });
        $('goalName').value = ''; $('goalTarget').value = ''; saveData();
    });
    $('goalConfirmBtn').addEventListener('click', () => {
        const g = state.goals.find((x) => x.id === goalId); if (!g) return closeModal('modalGoal');
        const amount = amt(parseFloat($('goalAmt').value)), acc = $('goalAcc').value;
        if (!(amount > 0)) return alert(T('invalidAmount'));
        if (acc !== 'none') {
            if (state.balances[acc] < amount) return alert(T('insufficient'));
            const t = addTransaction({ type: 'expense', amount, description: T('savingDesc', g.name), category: SAVING_CAT, account: acc, goalId: g.id });
            applyTx(t, 1);
        }
        const was = g.saved; g.saved = round2(g.saved + amount);
        saveData(); closeModal('modalGoal');
        if (was < g.target && g.saved >= g.target) toast(T('goalReached', g.name));
    });

    // ---------- العمليات المتكررة ----------
    function renderRecurring() {
        const list = $('recList'); list.innerHTML = '';
        if (!state.recurring.length) { list.appendChild(el('div', { class: 'empty-msg', text: T('noRec') })); return; }
        state.recurring.forEach((r) => {
            list.appendChild(el('div', { class: 'rec-row' }, [
                el('div', {}, [el('span', { text: (r.type === 'income' ? '➕ ' : '➖ ') + r.description }), el('small', { text: T('recLine', r.day, r.account === 'cash' ? T('cash') : T('bank'), catLabel(r.category)) })]),
                el('div', { class: 'goal-btns' }, [el('b', { text: fmt(r.amount) }), el('button', { class: 'tx-btn del', 'aria-label': T('del'), text: '×', on: { click: () => { if (confirm(T('delRecConfirm'))) { state.recurring = state.recurring.filter((x) => x.id !== r.id); saveData(); } } } })])
            ]));
        });
    }
    function fillRecCats() { fillSelect($('recCat'), $('recType').value === 'expense' ? expCats() : incCats()); $('recCat').value = $('recType').value === 'expense' ? OTHER_CAT : INCOME_CATS[2]; }
    $('recType').addEventListener('change', fillRecCats);
    $('recOpenBtn').addEventListener('click', () => { $('recType').value = 'expense'; fillRecCats(); $('recDesc').value = ''; $('recAmount').value = ''; $('recDay').value = 1; openModal('modalRec'); });
    $('recDesc').addEventListener('input', () => { if ($('recType').value === 'expense') $('recCat').value = getCategory($('recDesc').value); });
    $('recConfirmBtn').addEventListener('click', () => {
        const amount = amt(parseFloat($('recAmount').value));
        const day = Math.min(28, Math.max(1, parseInt($('recDay').value, 10) || 1));
        const desc = $('recDesc').value.trim().slice(0, 80);
        if (!desc || !(amount > 0)) return alert(T('recNeedBoth'));
        const now = new Date();
        // يبدأ من أقرب موعد قادم: لو اليوم عدّى نبدأ من الشهر الجاي
        const base = day <= now.getDate() ? new Date(now.getFullYear(), now.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
        state.recurring.push({ id: uid(), type: $('recType').value, description: desc, amount, category: $('recCat').value, account: $('recAcc').value, day, lastMonth: monthKey(base.getTime()) });
        saveData(); closeModal('modalRec');
    });
    function processRecurring() {
        const now = new Date(); let created = 0, neg = false;
        state.recurring.forEach((r) => {
            let [y, m] = r.lastMonth.split('-').map(Number);
            for (let i = 0; i < 24; i++) {
                m++; if (m > 12) { m = 1; y++; }
                const due = new Date(y, m - 1, r.day, 9, 0, 0);
                if (due > now) break;
                const t = { id: uid(), type: r.type, amount: r.amount, description: r.description + ' 🔁', category: r.category, account: r.account, ts: due.getTime() };
                applyTx(t, 1); state.transactions.push(t); created++;
                r.lastMonth = y + '-' + String(m).padStart(2, '0');
                if (state.balances[r.account] < 0) neg = true;
            }
        });
        if (created) { saveData(); toast(T('recProcessed', created) + (neg ? T('negSuffix') : '')); }
    }

    // ---------- السلة ----------
    let basketPayItem = null;
    function renderBasket() {
        const list = $('basketList'); list.innerHTML = '';
        if (!state.basket.length) { list.appendChild(el('li', { class: 'empty-msg', text: T('basketEmpty') })); return; }
        state.basket.forEach((item) => {
            const cb = el('input', { type: 'checkbox', on: { change: () => {
                item.checked = !item.checked; saveData();
                if (item.checked) openBasketPay(item);
            } } });
            cb.checked = !!item.checked;
            list.appendChild(el('li', { class: 'basket-item' + (item.checked ? ' checked' : '') }, [
                el('label', {}, [cb, el('span', { text: item.text })]),
                el('button', { class: 'delete-btn', 'aria-label': T('del'), text: '×', on: { click: () => { state.basket = state.basket.filter((i) => i.id !== item.id); saveData(); } } })
            ]));
        });
    }
    function openBasketPay(item) {
        basketPayItem = item;
        $('bpTitle').textContent = T('bpTitleItem', item.text.slice(0, 40));
        fillSelect($('bpCat'), expCats()); $('bpCat').value = getCategory(item.text);
        $('bpAmount').value = ''; $('bpAcc').value = $('accountSelect').value;
        openModal('modalBasketPay');
    }
    $('bpSkipBtn').addEventListener('click', () => closeModal('modalBasketPay'));
    $('bpConfirmBtn').addEventListener('click', () => {
        const amount = amt(parseFloat($('bpAmount').value)), acc = $('bpAcc').value;
        if (!(amount > 0)) return alert(T('bpNeedPrice'));
        if (state.balances[acc] < amount) return alert(T('insufficient'));
        const t = addTransaction({ type: 'expense', amount, description: basketPayItem.text.slice(0, 80), category: $('bpCat').value, account: acc });
        applyTx(t, 1); saveData(); closeModal('modalBasketPay');
        const bw = budgetWarning([t.category], monthKey(t.ts)); if (bw) toast('⚠️ ' + bw);
    });
    function addBasketItem(textFromVoice) {
        const input = $('basketInput');
        const text = (typeof textFromVoice === 'string' && textFromVoice) ? textFromVoice.trim() : input.value.trim();
        if (!text) return;
        state.basket.push({ id: Date.now() + Math.random(), text: text.slice(0, 200), checked: false });
        if (typeof textFromVoice !== 'string') input.value = '';
        saveData();
    }
    $('basketAddBtn').addEventListener('click', () => addBasketItem());
    $('basketInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addBasketItem(); });

    // ---------- الرسم البياني (بدون مكتبات) ----------
    const COLORS = ['#12795A', '#2F6BDB', '#E0A030', '#BF3B2B', '#7A5C99', '#3C9D8F', '#B5651D', '#8A8F98'];
    function updateChart() {
        const mode = $('chartMode').value;
        const sums = {};
        filteredTx().filter((t) => t.type === mode).forEach((t) => { const c = t.category || OTHER_CAT; sums[c] = (sums[c] || 0) + t.amount; });
        const entries = Object.entries(sums).sort((a, b) => b[1] - a[1]);
        const canvas = $('expenseChart'), legend = $('chartLegend'), empty = $('chartEmptyText');
        legend.innerHTML = '';
        if (!entries.length) { canvas.style.display = 'none'; empty.style.display = 'block'; empty.textContent = mode === 'expense' ? T('noExpensesChart') : T('noIncomeChart'); return; }
        canvas.style.display = 'block'; empty.style.display = 'none';
        const total = entries.reduce((s, e) => s + e[1], 0);
        const size = 190, dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr; canvas.height = size * dpr; canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);
        const c = size / 2, R = c - 4, r = R * 0.62; let a = -Math.PI / 2;
        entries.forEach(([, v], i) => {
            const ang = v / total * Math.PI * 2;
            ctx.beginPath(); ctx.arc(c, c, R, a, a + ang); ctx.arc(c, c, r, a + ang, a, true); ctx.closePath();
            ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill(); a += ang;
        });
        const txtColor = getComputedStyle(document.body).color;
        ctx.fillStyle = txtColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '500 11px "IBM Plex Sans Arabic", sans-serif'; ctx.globalAlpha = 0.7; ctx.fillText(T('chartTotal'), c, c - 12);
        ctx.globalAlpha = 1; ctx.font = '700 16px "IBM Plex Sans Arabic", sans-serif'; ctx.fillText(fmt(total), c, c + 8);
        entries.forEach(([k, v], i) => legend.appendChild(el('div', { class: 'legend-item' }, [
            el('span', { class: 'dot', style: 'background:' + COLORS[i % COLORS.length] }), el('span', { class: 'lg-name', text: catLabel(k) }),
            el('span', { class: 'lg-val', text: fmt(v) + ' (' + Math.round(v / total * 100) + '%)' })
        ])));
    }

    // ---------- النسخ الاحتياطي / CSV ----------
    const hasCrypto = !!(window.crypto && crypto.subtle);
    async function deriveKey(password, salt) {
        const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    }
    async function buildBackupFile(password) {
        state.lastBackup = Date.now(); safeSet(STORAGE_KEY, JSON.stringify(state));
        const json = JSON.stringify(state, null, 2);
        const date = new Date().toISOString().slice(0, 10);
        if (!password) return new File([json], 'wallet_backup_' + date + '.json', { type: 'application/json' });
        const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(json));
        const out = JSON.stringify({ wallet_encrypted: 1, salt: b64(salt), iv: b64(iv), data: b64(ct) });
        return new File([out], 'wallet_backup_' + date + '_encrypted.json', { type: 'application/json' });
    }
    async function doBackup(share) {
        const pw = $('bkPass').value;
        if (pw && !hasCrypto) return alert(T('cryptoNeedHttps'));
        try {
            const file = await buildBackupFile(pw);
            if (share) await navigator.share({ files: [file], title: T('shareTitle') });
            else downloadBlob(file, file.name);
            closeModal('modalBackup'); $('bkPass').value = ''; renderBackupInfo();
        } catch (e) { if (e && e.name !== 'AbortError') alert(T('backupFail')); }
    }
    $('exportBtn').addEventListener('click', () => {
        const canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [new File(['x'], 'x.json', { type: 'application/json' })] }));
        $('bkShareBtn').style.display = canShare ? '' : 'none';
        openModal('modalBackup');
    });
    $('backupNowBtn').addEventListener('click', () => $('exportBtn').click());
    $('bkDownloadBtn').addEventListener('click', () => doBackup(false));
    $('bkShareBtn').addEventListener('click', () => doBackup(true));

    const csvCell = (v) => { let s = String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    $('csvBtn').addEventListener('click', () => {
        const typeAr = { expense: T('expense'), income: T('income'), transfer: T('transfer') };
        const rows = [[T('csvDate'), T('csvType'), T('csvDesc'), T('csvCat'), T('csvAcc'), T('csvAmount')]];
        state.transactions.slice().sort((a, b) => a.ts - b.ts).forEach((t) => {
            const acc = t.type === 'transfer' ? (t.from === 'cash' ? T('csvCashBank') : T('csvBankCash')) : (txAccount(t) === 'cash' ? T('cash') : T('bank'));
            rows.push([t.ts ? toLocalInput(t.ts).replace('T', ' ') : '', typeAr[t.type], t.type === 'transfer' ? T('transferTo', t.to === 'cash' ? T('cash') : T('bank')) : t.description, catLabel(t.category), acc, t.amount]);
        });
        const csv = '\uFEFF' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'wallet_' + new Date().toISOString().slice(0, 10) + '.csv');
    });

    let pendingEncrypted = null;
    function finishImport(raw) {
        if (!raw || typeof raw !== 'object' || !raw.balances || !Array.isArray(raw.transactions)) return alert(T('invalidFile'));
        const imported = normalizeState(raw);
        if (!confirm(T('importConfirm', imported.transactions.length))) return;
        safeSet(STORAGE_KEY + '_beforeImport', JSON.stringify(state)); // شبكة أمان
        state = imported; saveData();
        alert(T('restored'));
    }
    $('importBtn').addEventListener('click', () => $('importFile').click());
    $('importFile').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { event.target.value = ''; return alert(T('fileTooBig')); }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const raw = JSON.parse(e.target.result);
                if (raw && raw.wallet_encrypted) {
                    if (!hasCrypto) return alert(T('decryptNeedHttps'));
                    pendingEncrypted = raw; $('impPass').value = ''; openModal('modalImportPw');
                } else finishImport(raw);
            } catch (err) { alert(T('invalidFile')); }
            finally { event.target.value = ''; }
        };
        reader.readAsText(file);
    });
    $('impConfirmBtn').addEventListener('click', async () => {
        try {
            const key = await deriveKey($('impPass').value, unb64(pendingEncrypted.salt));
            const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(pendingEncrypted.iv) }, key, unb64(pendingEncrypted.data));
            const raw = JSON.parse(new TextDecoder().decode(pt));
            closeModal('modalImportPw'); pendingEncrypted = null;
            finishImport(raw);
        } catch (e) { alert(T('wrongPass')); }
    });

    function renderBackupInfo() {
        $('lastBackupNote').textContent = state.lastBackup ? T('lastBackup', new Date(state.lastBackup).toLocaleDateString(LOC())) : T('noBackupYet');
        $('backupReminder').classList.toggle('show', state.transactions.length > 0 && (!state.lastBackup || Date.now() - state.lastBackup > WEEK_MS));
    }
    let persistGranted = null;
    function renderPersistNote() { if (persistGranted !== null) $('persistNote').textContent = persistGranted ? T('persistOk') : T('persistNo'); }
    async function requestPersistence() {
        try {
            if (navigator.storage && navigator.storage.persist) {
                persistGranted = (await navigator.storage.persisted()) || (await navigator.storage.persist());
                renderPersistNote();
            }
        } catch (e) {}
    }

    // ---------- رمز القفل ----------
    let pinData = null, locked = false, hiddenAt = 0;
    let fails = Number(safeGet('walletPinFails')) || 0, lockedUntil = Number(safeGet('walletPinUntil')) || 0;
    try { pinData = JSON.parse(safeGet(PIN_KEY) || 'null'); } catch (e) { pinData = null; }
    async function pinHash(pin, saltB64) {
        if (hasCrypto) {
            const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
            return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unb64(saltB64), iterations: 100000, hash: 'SHA-256' }, k, 256));
        }
        let h = 5381; const s = pin + saltB64; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
        return 'f' + h;
    }
    const verifyPin = async (pin) => !!pinData && (await pinHash(pin, pinData.salt)) === pinData.hash;
    function updatePinButtons() { $('pinBtn').textContent = pinData ? T('pinChange') : T('pinBtn'); $('pinRemoveBtn').style.display = pinData ? '' : 'none'; }
    function lockApp() {
        if (!pinData) return;
        locked = true;
        document.querySelectorAll('.modal-overlay.active, .dd-overlay.active').forEach((o) => o.classList.remove('active'));
        document.querySelector('.container').style.display = 'none';
        $('lockScreen').classList.add('active'); $('lockInput').value = ''; $('lockMsg').textContent = '';
        setTimeout(() => $('lockInput').focus(), 80);
    }
    async function tryUnlock() {
        if (Date.now() < lockedUntil) { $('lockMsg').textContent = T('tryAfter', Math.ceil((lockedUntil - Date.now()) / 1000)); return; }
        if (await verifyPin($('lockInput').value)) {
            locked = false; fails = 0; lockedUntil = 0; safeDel('walletPinFails'); safeDel('walletPinUntil');
            $('lockScreen').classList.remove('active'); document.querySelector('.container').style.display = '';
            updateChart();
        } else {
            fails++; $('lockInput').value = '';
            safeSet('walletPinFails', String(fails));
            if (fails % 5 === 0) {
                const secs = Math.min(900, 30 * Math.pow(2, fails / 5 - 1));
                lockedUntil = Date.now() + secs * 1000; safeSet('walletPinUntil', String(lockedUntil));
                $('lockMsg').textContent = T('tooMany', secs);
            }
            else $('lockMsg').textContent = T('wrongPin');
        }
    }
    $('lockBtn').addEventListener('click', tryUnlock);
    $('lockInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
    $('lockForgot').addEventListener('click', () => alert(T('forgotInfo')));
    let pinMode = 'set';
    function openPin(mode) {
        pinMode = mode;
        $('pinTitle').textContent = mode === 'remove' ? T('pinRemove') : (pinData ? T('pinChange') : T('pinSetTitle'));
        $('pinOld').style.display = pinData ? '' : 'none';
        $('pinNew').style.display = $('pinNew2').style.display = mode === 'set' ? '' : 'none';
        $('pinOld').value = $('pinNew').value = $('pinNew2').value = '';
        openModal('modalPin');
    }
    $('pinBtn').addEventListener('click', () => openPin('set'));
    $('pinRemoveBtn').addEventListener('click', () => openPin('remove'));
    $('pinConfirmBtn').addEventListener('click', async () => {
        if (pinData && !(await verifyPin($('pinOld').value))) return alert(T('pinOldWrong'));
        if (pinMode === 'remove') { safeDel(PIN_KEY); pinData = null; updatePinButtons(); closeModal('modalPin'); return toast(T('pinRemoved')); }
        const n = $('pinNew').value;
        if (!/^\d{4,8}$/.test(n)) return alert(T('pinFormat'));
        if (n !== $('pinNew2').value) return alert(T('pinMismatch'));
        const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
        pinData = { salt, hash: await pinHash(n, salt) };
        safeSet(PIN_KEY, JSON.stringify(pinData)); updatePinButtons(); closeModal('modalPin'); toast(T('pinSet'));
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { hiddenAt = Date.now(); [mainRec, basketRec].forEach((r) => { if (r && r.listening) r.cancel(true); }); }
        else {
            if (pinData && !locked && hiddenAt && Date.now() - hiddenAt > 60000) lockApp();
            if (!locked) processRecurring();
        }
    });

    // ---------- الصوت ----------
    let audioCtx;
    function playBeep(freq, duration) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = $('micBtn'), voiceText = $('voiceText'), voiceTextContent = $('voiceTextContent'), basketMicBtn = $('basketMicBtn');
    const DEFAULT_STATUS = () => T('voiceDefault');
    const speechLang = () => (L() === 'en' ? 'en-US' : 'ar-EG');
    let statusTimer = null;
    function setStatus(msg, kind, autoReset) {
        clearTimeout(statusTimer);
        voiceTextContent.textContent = msg; voiceTextContent.dataset.rec = '';
        voiceText.classList.remove('recording', 'error', 'warn');
        if (kind) voiceText.classList.add(kind);
        if (autoReset) statusTimer = setTimeout(() => { voiceTextContent.textContent = DEFAULT_STATUS(); voiceText.classList.remove('error', 'warn'); }, 4500);
    }
    // نص الكلام من كل نتائج الجلسة (مع إزالة التكرار اللي بيحصل في بعض متصفحات الموبايل)
    const IS_ANDROID = /Android/i.test(navigator.userAgent || '');
    function textOfResults(results) {
        const parts = [];
        for (let i = 0; i < results.length; i++) {
            const t = ((results[i] && results[i][0] && results[i][0].transcript) || '').trim(); if (!t) continue;
            const prev = parts[parts.length - 1];
            // أندرويد بس: كل نتيجة بتيجي متراكمة (تحتوي اللي قبلها) فنستبدل بدل ما نكرر. في باقي الأجهزة كل نتيجة جملة مستقلة (ممكن تتكرر فعلاً)
            if (IS_ANDROID && prev && t.length > prev.length && t.startsWith(prev)) parts[parts.length - 1] = t;
            else parts.push(t);
        }
        return parts.join(' ');
    }
    // تسجيل متواصل: المايك بيفضل شغال لحد ما المستخدم يضغط إيقاف (وبيتعاد تشغيله لو المتصفح قفله لوحده)
    const MAX_LISTEN_MS = 180000;
    function makeRecognizer(onText, ui) {
        if (!SR) return null;
        const r = new SR();
        r.lang = speechLang(); r.continuous = true; r.interimResults = true; r.listening = false;
        let committed = '', current = '', running = false, done = true, wantOn = false, startedAt = 0, quick = 0, restarts = 0, finishTimer = null, maxTimer = null;
        const full = () => (committed + ' ' + current).replace(/\s+/g, ' ').trim();
        const clearTimers = () => { clearTimeout(finishTimer); clearTimeout(maxTimer); };
        function finalize() {
            if (done) return; done = true; wantOn = false; clearTimers();
            const text = full(); ui.stop(r);
            if (running) { try { r.abort(); } catch (e) {} } // لو المتصفح ما قفلش الجلسة (ما جاش onend) نجبره عشان المرة الجاية تشتغل
            if (text) onText(text); else ui.error(T('micNoSpeech'));
        }
        r.begin = () => {
            if (!done) return; // فيه جلسة شغالة أو بتبدأ (مثلاً ضغطتين سريعتين أو إذن الميكروفون ظاهر)
            done = false; wantOn = true; committed = ''; current = ''; restarts = 0; quick = 0;
            clearTimers(); maxTimer = setTimeout(() => r.finish(), MAX_LISTEN_MS);
            try { r.start(); } catch (e) { // فشل التشغيل: نرجّع الحالة نضيفة بدل ما تفضل معلّقة
                console.log(e); done = true; wantOn = false; clearTimers(); r.listening = false; ui.error(T('micError', (e && e.message) || 'start'));
            }
        };
        r.finish = () => { // المستخدم ضغط إيقاف
            if (done) return; wantOn = false; clearTimeout(maxTimer);
            if (running) { try { r.stop(); } catch (e) { finalize(); return; } clearTimeout(finishTimer); finishTimer = setTimeout(finalize, 2500); } else finalize();
        };
        // إلغاء من غير حفظ (تبديل مايك/لغة أو خروج من التطبيق). keep=true: الكلام اللي اتسمع يتحط في خانة الكتابة عشان ما يضيعش
        r.cancel = (keep) => {
            if (done) return; done = true; wantOn = false; clearTimers();
            const text = full(); try { r.abort(); } catch (e) {} ui.stop(r);
            if (keep && text && ui.salvage) ui.salvage(text);
        };
        r.onstart = () => { running = true; startedAt = Date.now(); if (!r.listening) { r.listening = true; playBeep(900, 0.15); ui.start(); } };
        r.onresult = (e) => { current = textOfResults(e.results); if (ui.live) ui.live(full()); };
        r.onerror = (e) => {
            if (e.error === 'no-speech' || e.error === 'aborted') return; // onend هيعيد التشغيل أو ينهي
            if (done) return; done = true; wantOn = false; clearTimers();
            const text = full(); ui.stop(r);
            if (text && ui.salvage) ui.salvage(text); // خطأ في النص ده؟ ما نضيّعش اللي اتقال
            const msgs = { 'not-allowed': T('micDenied'), 'service-not-allowed': T('micDenied'), 'network': T('micNetwork'), 'audio-capture': T('micNone') };
            ui.error((msgs[e.error] || T('micError', e.error)) + (text && ui.salvage ? ' ' + T('micSalvaged') : ''));
        };
        r.onend = () => {
            running = false;
            if (done) return;
            if (wantOn) { // المتصفح قفل لوحده والمستخدم لسه بيتكلم: كمّل
                quick = (Date.now() - startedAt < 500) ? quick + 1 : 0;
                if (quick >= 3 || restarts >= 40) return finalize();
                committed = full(); current = ''; restarts++;
                setTimeout(() => { if (wantOn && !done) { try { r.start(); } catch (e) { finalize(); } } }, 120);
                return;
            }
            finalize();
        };
        return r;
    }
    const mainRec = makeRecognizer((t) => processVoiceCommand(t), {
        start() { micBtn.classList.add('listening'); micBtn.setAttribute('aria-pressed', 'true'); micBtn.textContent = '⏹️'; setStatus(T('recording'), null); voiceTextContent.dataset.rec = '1'; voiceText.classList.add('recording'); },
        stop(r) {
            const was = r.listening; r.listening = false;
            micBtn.classList.remove('listening'); micBtn.setAttribute('aria-pressed', 'false'); micBtn.textContent = '🎙️'; voiceText.classList.remove('recording');
            if (voiceTextContent.dataset.rec === '1') { voiceTextContent.textContent = DEFAULT_STATUS(); voiceTextContent.dataset.rec = ''; }
            if (was) playBeep(500, 0.15);
        },
        live(t) { if (voiceTextContent.dataset.rec === '1') voiceTextContent.textContent = t ? '🎙️ ' + t : T('recording'); },
        salvage(t) { $('textCmd').value = t; setStatus(T('micSalvaged'), 'warn', true); },
        error(msg) { setStatus(msg, 'error', true); }
    });
    const basketRec = makeRecognizer((t) => addBasketItem(t), {
        start() { basketMicBtn.classList.add('listening'); basketMicBtn.textContent = '⏹️'; },
        stop(r) { const was = r.listening; r.listening = false; basketMicBtn.classList.remove('listening'); basketMicBtn.textContent = '🎙️'; if (was) playBeep(500, 0.15); },
        salvage(t) { $('basketInput').value = t.slice(0, 200); },
        error(msg) { alert(msg); }
    });
    if (!mainRec) { micBtn.style.opacity = '0.5'; setStatus(T('noSpeechSupport'), 'warn'); }
    function toggleRec(rec, other) {
        if (!rec) return alert(T('noSpeechAlert'));
        if (rec.listening) { rec.finish(); return; }
        if (other && other.listening) { other.cancel(); setTimeout(() => rec.begin(), 250); return; } // نسيب المايك التاني يقفل الأول
        rec.begin();
    }
    micBtn.addEventListener('click', () => toggleRec(mainRec, basketRec));
    basketMicBtn.addEventListener('click', () => toggleRec(basketRec, mainRec));

    // ---------- تنفيذ الأوامر الصوتية/المكتوبة ----------
    const INCOME_WORDS = ['دخل', 'مرتب', 'راتب', 'قبضت', 'قبض', 'استلمت', 'جالي', 'اخدت', 'أخدت',
        'income', 'salary', 'received', 'earned', 'deposit', 'bonus', 'paycheck', 'wage', 'wages'];
    const SALARY_WORDS = ['مرتب', 'راتب', 'salary', 'paycheck', 'wage', 'wages'];
    const EXPENSE_WORDS = ['صرفت', 'دفعت', 'شريت', 'مصروف', 'اشتريت', 'أشتريت', 'جبت',
        'spent', 'paid', 'bought', 'purchased', 'expense', 'buy', 'pay'];
    const lw = (w) => w.toLowerCase().replace(/[.,!?؟،]/g, '').replace(/[\u064B-\u0652\u0640]/g, '');

    // التراجع عن آخر أمر صوتي/مكتوب
    function undoTxs(list) {
        let n = 0;
        list.slice().reverse().forEach((t) => {
            const i = state.transactions.findIndex((x) => x.id === t.id);
            if (i > -1) {
                applyTx(state.transactions[i], -1);
                if (t.goalId) { const g = state.goals.find((x) => x.id === t.goalId); if (g) g.saved = Math.max(0, round2(g.saved - t.amount)); }
                state.transactions.splice(i, 1); n++;
            }
        });
        if (n) { saveData(); setStatus(T('undone'), null, true); }
    }

    // ---- مفردات الأوامر الذكية ----
    const BANK_ACC = new Set(['بنك', 'بنكي', 'فيزا', 'bank', 'visa']);
    const CASH_ACC = new Set(['كاش', 'نقدي', 'نقدا', 'cash']);
    const TO_W = new Set(['to', 'into', 'الى', 'إلى', 'الي']);
    const FROM_W = new Set(['from', 'من', 'عن']);
    const BY_W = new Set(['by', 'with', 'using', 'via', 'in', 'at', 'في']);
    const TRANSFER_W = new Set(['حول', 'حولت', 'حولي', 'تحويل', 'انقل', 'نقلت', 'transfer', 'transferred', 'move', 'moved']);
    const SAVE_W = new Set(['ادخرت', 'ادخر', 'وفرت', 'وفر', 'save', 'saved', 'saving']);
    const STOP_W = ['on', 'for', 'at', 'على', 'في'];
    // كلمة حساب (بنك/كاش) مع حرف الجر الملتصق: للبنك / بالكاش / البنك
    function accToken(w) {
        const t = lw(w);
        const tries = [[t, ''], [t.replace(/^ال/, ''), ''], [t.replace(/^لل/, ''), 'to'], [t.replace(/^بال/, ''), 'by'], [t.replace(/^ب/, ''), 'by'], [t.replace(/^ل/, ''), 'to']];
        for (const [k, prep] of tries) {
            if (BANK_ACC.has(k)) return { acc: 'bank', prep };
            if (CASH_ACC.has(k)) return { acc: 'cash', prep };
        }
        return null;
    }
    const accLabel = (a) => (a === 'cash' ? T('cash') : T('bank'));
    const dayLabel = (ts) => new Date(ts).toLocaleDateString(LOC(), { weekday: 'short', day: 'numeric', month: 'short' });

    // 1) تحليل الأمر بدون أي حفظ (بيحاكي الأرصدة عشان التحقق يكون صحيح داخل الأمر الواحد)
    function parseCommand(text) {
        const defAcc = $('accountSelect').value;
        const dt = extractDate(wordsToNumbersEn(wordsToNumbers(convertDigits(String(text || '')))));
        const ts = dt.days > 0 ? daysAgoTs(dt.days) : undefined;
        const segs = parseSegments(dt.text);
        const bal = { cash: state.balances.cash, bank: state.balances.bank };
        const items = []; let rejected = 0, rejAcc = defAcc;
        const info = segs.map((s) => {
            const words = s.desc.split(/\s+/).filter(Boolean), extra = s.extra ? s.extra.split(/\s+/).filter(Boolean) : [];
            const all = words.concat(extra), refs = [], drop = new Set();
            all.forEach((w, i) => {
                const a = accToken(w); if (!a) return;
                const prev = i > 0 ? lw(all[i - 1]) : '';
                const prevPrep = TO_W.has(prev) ? 'to' : FROM_W.has(prev) ? 'from' : BY_W.has(prev) ? 'by' : '';
                const role = a.prep || prevPrep;
                if (!role && i !== all.length - 1) return; // كلمة "bank" لوحدها في نص الوصف مش اختيار حساب
                refs.push({ acc: a.acc, role: role || 'by', i });
                drop.add(i); if (prevPrep) drop.add(i - 1);
            });
            return { words, extra, all, refs, drop };
        });
        // "قهوة 50 من البنك وعصير 20": الكلام بعد الرقم مباشرة (حساب/حرف جر/و) بيخص العملية اللي قبله
        if (!/^\s*\d/.test(dt.text)) {
            for (let k = 1; k < info.length; k++) {
                const cur = info[k], prevInfo = info[k - 1];
                for (let i = 0; i < cur.all.length; i++) {
                    const w = lw(cur.all[i]), a = accToken(cur.all[i]);
                    if (a) {
                        const prevW = i > 0 ? lw(cur.all[i - 1]) : '';
                        const role = a.prep || (TO_W.has(prevW) ? 'to' : FROM_W.has(prevW) ? 'from' : 'by');
                        prevInfo.refs.push({ acc: a.acc, role });
                        cur.drop.add(i); if (i > 0 && (TO_W.has(prevW) || FROM_W.has(prevW) || BY_W.has(prevW))) cur.drop.add(i - 1);
                        const ti = i; cur.refs = cur.refs.filter((r) => r.i !== ti);
                    } else if (!(TO_W.has(w) || FROM_W.has(w) || BY_W.has(w) || w === 'و' || w === 'and' || w === 'ثم' || w === 'then')) break;
                }
            }
        }
        const totalRefs = info.reduce((n, x) => n + x.refs.length, 0);
        const globalAcc = totalRefs === 1 ? info.find((x) => x.refs.length).refs[0].acc : null; // حساب مذكور مرة واحدة = لكل العمليات
        const lead = (t, k) => { let r = t.replace(/^(?:و|and)\s+/i, ''); if (k > 0) r = r.replace(/^و(?=\S)/, ''); return r.trim(); };

        segs.forEach((s, idx) => {
            if (!(s.amount > 0)) return;
            const amount = amt(s.amount); if (!(amount > 0)) return;
            const { words, extra, all, refs, drop } = info[idx];
            const keepAll = all.filter((_, i) => !drop.has(i));

            // --- تحويل بين الحسابات: "حوّل 500 للبنك" / "transfer 200 from bank to cash" ---
            if (refs.length && all.some((w) => TRANSFER_W.has(lw(w)))) {
                let to = (refs.find((r) => r.role === 'to') || {}).acc, from = (refs.find((r) => r.role === 'from') || {}).acc;
                if (!to && !from) to = refs[0].acc;
                if (!to) to = from === 'cash' ? 'bank' : 'cash';
                if (!from || from === to) from = to === 'cash' ? 'bank' : 'cash';
                if (bal[from] < amount) { rejected++; rejAcc = from; return; }
                bal[from] = round2(bal[from] - amount); bal[to] = round2(bal[to] + amount);
                items.push({ type: 'transfer', amount, from, to, ts, category: 'تحويل 🔄', description: T('transferTo', accLabel(to)), shown: accLabel(from) + ' → ' + accLabel(to) });
                return;
            }

            const own = refs.find((r) => r.role !== 'to') || refs[0];
            const account = own ? own.acc : (globalAcc || defAcc), accName = accLabel(account);

            // --- دخل ---
            if (keepAll.some((w) => INCOME_WORDS.includes(lw(w)))) {
                const clean = lead(keepAll.filter((w) => lw(w) !== 'دخل' && lw(w) !== 'income').join(' '), idx) || T('voiceIncomeDesc');
                const category = findCustomCat(state.customCats.income, clean) || (keepAll.some((w) => SALARY_WORDS.includes(lw(w))) ? INCOME_CATS[0] : INCOME_CATS[2]);
                bal[account] = round2(bal[account] + amount);
                items.push({ type: 'income', amount, account, ts, category, description: clean + ' (' + accName + ')', shown: clean });
                return;
            }

            // --- ادخار لهدف: "ادخرت 200 للهدف سفر" / "save 200 to vacation" ---
            if (state.goals.length && keepAll.some((w) => SAVE_W.has(lw(w)))) {
                const joined = keepAll.join(' ').toLowerCase();
                const g = state.goals.find((x) => { const k = catKey(x.name); return k && joined.includes(k); }) || (state.goals.length === 1 ? state.goals[0] : null);
                if (g) {
                    if (bal[account] < amount) { rejected++; rejAcc = account; return; }
                    bal[account] = round2(bal[account] - amount);
                    items.push({ type: 'expense', amount, account, ts, category: SAVING_CAT, goalId: g.id, description: T('savingDesc', g.name), shown: T('savingDesc', g.name) });
                    return;
                }
            }

            // --- مصروف ---
            let base = words.filter((w, i) => !drop.has(i) && !EXPENSE_WORDS.includes(lw(w)));
            if (!base.length && extra.length) base = extra.filter((w, j) => !drop.has(words.length + j) && w && !STOP_W.includes(lw(w))); // "spent 30 on pizza"
            const clean = lead(base.join(' '), idx) || T('descExpense');
            if (bal[account] < amount) { rejected++; rejAcc = account; return; }
            bal[account] = round2(bal[account] - amount);
            items.push({ type: 'expense', amount, account, ts, category: getCategory(clean), description: clean + ' (' + accName + ')', shown: clean });
        });
        return { items, rejected, accName: accLabel(rejAcc) };
    }

    // 2) الحفظ الفعلي بعد الموافقة
    let lastCommitted = [];
    function commitCommand(r) {
        const addedTx = [], touched = {}; let goalMsg = '';
        r.items.forEach((it) => {
            if (it.type !== 'income') { const src = it.type === 'transfer' ? it.from : it.account; if (state.balances[src] < it.amount) { r.rejected++; return; } } // أمان: الرصيد اتغيّر وقت المراجعة
            const base = { type: it.type, amount: it.amount, description: it.description, category: it.category };
            if (it.ts) base.ts = it.ts;
            if (it.type === 'transfer') { base.from = it.from; base.to = it.to; } else base.account = it.account;
            if (it.goalId) base.goalId = it.goalId;
            const t = addTransaction(base);
            applyTx(t, 1); addedTx.push(t);
            if (it.type === 'expense') (touched[monthKey(t.ts)] = touched[monthKey(t.ts)] || []).push(it.category);
            if (it.goalId) { const g = state.goals.find((x) => x.id === it.goalId); if (g) { const was = g.saved; g.saved = round2(g.saved + it.amount); if (was < g.target && g.saved >= g.target) goalMsg = T('goalReached', g.name); } }
        });
        if (!addedTx.length) return setStatus(T('voiceInsufficient', r.accName), 'error', true);
        saveData();
        lastCommitted = addedTx;
        let msg = T('voiceDone', addedTx.length), kind = null;
        if (r.rejected > 0) { msg += T('voiceRejected', r.rejected); kind = 'warn'; }
        const bws = Object.keys(touched).map((k) => budgetWarning(touched[k], k)).filter(Boolean);
        if (bws.length) { msg += ' ⚠️ ' + bws.join(' · '); kind = 'warn'; }
        if (goalMsg) msg += ' ' + goalMsg;
        setStatus(msg, kind, true);
        toast(T('voiceDone', addedTx.length), () => undoTxs(addedTx));
    }

    // 3) شاشة المراجعة: تمام = حفظ، تراجع = إلغاء
    const confirmBefore = () => safeGet('walletConfirm') === '1'; // اختياري: مطفي افتراضياً عشان التسجيل السريع
    let pendingReview = null;
    function openReview(r) {
        pendingReview = r;
        const list = $('reviewList'); list.innerHTML = '';
        r.items.forEach((it) => {
            const isT = it.type === 'transfer', isI = it.type === 'income';
            const meta = isT ? catLabel(it.category) : catLabel(it.category) + ' · ' + accLabel(it.account);
            list.appendChild(el('div', { class: 'review-row' }, [
                el('span', { class: 'r-ic', text: isT ? '🔄' : isI ? '➕' : '➖' }),
                el('div', { class: 'r-main' }, [
                    el('div', { class: 'r-desc', text: it.shown }),
                    el('div', { class: 'r-meta', text: meta + (it.ts ? ' · 📅 ' + dayLabel(it.ts) : '') })
                ]),
                el('span', { class: 'r-amt ' + (isT ? 'tr' : isI ? 'inc' : 'exp'), text: (isT ? '' : isI ? '+ ' : '- ') + fmt(it.amount) })
            ]));
        });
        $('reviewWarn').textContent = r.rejected > 0 ? T('reviewRejected', r.rejected) : '';
        setStatus(T('reviewPrompt'), null, true);
        openModal('modalReview');
    }
    $('reviewOkBtn').addEventListener('click', () => { const r = pendingReview; pendingReview = null; closeModal('modalReview'); if (r) commitCommand(r); });
    $('reviewUndoBtn').addEventListener('click', () => { pendingReview = null; closeModal('modalReview'); setStatus(T('cancelled'), null, true); });
    $('confirmToggle').checked = confirmBefore();
    $('confirmToggle').addEventListener('change', (e) => safeSet('walletConfirm', e.target.checked ? '1' : '0'));

    // أسئلة سريعة بالصوت: "كام رصيدي؟" / "how much did I spend today?" (من غير ما يسجل حاجة)
    function answerQuery(text) {
        const t = String(text).toLowerCase();
        const asks = /كام|كم|ايه|إيه|ما هو|what|how much|show|tell/.test(t);
        if (/رصيد|balance|how much money/.test(t) && (asks || /رصيدي|balance/.test(t)))
            return '💵 ' + T('cash') + ': ' + fmt(state.balances.cash) + ' · 🏦 ' + T('bank') + ': ' + fmt(state.balances.bank) + ' ' + T('cur');
        if (asks && /صرفت|مصاريف|مصروفات|مصروف|spent|spend|expenses/.test(t)) {
            const today = /النهارد|اليوم|today/.test(t), now = new Date(), key = monthKey(Date.now());
            const sum = state.transactions.filter((x) => x.type === 'expense' && x.ts && (today ? new Date(x.ts).toDateString() === now.toDateString() : monthKey(x.ts) === key))
                .reduce((n, x) => n + x.amount, 0);
            return T(today ? 'qSpentToday' : 'qSpentMonth', fmt(round2(sum)) + ' ' + T('cur'));
        }
        return '';
    }
    const UNDO_RE = /^\s*(?:تراجع|الغاء|إلغاء|الغي|ألغي|undo|undo that|cancel|cancel that)\s*[.!؟]?\s*$/i;

    function processVoiceCommand(text) {
        if (UNDO_RE.test(text)) { // "تراجع" / "undo" بالصوت بعد التسجيل
            if (lastCommitted.length) { const l = lastCommitted; lastCommitted = []; undoTxs(l); } else setStatus(T('nothingToUndo'), 'warn', true);
            return;
        }
        const r = parseCommand(text);
        if (!r.items.length) {
            if (r.rejected > 0) return setStatus(T('voiceInsufficient', r.accName), 'error', true);
            const q = answerQuery(text); if (q) return toast(q);
            return setStatus(T('voiceNoAmount'), 'error', true);
        }
        if (confirmBefore()) openReview(r); else commitCommand(r);
    }
    function submitTextCmd() { const v = $('textCmd').value.trim(); if (!v) return; processVoiceCommand(v); $('textCmd').value = ''; }
    $('textCmdBtn').addEventListener('click', submitTextCmd);
    $('textCmd').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitTextCmd(); });

    // ---------- التصنيفات المخصصة ----------
    function renderCatList() {
        const type = $('catType').value === 'income' ? 'income' : 'expense';
        const list = $('catList'); list.innerHTML = '';
        const items = state.customCats[type];
        if (!items.length) { list.appendChild(el('div', { class: 'cat-empty', text: T('noCustomCats') })); return; }
        items.forEach((c) => list.appendChild(el('div', { class: 'cat-row' }, [
            el('span', { text: c }),
            el('button', { type: 'button', 'aria-label': T('del'), text: '×', on: { click: () => {
                if (!confirm(T('delCatConfirm', c))) return;
                state.customCats[type] = state.customCats[type].filter((x) => x !== c);
                if (type === 'expense') delete state.budgets[c];
                saveData(); renderCatList();
            } } })
        ])));
    }
    function addCustomCat() {
        const type = $('catType').value === 'income' ? 'income' : 'expense';
        const v = cleanCatName($('catName').value);
        if (!v || (v in Object.prototype)) return alert(T('catInvalid'));
        const all = type === 'expense' ? expCats() : incCats();
        const vk = catKey(v);
        if (all.some((c) => c.toLowerCase() === v.toLowerCase() || catLabel(c).toLowerCase() === v.toLowerCase() || (vk && (catKey(c) === vk || catKey(catLabel(c)) === vk)))) return alert(T('catExists'));
        if (state.customCats[type].length >= MAX_CUSTOM_CATS) return alert(T('catLimit'));
        state.customCats[type].push(v);
        saveData(); $('catName').value = ''; renderCatList(); toast(T('catAdded'));
    }
    $('catsBtn').addEventListener('click', () => { $('catType').value = 'expense'; $('catName').value = ''; renderCatList(); openModal('modalCats'); });
    $('catType').addEventListener('change', renderCatList);
    $('catAddBtn').addEventListener('click', addCustomCat);
    $('catName').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomCat(); } });

    // ---------- الترحيب والخصوصية ----------
    const ONBOARD_KEY = 'walletOnboarded';
    $('guideBtn').addEventListener('click', () => openModal('modalWelcome'));
    $('privBtn').addEventListener('click', () => openModal('modalPrivacy'));
    $('welcomePrivBtn').addEventListener('click', () => { closeModal('modalWelcome'); openModal('modalPrivacy'); });

    // ---------- تبديل اللغة ----------
    function refreshLang() {
        const known = [I18N.dict.ar.voiceDefault, I18N.dict.en.voiceDefault, I18N.dict.ar.noSpeechSupport, I18N.dict.en.noSpeechSupport, ''];
        if (known.includes(voiceTextContent.textContent.trim())) {
            if (!mainRec) setStatus(T('noSpeechSupport'), 'warn');
            else { clearTimeout(statusTimer); voiceTextContent.textContent = DEFAULT_STATUS(); voiceText.classList.remove('error', 'warn'); }
        }
        [mainRec, basketRec].forEach((r) => { if (r) { if (r.listening) r.cancel(true); r.lang = speechLang(); } });
        updatePinButtons(); renderPersistNote(); updateToAccount();
        if (!locked) updateUI();
    }
    $('langBtn').addEventListener('click', () => I18N.setLang(L() === 'ar' ? 'en' : 'ar'));
    I18N.onChange(refreshLang);

    // ---------- التشغيل ----------
    updatePinButtons();
    loadData();
    refreshLang();
    processRecurring();
    requestPersistence();
    if (pinData) lockApp();
    else if (safeGet(ONBOARD_KEY) !== '1') { safeSet(ONBOARD_KEY, '1'); openModal('modalWelcome'); }
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        navigator.serviceWorker.register('sw.js').catch((err) => console.log('SW Error', err));
    }
})();
