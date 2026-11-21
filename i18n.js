/* محفظتي الذكية — Deskora | My Smart Wallet — Deskora
 * طبقة الترجمة (عربي / English). تُحمَّل قبل app.js
 * Translation layer (Arabic / English). Loaded before app.js */
(function () {
    'use strict';

    const DICT = {
        ar: {
            appName: 'محفظتي الذكية', pageTitle: 'محفظتي الذكية — Deskora',
            accountsBtn: '⚙️ إدارة الحسابات', accountsTitle: 'الحسابات', accountDefault: 'حساب',
            accNamePh: 'اسم الحساب الجديد (مثال: فودافون كاش)', accOpeningPh: 'الرصيد الافتتاحي (اختياري)', accAddBtn: 'إضافة حساب', accNameAria: 'اسم الحساب',
            accHint: 'اضغط على اسم أي حساب لتغييره. تقدر تحذف أو تعيد تسمية أي حساب (حتى كاش وبنك)، بس لازم يفضل حساب واحد على الأقل. الأوامر الصوتية بتتعرف على الحساب باسمه.',
            accAdded: 'تمت إضافة الحساب ✅', accRenamed: 'تم تغيير الاسم ✅', accDeleted: 'تم حذف الحساب',
            accInvalidName: 'اكتب اسم حساب صحيح.', accExists: 'فيه حساب بنفس الاسم.', accWarn: 'تنبيه: كلمة «{0}» في اسم الحساب {1}، وده ممكن يلخبط الأوامر الصوتية (التحويل وتحديد الحساب).\n\nيُفضّل تغيير الاسم لاسم مميّز (مثال: «محفظة فودافون»).\n\nاضغط «موافق» لو عاوز تكمل بنفس الاسم، أو «إلغاء» عشان تغيّره.', accWhyAcc: 'موجودة كمان في اسم الحساب «{0}»', accWhyAlias: 'مرادف للحساب «{0}» (زي كاش/بنك)', accWhyCmd: 'كلمة بتستخدمها الأوامر الصوتية', accWhyCat: 'اسم تصنيف أو كلمة بتدل على تصنيف', accWhyGoal: 'جزء من اسم هدف ادخار', accLimit: 'وصلت للحد الأقصى (10 حسابات).', accLast: 'لازم يفضل حساب واحد على الأقل.',
            delAccConfirm: 'حذف الحساب «{0}»؟',
            delAccConfirmTx: 'حذف الحساب «{0}»؟ هتتحذف معاه {1} عملية مسجلة عليه (بما فيها التحويلات المرتبطة بيه) وعملياته المتكررة، وأرصدة الحسابات التانية هتتعدّل لو فيه تحويلات. مفيش تراجع، فيُفضّل تنزّل نسخة احتياطية الأول.',
            openingBal: 'رصيد افتتاحي', goalAccFrom: 'اخصم من {0}', needTwoAcc: 'محتاج حسابين على الأقل للتحويل. أضف حساب من «إدارة الحسابات».',
            langBtn: 'EN', langBtnAria: 'Switch to English',
            lockCodeAria: 'رمز القفل', unlock: 'فتح', forgot: 'نسيت الرمز؟',
            themeAria: 'تبديل الوضع الليلي',
            backupDue: 'مر أكثر من أسبوع على آخر نسخة احتياطية. نزّل نسخة جديدة دلوقتي.', backupNow: 'نزّل نسخة الآن',
            warnData: 'تنبيه هام: يتم حفظ البيانات تلقائياً على هذا الجهاز. <b>يرجى عدم مسح بيانات المتصفح (Cookies & Site Data)</b> لتجنب فقدان البيانات. يُنصح بتنزيل نسخة احتياطية بشكل دوري.',
            cash: 'كاش', bank: 'بنك', expense: 'مصروف', income: 'دخل', transfer: 'تحويل',
            voiceTitle: 'سجّل بصوتك', account: 'الحساب', micAria: 'تسجيل صوتي',
            voiceDefault: 'اضغط على المايك وابدأ التحدث..',
            textCmdPh: 'أو اكتب هنا: قهوة 50 وعصير 20', textCmdAria: 'كتابة عملية', record: 'تسجيل',
            voiceExample: '(أمثلة: قهوة 50 وعصير 20 · دخل 1000 مرتب · أمس تاكسي 80 · حوّل 500 للبنك · كام رصيدي؟)',
            periodSummary: 'الفترة والملخص', period: 'الفترة', allPeriods: 'كل الفترات',
            sumIncome: 'دخل:', sumExpense: 'مصروف:',
            analysis: 'التحليل', analysisType: 'نوع التحليل', chartExp: 'تحليل المصاريف', chartInc: 'تحليل الدخل',
            noExpensesChart: 'لا توجد مصاريف لتحليلها بعد', noIncomeChart: 'لا يوجد دخل لتحليله بعد', chartTotal: 'الإجمالي',
            category: 'التصنيف', budgetLimitPh: 'الحد (ج.م)', save: 'حفظ',
            budgetOf: 'ميزانية {0}', noBudget: 'لم تحدد ميزانية بعد (الحد بيتطبق على كل شهر)', delBudget: 'حذف الميزانية',
            invalidLimit: 'يرجى إدخال حد صحيح!', overBudget: 'تخطيت ميزانية {0}', nearBudget: 'قربت توصل لحد {0}',
            goalsTitle: 'أهداف الادخار', goalNamePh: 'اسم الهدف', goalTargetPh: 'المبلغ المستهدف', add: 'إضافة',
            goalDefault: 'هدف', noGoals: 'لا توجد أهداف بعد', addAmount: 'إضافة مبلغ', delGoal: 'حذف الهدف',
            addToGoalName: 'إضافة إلى: {0}',
            delGoalConfirm: 'حذف الهدف؟ (العمليات المسجلة هتفضل في السجل)', goalNeedBoth: 'اكتب اسم الهدف والمبلغ المستهدف.',
            savingDesc: 'ادخار: {0}', goalReached: '🎉 مبروك! حققت هدف «{0}»',
            goalAccNone: 'بدون خصم من أي حساب', recurringTitle: 'عمليات متكررة', recAdd: 'إضافة عملية متكررة', noRec: 'لا توجد عمليات متكررة',
            recLine: 'يوم {0} من كل شهر — {1} — {2}', delRecConfirm: 'حذف العملية المتكررة؟', recNeedBoth: 'اكتب الوصف والمبلغ.',
            recProcessed: 'تم تسجيل {0} عملية متكررة', negSuffix: ' — ⚠️ رصيد بالسالب',
            recModalTitle: 'عملية متكررة شهرياً', recTypeExp: '➖ مصروف (إيجار، اشتراك...)', recTypeInc: '➕ دخل (مرتب...)',
            recDescPh: 'الوصف (مثال: إيجار)', recDayLabel: 'يوم الشهر (من 1 إلى 28) — يبدأ من أقرب موعد قادم', type: 'النوع',
            basketTitle: 'سلة المشتريات', basketPh: 'أدخل العنصر هنا...', basketItemAria: 'عنصر السلة',
            basketMicAria: 'تسجيل صوتي للسلة', basketAdd: 'إضافة للسلة', basketEmpty: 'السلة فارغة',
            bpTitleDefault: 'سجّله كمصروف؟', bpTitleItem: 'اشتريت «{0}»؟ سجّله كمصروف', pricePh: 'السعر', skip: 'تخطي',
            bpNeedPrice: 'اكتب السعر أو اضغط تخطي.',
            historyTitle: 'سجل العمليات', searchPh: 'ابحث في السجل', searchAria: 'بحث', all: 'الكل',
            noMatches: 'لا نتائج مطابقة', noTx: 'لا توجد عمليات بعد', showMore: 'عرض {0} عملية إضافية (متبقي {1})', edit: 'تعديل', del: 'حذف',
            transferTo: 'تحويل إلى {0}',
            delNegConfirm: 'حذف هذه العملية هيخلّي رصيد أحد الحسابات بالسالب. هل تريد المتابعة؟',
            delConfirm: 'هل أنت متأكد من حذف هذه العملية؟',
            backupSection: 'النسخ والأمان', exportBtn: 'تنزيل نسخة', importBtn: 'استرجاع نسخة', csvBtn: 'تصدير CSV',
            pinBtn: 'رمز القفل', pinChange: 'تغيير رمز القفل', pinRemove: 'إزالة رمز القفل', pinSetTitle: 'تعيين رمز قفل',
            txAddExpense: 'إضافة مصروف', txAddIncome: 'إضافة دخل', amount: 'المبلغ', descOpt: 'الوصف (اختياري)',
            desc: 'الوصف', dateTime: 'التاريخ والوقت', cancel: 'إلغاء',
            descExpense: 'مصروف', descManual: 'إضافة رصيد يدوي',
            invalidAmount: 'يرجى إدخال مبلغ صحيح!', insufficient: 'الرصيد في هذا الحساب غير كافٍ!',
            transferTitle: 'تحويل بين الحسابات', transAmountPh: 'أدخل المبلغ هنا...',
            transFrom: 'التحويل من', transTo: 'التحويل إلى', transferInvalid: 'المبلغ غير كافي أو غير صحيح!',
            editTitle: 'تعديل العملية', editNeg: 'التعديل هيخلّي الرصيد بالسالب!',
            pinOldPh: 'الرمز الحالي', pinNewPh: 'الرمز الجديد (4 إلى 8 أرقام)', pinNew2Ph: 'أعد كتابة الرمز',
            tryAfter: 'حاول بعد {0} ثانية', tooMany: 'محاولات كتير. استنى {0} ثانية.', wrongPin: 'الرمز غير صحيح',
            forgotInfo: 'الرمز بيحمي الواجهة من الاستخدام العابر بس. لو نسيته: امسح بيانات الموقع من إعدادات المتصفح ثم استرجع من نسخة احتياطية.',
            pinOldWrong: 'الرمز الحالي غير صحيح', pinRemoved: 'تم إزالة رمز القفل', pinFormat: 'الرمز لازم يكون من 4 إلى 8 أرقام',
            pinMismatch: 'الرمزان غير متطابقين', pinSet: 'تم تعيين رمز القفل 🔐',
            bkTitle: 'نسخة احتياطية', bkPassPh: 'كلمة سر للتشفير (اختياري)',
            bkNote: 'اتركها فاضية لنسخة عادية. لو كتبت كلمة سر هتحتاجها وقت الاسترجاع، ومفيش طريقة لاسترجاعها لو نسيتها.',
            bkDownload: '⬇️ تنزيل', bkShare: '📤 مشاركة',
            impTitle: 'النسخة مشفّرة 🔒', impPassPh: 'كلمة السر', decrypt: 'فك التشفير',
            cryptoNeedHttps: 'التشفير يحتاج فتح التطبيق عبر HTTPS.', decryptNeedHttps: 'فك التشفير يحتاج فتح التطبيق عبر HTTPS.',
            shareTitle: 'نسخة محفظتي', backupFail: 'تعذّر إنشاء النسخة.', saveFail: 'تعذّر حفظ البيانات! المساحة ممتلئة أو التخزين غير متاح. نزّل نسخة احتياطية الآن.',
            csvDate: 'التاريخ', csvType: 'النوع', csvDesc: 'الوصف', csvCat: 'التصنيف', csvAcc: 'الحساب', csvAmount: 'المبلغ',
                        invalidFile: 'الملف غير صالح!', fileTooBig: 'الملف كبير جداً!',
            importConfirm: 'سيتم استبدال بياناتك الحالية بالنسخة المستوردة ({0} عملية). هل تريد المتابعة؟',
            restored: 'تم استرجاع البيانات بنجاح! ✅', wrongPass: 'كلمة السر غلط أو الملف تالف.',
            lastBackup: 'آخر نسخة احتياطية: {0}', noBackupYet: 'لم يتم تنزيل نسخة احتياطية بعد',
            persistOk: '🔒 التخزين محمي من المسح التلقائي',
            persistNo: 'ℹ️ المتصفح لم يؤكد حماية التخزين — يُفضل تثبيت التطبيق ونسخ احتياطي دوري',
            recording: 'جاري التسجيل... تحدث براحتك، واضغط ⏹️ لما تخلص',
            micDenied: 'تم رفض إذن الميكروفون. اسمح للمتصفح باستخدام المايك من إعدادات الموقع.',
            micNetwork: 'مشكلة في الشبكة. تأكد من اتصال الإنترنت (التعرف الصوتي يحتاج نت).',
            micNone: 'لم يتم العثور على ميكروفون.', micNoSpeech: 'لم أسمع شيئاً، حاول مرة أخرى.', micError: 'حدث خطأ في المايك: {0}',
            noSpeechSupport: 'المتصفح لا يدعم التسجيل الصوتي. اكتب العملية في الخانة تحت.', noSpeechAlert: 'المتصفح لا يدعم التسجيل الصوتي.',
            voiceIncomeDesc: 'دخل بالصوت', voiceDone: 'تم تسجيل {0} عملية! ✅', voiceRejected: ' (تعذّر {0} لعدم كفاية الرصيد)',
            voiceInsufficient: 'الرصيد في حساب {0} غير كافٍ لهذه العملية.', voiceNoAmount: 'لم يتم التعرف على المبلغ. حاول مرة أخرى.',
            cur: 'ج.م', choose: 'اختر',
            brandText: 'محفظتي الذكية من Deskora — تطبيق سهل الاستخدام يعمل بالكامل بالصوت ودون الحاجة إلى استخدام اليدين. هذه نسخة مبسّطة، وللحصول على النسخة الاحترافية يُرجى التواصل معنا عبر البريد الإلكتروني:',
            reviewTitle: 'راجع قبل الحفظ', reviewOk: 'تمام ✅', reviewUndo: 'تراجع ↩️',
            reviewHint: 'لو الفهم صح اضغط «تمام»، ولو غلط اضغط «تراجع».', reviewRejected: '{0} عملية مش هتتسجل لعدم كفاية الرصيد.',
            reviewPrompt: 'راجع العملية واضغط «تمام» أو «تراجع»', cancelled: 'تم الإلغاء، لم يُسجَّل شيء', confirmToggle: '✋ مراجعة قبل الحفظ (اختياري)',
            micSalvaged: 'التسجيل اتقطع. النص اتحط في خانة الكتابة، اضغط «تسجيل» لو صح.', nothingToUndo: 'مفيش حاجة للتراجع عنها', qSpentToday: 'مصروفات النهاردة: {0}', qSpentMonth: 'مصروفات الشهر: {0}',
            undoBtn: 'تراجع', undone: 'تم التراجع عن العمليات ↩️', updAvail: 'فيه نسخة جديدة من التطبيق 🎉', updNow: 'تحديث الآن', updLater: 'لاحقًا', close: 'إغلاق',
            catsBtn: 'التصنيفات', catsTitle: 'إدارة التصنيفات', catNamePh: 'اسم التصنيف (مثال: 🏋️ جيم)',
            catInvalid: 'اكتب اسم تصنيف صحيح.', catExists: 'التصنيف ده موجود بالفعل.', catLimit: 'وصلت للحد الأقصى (20 تصنيف مخصص).',
            catAdded: 'تمت إضافة التصنيف ✅', noCustomCats: 'لا توجد تصنيفات مخصصة بعد',
            delCatConfirm: 'حذف التصنيف «{0}»؟ العمليات القديمة هتفضل محتفظة باسمه، وهتتحذف ميزانيته.',
            catHint: 'التصنيفات الأساسية ثابتة. أضف تصنيفاتك الخاصة، وسيتعرف عليها الأمر الصوتي إذا ذكرت اسمها.',
            guideBtn: 'كيف أستخدم التطبيق؟', privBtn: 'الخصوصية والشروط',
            welcomeTitle: 'أهلاً بك في محفظتي الذكية 👋',
            welcome1: '🎙️ اضغط على المايك وقل مثلاً: «قهوة 50 وعصير 20» أو «دخل 1000 مرتب». المايك بيفضل شغال لحد ما تضغط ⏹️.',
            welcome2: '↩️ التسجيل سريع، وتقدر تضغط «تراجع» بعده. ولو عايز تشوف اللي فهمه التطبيق قبل الحفظ، فعّل خيار «مراجعة قبل الحفظ». وتقدر تكتب الأمر بدل ما تقوله.',
            welcome3: '🔒 بياناتك محفوظة على جهازك فقط. التعرف على الصوت بيتم عن طريق خدمة الكلام في المتصفح وبيحتاج إنترنت.',
            welcomeStart: 'ابدأ الآن',
            privTitle: 'الخصوصية وشروط الاستخدام',
            privH1: 'البيانات التي نجمعها', priv1: 'لا يجمع التطبيق بياناتك ولا يرسلها إلى أي خادم تابع لنا. تُحفظ جميع العمليات والأرصدة والأهداف محليًا على جهازك فقط (التخزين المحلي للمتصفح).',
            privH2: 'التسجيل الصوتي', priv2: 'عند استخدام الميكروفون يتم تحويل الكلام إلى نص عبر خدمة التعرف على الكلام المدمجة في متصفحك. فمتصفح Chrome مثلًا يرسل الصوت إلى خوادم Google لمعالجته، ولذلك يلزم اتصال بالإنترنت. لا يصلنا هذا الصوت ولا نخزّنه، ويمكنك استخدام الكتابة بدلًا من الصوت في أي وقت.',
            privH3: 'خدمات خارجية', priv3: 'يحمّل التطبيق خطوط Google Fonts، وقد يتيح ذلك لخدمة الخطوط الاطلاع على عنوان IP الخاص بك وفق سياساتها. والتطبيق مستضاف على GitHub Pages الذي قد يسجّل بيانات الزيارة التقنية المعتادة. ولا يستخدم التطبيق أي أدوات تحليل أو تتبّع أو إعلانات.',
            privH4: 'مسؤوليتك عن بياناتك', priv4: 'بما أن البيانات محلية، فإن مسح بيانات المتصفح أو فقدان الجهاز يعني فقدانها، لذا نزّل نسخة احتياطية بشكل دوري. كلمة سر النسخة المشفّرة لا يمكن استرجاعها إذا نُسيت. ورمز القفل يحمي الواجهة من الاستخدام العابر فقط ولا يُعد تشفيرًا للبيانات.',
            privH5: 'شروط الاستخدام', priv5: 'يُقدَّم التطبيق «كما هو» لتسجيل ومتابعة مصروفاتك الشخصية، وليس بديلًا عن استشارة مالية أو محاسبية أو ضريبية. قد يخطئ التعرف الصوتي أحيانًا، فراجع العمليات المسجلة. لا نتحمل مسؤولية أي خسارة ناتجة عن فقدان البيانات أو الاعتماد على أرقام غير صحيحة.',
            privH6: 'التواصل', priv6: 'للاستفسار أو لطلب النسخة الاحترافية: deskora.software@gmail.com',
            privUpdated: 'آخر تحديث: نوفمبر 2026'
                    },
        en: {
            appName: 'My Smart Wallet', pageTitle: 'My Smart Wallet — Deskora',
            accountsBtn: '⚙️ Manage accounts', accountsTitle: 'Accounts', accountDefault: 'Account',
            accNamePh: 'New account name (e.g. Savings)', accOpeningPh: 'Opening balance (optional)', accAddBtn: 'Add account', accNameAria: 'Account name',
            accHint: 'Tap an account name to rename it. You can rename or delete any account (even Cash and Bank), but at least one must remain. Voice commands recognize an account by its name.',
            accAdded: 'Account added ✅', accRenamed: 'Name changed ✅', accDeleted: 'Account deleted',
            accInvalidName: 'Enter a valid account name.', accExists: 'An account with this name already exists.', accWarn: 'Heads-up: the word “{0}” in this account name {1}, which may confuse voice commands (transfers and choosing an account).\n\nConsider a more distinctive name (e.g. “Vodafone wallet”).\n\nPress OK to keep this name anyway, or Cancel to change it.', accWhyAcc: 'also appears in the account “{0}”', accWhyAlias: 'is a synonym for the account “{0}” (like cash/bank)', accWhyCmd: 'is a word used by voice commands', accWhyCat: 'is a category name or a category keyword', accWhyGoal: 'is part of a savings goal name', accLimit: 'Limit reached (10 accounts).', accLast: 'At least one account must remain.',
            delAccConfirm: 'Delete the account “{0}”?',
            delAccConfirmTx: 'Delete the account “{0}”? {1} transaction(s) recorded on it (including related transfers) and its recurring transactions will be deleted, and other balances will be adjusted if there are transfers. This cannot be undone, so download a backup first.',
            openingBal: 'Opening balance', goalAccFrom: 'Deduct from {0}', needTwoAcc: 'You need at least two accounts to transfer. Add one from “Manage accounts”.',
            langBtn: 'عربي', langBtnAria: 'التبديل إلى العربية',
            lockCodeAria: 'Lock code', unlock: 'Unlock', forgot: 'Forgot code?',
            themeAria: 'Toggle dark mode',
            backupDue: 'It has been over a week since your last backup. Download a new one now.', backupNow: 'Download backup now',
            warnData: 'Important: your data is saved automatically on this device. <b>Please do not clear your browser data (Cookies & Site Data)</b> to avoid losing it. Downloading a backup regularly is recommended.',
            cash: 'Cash', bank: 'Bank', expense: 'Expense', income: 'Income', transfer: 'Transfer',
            voiceTitle: 'Record with your voice', account: 'Account', micAria: 'Voice recording',
            voiceDefault: 'Tap the mic and start speaking..',
            textCmdPh: 'Or type here: coffee 50 and juice 20', textCmdAria: 'Type a transaction', record: 'Add',
            voiceExample: '(e.g. coffee 50 and juice 20 · income 1000 salary · yesterday taxi 80 · transfer 500 to bank · what’s my balance?)',
            periodSummary: 'Period & summary', period: 'Period', allPeriods: 'All periods',
            sumIncome: 'Income:', sumExpense: 'Expenses:',
            analysis: 'Analysis', analysisType: 'Analysis type', chartExp: 'Expense analysis', chartInc: 'Income analysis',
            noExpensesChart: 'No expenses to analyze yet', noIncomeChart: 'No income to analyze yet', chartTotal: 'Total',
            category: 'Category', budgetLimitPh: 'Limit', save: 'Save',
            budgetOf: 'Budget – {0}', noBudget: 'No budget set yet (the limit applies to every month)', delBudget: 'Delete budget',
            invalidLimit: 'Please enter a valid limit!', overBudget: 'You exceeded the {0} budget', nearBudget: 'You are close to the {0} limit',
            goalsTitle: 'Savings goals', goalNamePh: 'Goal name', goalTargetPh: 'Target', add: 'Add',
            goalDefault: 'Goal', noGoals: 'No goals yet', addAmount: 'Add amount', delGoal: 'Delete goal',
            addToGoalName: 'Add to: {0}',
            delGoalConfirm: 'Delete this goal? (Recorded transactions will stay in the history)', goalNeedBoth: 'Enter the goal name and the target amount.',
            savingDesc: 'Savings: {0}', goalReached: '🎉 Congratulations! You reached your goal “{0}”',
            goalAccNone: 'Don’t deduct from any account', recurringTitle: 'Recurring transactions', recAdd: 'Add recurring transaction', noRec: 'No recurring transactions',
            recLine: 'Day {0} of every month — {1} — {2}', delRecConfirm: 'Delete this recurring transaction?', recNeedBoth: 'Enter a description and an amount.',
            recProcessed: '{0} recurring transaction(s) recorded', negSuffix: ' — ⚠️ negative balance',
            recModalTitle: 'Monthly recurring transaction', recTypeExp: '➖ Expense (rent, subscription...)', recTypeInc: '➕ Income (salary...)',
            recDescPh: 'Description (e.g. Rent)', recDayLabel: 'Day of month (1–28) — starts from the next upcoming date', type: 'Type',
            basketTitle: 'Shopping list', basketPh: 'Enter an item here...', basketItemAria: 'List item',
            basketMicAria: 'Voice input for the list', basketAdd: 'Add to list', basketEmpty: 'The list is empty',
            bpTitleDefault: 'Record it as an expense?', bpTitleItem: 'Bought “{0}”? Record it as an expense', pricePh: 'Price', skip: 'Skip',
            bpNeedPrice: 'Enter the price or tap Skip.',
            historyTitle: 'Transaction history', searchPh: 'Search history', searchAria: 'Search', all: 'All',
            noMatches: 'No matching results', noTx: 'No transactions yet', showMore: 'Show {0} more ({1} left)', edit: 'Edit', del: 'Delete',
            transferTo: 'Transfer to {0}',
            delNegConfirm: 'Deleting this transaction will make an account balance negative. Do you want to continue?',
            delConfirm: 'Are you sure you want to delete this transaction?',
            backupSection: 'Backup & security', exportBtn: 'Download backup', importBtn: 'Restore backup', csvBtn: 'Export CSV',
            pinBtn: 'Lock code', pinChange: 'Change lock code', pinRemove: 'Remove lock code', pinSetTitle: 'Set lock code',
            txAddExpense: 'Add expense', txAddIncome: 'Add income', amount: 'Amount', descOpt: 'Description (optional)',
            desc: 'Description', dateTime: 'Date & time', cancel: 'Cancel',
            descExpense: 'Expense', descManual: 'Manual balance addition',
            invalidAmount: 'Please enter a valid amount!', insufficient: 'Insufficient balance in this account!',
            transferTitle: 'Transfer between accounts', transAmountPh: 'Enter the amount here...',
            transFrom: 'Transfer from', transTo: 'Transfer to', transferInvalid: 'Amount is insufficient or invalid!',
            editTitle: 'Edit transaction', editNeg: 'This edit would make the balance negative!',
            pinOldPh: 'Current code', pinNewPh: 'New code (4 to 8 digits)', pinNew2Ph: 'Re-enter the code',
            tryAfter: 'Try again in {0} seconds', tooMany: 'Too many attempts. Wait {0} seconds.', wrongPin: 'Incorrect code',
            forgotInfo: 'The code only protects the interface from casual use. If you forget it: clear the site data from your browser settings, then restore from a backup.',
            pinOldWrong: 'The current code is incorrect', pinRemoved: 'Lock code removed', pinFormat: 'The code must be 4 to 8 digits',
            pinMismatch: 'The codes do not match', pinSet: 'Lock code set 🔐',
            bkTitle: 'Backup', bkPassPh: 'Encryption password (optional)',
            bkNote: 'Leave it empty for a normal backup. If you set a password you will need it to restore, and there is no way to recover it if you forget it.',
            bkDownload: '⬇️ Download', bkShare: '📤 Share',
            impTitle: 'The backup is encrypted 🔒', impPassPh: 'Password', decrypt: 'Decrypt',
            cryptoNeedHttps: 'Encryption requires opening the app over HTTPS.', decryptNeedHttps: 'Decryption requires opening the app over HTTPS.',
            shareTitle: 'My Wallet backup', backupFail: 'Could not create the backup.', saveFail: 'Could not save data! Storage is full or unavailable. Download a backup now.',
            csvDate: 'Date', csvType: 'Type', csvDesc: 'Description', csvCat: 'Category', csvAcc: 'Account', csvAmount: 'Amount',
                        invalidFile: 'Invalid file!', fileTooBig: 'The file is too large!',
            importConfirm: 'Your current data will be replaced by the imported backup ({0} transactions). Do you want to continue?',
            restored: 'Data restored successfully! ✅', wrongPass: 'Wrong password or the file is corrupted.',
            lastBackup: 'Last backup: {0}', noBackupYet: 'No backup has been downloaded yet',
            persistOk: '🔒 Storage is protected from automatic clearing',
            persistNo: 'ℹ️ The browser did not confirm storage protection — installing the app and backing up regularly is recommended',
            recording: 'Recording... take your time, then tap ⏹️ when you are done',
            micDenied: 'Microphone permission was denied. Allow the browser to use the mic in the site settings.',
            micNetwork: 'Network problem. Check your internet connection (voice recognition needs internet).',
            micNone: 'No microphone was found.', micNoSpeech: 'I didn’t hear anything, please try again.', micError: 'Microphone error: {0}',
            noSpeechSupport: 'Your browser does not support voice recording. Type the transaction in the box below.', noSpeechAlert: 'Your browser does not support voice recording.',
            voiceIncomeDesc: 'Voice income', voiceDone: '{0} transaction(s) recorded! ✅', voiceRejected: ' ({0} failed: insufficient balance)',
            voiceInsufficient: 'Insufficient balance in the {0} account for this transaction.', voiceNoAmount: 'Could not recognize the amount. Please try again.',
            cur: 'EGP', choose: 'Choose',
            brandText: 'My Smart Wallet by Deskora — an easy-to-use app that works entirely by voice, hands-free. This is a simplified edition; for the Professional version, please contact us by email:',
            reviewTitle: 'Review before saving', reviewOk: 'OK ✅', reviewUndo: 'Undo ↩️',
            reviewHint: 'If it is correct tap “OK”, if it is wrong tap “Undo”.', reviewRejected: '{0} transaction(s) will not be saved: insufficient balance.',
            reviewPrompt: 'Review the transaction and tap “OK” or “Undo”', cancelled: 'Cancelled, nothing was saved', confirmToggle: '✋ Review before saving (optional)',
            micSalvaged: 'Recording was interrupted. The text was placed in the box, tap “Add” if it is right.', nothingToUndo: 'Nothing to undo', qSpentToday: 'Spent today: {0}', qSpentMonth: 'Spent this month: {0}',
            undoBtn: 'Undo', undone: 'Transactions undone ↩️', updAvail: 'A new version is available 🎉', updNow: 'Update now', updLater: 'Later', close: 'Close',
            catsBtn: 'Categories', catsTitle: 'Manage categories', catNamePh: 'Category name (e.g. 🏋️ Gym)',
            catInvalid: 'Enter a valid category name.', catExists: 'This category already exists.', catLimit: 'Limit reached (20 custom categories).',
            catAdded: 'Category added ✅', noCustomCats: 'No custom categories yet',
            delCatConfirm: 'Delete the category “{0}”? Past transactions will keep its name, and its budget will be removed.',
            catHint: 'The built-in categories are fixed. Add your own, and voice commands will recognize them when you say their name.',
            guideBtn: 'How to use', privBtn: 'Privacy & terms',
            welcomeTitle: 'Welcome to My Smart Wallet 👋',
            welcome1: '🎙️ Tap the mic and say, for example: “coffee 50 and juice 20” or “income 1000 salary”. The mic keeps listening until you tap ⏹️.',
            welcome2: '↩️ Recording is instant, and you can tap “Undo” afterwards. If you want to see what the app understood before saving, turn on “Review before saving”. You can also type the command instead of speaking.',
            welcome3: '🔒 Your data stays on your device only. Voice recognition uses your browser’s speech service and needs an internet connection.',
            welcomeStart: 'Get started',
            privTitle: 'Privacy & terms of use',
            privH1: 'Data we collect', priv1: 'The app does not collect your data and does not send it to any server of ours. All transactions, balances and goals are stored locally on your device only (the browser’s local storage).',
            privH2: 'Voice recording', priv2: 'When you use the microphone, speech is converted to text by the speech recognition service built into your browser. Chrome, for example, sends the audio to Google’s servers for processing, so an internet connection is required. We never receive or store this audio, and you can type instead of speaking at any time.',
            privH3: 'Third-party services', priv3: 'The app loads Google Fonts, which may let the font service see your IP address under its own policies. The app is hosted on GitHub Pages, which may log standard technical visit data. The app uses no analytics, tracking or advertising tools.',
            privH4: 'Your responsibility for your data', priv4: 'Because data is stored locally, clearing your browser data or losing your device means losing it, so download a backup regularly. The password of an encrypted backup cannot be recovered if forgotten. The lock code only protects the interface from casual use and is not encryption of your data.',
            privH5: 'Terms of use', priv5: 'The app is provided “as is” for recording and tracking your personal expenses and is not a substitute for financial, accounting or tax advice. Voice recognition can make mistakes, so review recorded transactions. We are not liable for any loss caused by data loss or by relying on incorrect figures.',
            privH6: 'Contact', priv6: 'For questions or to request the Professional version: deskora.software@gmail.com',
            privUpdated: 'Last updated: November 2026'
                    }
    };
    
    // التصنيفات بتتخزن بالعربي (عشان النسخ الاحتياطية القديمة تفضل شغالة) وبتتعرض بلغة الواجهة
    // Categories are stored in Arabic (so old backups keep working) and displayed in the UI language
    const CATS_EN = {
        'أكل وشرب 🍔': 'Food & Drink 🍔', 'مواصلات 🚗': 'Transport 🚗', 'فواتير 🧾': 'Bills 🧾', 'ملابس 👕': 'Clothing 👕',
        'صحة 🏥': 'Health 🏥', 'ادخار 💎': 'Savings 💎', 'أخرى 📦': 'Other 📦',
        'راتب 💼': 'Salary 💼', 'دخل إضافي 🎁': 'Extra income 🎁', 'دخل 💰': 'Income 💰', 'تحويل 🔄': 'Transfer 🔄'
    };

    let lang = 'ar';
    try { const s = localStorage.getItem('walletLang'); if (s === 'en' || s === 'ar') lang = s; } catch (e) {}
    const listeners = [];

    function t(key) {
        const args = Array.prototype.slice.call(arguments, 1);
        let s = (DICT[lang] && DICT[lang][key]);
        if (s == null) s = DICT.ar[key];
        if (s == null) return key;
        return s.replace(/\{(\d+)\}/g, (m, i) => (args[i] != null ? args[i] : ''));
    }
    const catLabel = (c) => (lang === 'en' && Object.prototype.hasOwnProperty.call(CATS_EN, c)) ? CATS_EN[c] : c;

    function apply() {
        const root = document.documentElement;
        root.setAttribute('lang', lang);
        root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.title = t('pageTitle');
        document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.getAttribute('data-i18n')); });
        document.querySelectorAll('[data-i18n-html]').forEach((n) => { n.innerHTML = t(n.getAttribute('data-i18n-html')); }); // نصوص ثابتة من القاموس فقط
        document.querySelectorAll('[data-i18n-ph]').forEach((n) => { n.setAttribute('placeholder', t(n.getAttribute('data-i18n-ph'))); });
        document.querySelectorAll('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
        const lb = document.getElementById('langBtn');
        if (lb) { lb.textContent = t('langBtn'); lb.setAttribute('aria-label', t('langBtnAria')); lb.setAttribute('lang', lang === 'ar' ? 'en' : 'ar'); }
    }

    function setLang(l) {
        if (l !== 'ar' && l !== 'en') return;
        lang = l;
        try { localStorage.setItem('walletLang', l); } catch (e) {}
        apply();
        listeners.forEach((fn) => { try { fn(l); } catch (e) { console.error(e); } });
    }

    window.I18N = {
        t, catLabel, apply, setLang, dict: DICT,
        get lang() { return lang; },
        onChange(fn) { listeners.push(fn); }
    };
    apply();
})();
