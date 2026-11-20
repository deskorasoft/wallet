# محفظتي الذكية — Deskora
### My Smart Wallet — by Deskora

<div dir="rtl">

## نبذة عن التطبيق

**محفظتي الذكية** تطبيق ويب (PWA) من تطوير **Deskora**، صُمّم ليكون سهل الاستخدام إلى أقصى درجة، ويعمل **بالصوت بالكامل ودون الحاجة إلى استخدام اليدين (Hands-Free)**. يكفي أن تضغط على زر الميكروفون وتقول مثلًا: «قهوة 50 وعصير 20» أو «دخل 1000 مرتب»، وسيتولى التطبيق تسجيل العمليات وتصنيفها وتحديث أرصدتك تلقائيًا.

> **هذه نسخة مبسّطة من التطبيق.**
> للحصول على **النسخة الاحترافية (Professional)** يُرجى التواصل معنا عبر البريد الإلكتروني:
> **[deskora.software@gmail.com](mailto:deskora.software@gmail.com)**

## المميزات

- 🎙️ **تسجيل بالصوت وبدون استخدام اليدين**: يدعم العربية (اللهجة المصرية والفصحى) والإنجليزية، ويفهم الأرقام المنطوقة مثل «خمسين» و«ألف وخمسمائة» و«two hundred and fifty».
- 🌐 **واجهة ثنائية اللغة (عربي / English)** مع زر للتبديل بين اللغتين بنقرة واحدة.
- 💵 **حسابان منفصلان**: الكاش والبنك، مع إمكانية التحويل بينهما.
- 🧾 **تصنيف تلقائي** للمصروفات (طعام، مواصلات، فواتير، ملابس، صحة…) وتحليل بياني للمصروفات والدخل.
- 📊 **ميزانية شهرية** لكل تصنيف مع تنبيه عند الاقتراب من الحد أو تجاوزه.
- 🎯 **أهداف الادخار** وتتبّع التقدّم نحوها.
- 🔁 **عمليات متكررة** شهريًا (إيجار، اشتراكات، مرتب…).
- 🛒 **سلة مشتريات** تُضاف إليها العناصر بالصوت، وتُسجَّل كمصروف عند الشراء.
- 🔐 **الخصوصية والأمان**: جميع البيانات تُحفظ على جهازك فقط، مع رمز قفل، ونسخ احتياطي اختياري مشفّر بكلمة سر.
- 📤 **تصدير CSV** ونسخ احتياطي واسترجاع بسهولة.
- 📱 **يعمل كتطبيق على الهاتف** (PWA) وبدون إنترنت بعد التثبيت، مع وضع ليلي.

## التواصل

للاستفسار عن **النسخة الاحترافية** أو لطلب مزايا إضافية، يُرجى مراسلتنا على البريد الإلكتروني:
**deskora.software@gmail.com**

</div>

---

## About

**My Smart Wallet** is a progressive web app (PWA) by **Deskora**, built to be as easy to use as possible and to work **entirely by voice, hands-free**. Just tap the mic and say something like *"coffee 50 and juice 20"* or *"income 1000 salary"* — the app records the transactions, categorizes them and updates your balances automatically.

> **This is a simplified edition of the app.**
> If you would like the **Professional version**, please contact us by email:
> **[deskora.software@gmail.com](mailto:deskora.software@gmail.com)**

## Features

- 🎙️ **Hands-free voice entry** in Arabic (Egyptian dialect & Modern Standard) and English, including spoken numbers such as "fifty" or "two hundred and fifty".
- 🌐 **Bilingual interface (Arabic / English)** with a one-tap language switch.
- 💵 **Two separate accounts** (Cash and Bank) with transfers between them.
- 🧾 **Automatic categorization** and charts for expenses and income.
- 📊 **Monthly budgets** per category with warnings when you get close to or exceed the limit.
- 🎯 **Savings goals** with progress tracking.
- 🔁 **Monthly recurring transactions** (rent, subscriptions, salary…).
- 🛒 **Shopping list** by voice, convertible into an expense once purchased.
- 🔐 **Privacy & security**: all data stays on your device, with an optional lock code and password-encrypted backups.
- 📤 **CSV export**, backup and restore.
- 📱 **Installable on your phone** and works offline once installed, with a dark mode.

---

## ملاحظات للمطوّر / Developer notes

- **لا ترفع** أي نسخة احتياطية (`wallet_backup*.json`) أو ملف CSV على المستودع ده.
  *Never commit any backup (`wallet_backup*.json`) or CSV file to this repository.*
- عند أي تعديل: غيّر رقم `CACHE_NAME` في `sw.js` ثم `git add . && git commit -m "update" && git push`.
  *After any change, bump `CACHE_NAME` in `sw.js`, then `git add . && git commit -m "update" && git push`.*
- الملفات: `index.html` (الواجهة)، `app.js` (المنطق)، `i18n.js` (قاموس الترجمة عربي/English)، `sw.js` (العمل بدون إنترنت)، `manifest.json`.
  *Files: `index.html` (UI), `app.js` (logic), `i18n.js` (Arabic/English dictionary), `sw.js` (offline), `manifest.json`.*
- لإضافة أو تعديل نص في الواجهة: عدّل المفتاح في `i18n.js` (قسم `ar` وقسم `en`). التصنيفات بتتخزن بالعربي داخليًا عشان النسخ الاحتياطية القديمة تفضل شغالة.
  *To add or edit UI text, edit the key in `i18n.js` (both `ar` and `en`). Categories are stored in Arabic internally so older backups keep working.*

© Deskora — deskora.software@gmail.com
