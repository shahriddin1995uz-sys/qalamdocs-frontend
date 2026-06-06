export type Script = "lat" | "cyr";

type Entry = { lat: string; cyr: string };

export const translations = {
  // Brand / general
  "brand.tagline": {
    lat: "Hujjatlar bilan ishlashning eng oson yo'li",
    cyr: "Ҳужжатлар билан ишлашнинг энг осон йўли",
  },
  "nav.tools": { lat: "Vositalar", cyr: "Воситалар" },
  "nav.allTools": { lat: "Barcha vositalar", cyr: "Барча воситалар" },
  "nav.pricing": { lat: "Narxlar", cyr: "Нархлар" },
  "nav.help": { lat: "Yordam", cyr: "Ёрдам" },
  "nav.login": { lat: "Kirish", cyr: "Кириш" },
  "nav.signup": { lat: "Ro'yxatdan o'tish", cyr: "Рўйхатдан ўтиш" },
  "common.backHome": { lat: "Bosh sahifa", cyr: "Бош саҳифа" },
  "common.comingSoon": { lat: "Tez orada", cyr: "Тез орада" },
  "common.new": { lat: "Yangi", cyr: "Янги" },

  // Hero
  "hero.title": {
    lat: "PDF va hujjatlar uchun bepul onlayn vositalar",
    cyr: "PDF ва ҳужжатлар учун бепул онлайн воситалар",
  },
  "hero.subtitle": {
    lat: "PDF birlashtirish, siqish, Word'ga aylantirish va rasmdan matn ajratib olish — barchasi bitta joyda, ro'yxatdan o'tmasdan.",
    cyr: "PDF бирлаштириш, сиқиш, Word'га айлантириш ва расмдан матн ажратиб олиш — барчаси битта жойда, рўйхатдан ўтмасдан.",
  },
  "hero.cta": { lat: "Vositani tanlang", cyr: "Воситани танланг" },
  "hero.badge": { lat: "100% bepul · Xavfsiz · Tez", cyr: "100% бепул · Хавфсиз · Тез" },

  // Sections
  "section.tools.title": { lat: "Mashhur vositalar", cyr: "Машҳур воситалар" },
  "section.tools.subtitle": {
    lat: "Kundalik ishingiz uchun zarur barcha PDF vositalari",
    cyr: "Кундалик ишингиз учун зарур барча PDF воситалари",
  },
  "section.why.title": { lat: "Nega QalamDocs?", cyr: "Нега QalamDocs?" },

  // Features
  "feature.fast.title": { lat: "Juda tez", cyr: "Жуда тез" },
  "feature.fast.desc": {
    lat: "Fayllaringiz bir necha soniyada qayta ishlanadi.",
    cyr: "Файлларингиз бир неча сонияда қайта ишланади.",
  },
  "feature.secure.title": { lat: "Xavfsiz", cyr: "Хавфсиз" },
  "feature.secure.desc": {
    lat: "Fayllaringiz qayta ishlangach serverdan o'chiriladi.",
    cyr: "Файлларингиз қайта ишлангач сервердан ўчирилади.",
  },
  "feature.free.title": { lat: "Bepul", cyr: "Бепул" },
  "feature.free.desc": {
    lat: "Asosiy vositalar to'liq bepul, cheklovlarsiz.",
    cyr: "Асосий воситалар тўлиқ бепул, чекловларсиз.",
  },
  "feature.uz.title": { lat: "O'zbek tilida", cyr: "Ўзбек тилида" },
  "feature.uz.desc": {
    lat: "Lotin va kirill — sizga qulay yozuvda ishlang.",
    cyr: "Лотин ва кирилл — сизга қулай ёзувда ишланг.",
  },

  // Tool: merge-pdf
  "tool.merge-pdf.title": { lat: "PDF birlashtirish", cyr: "PDF бирлаштириш" },
  "tool.merge-pdf.desc": {
    lat: "Bir nechta PDF faylni bitta hujjatga birlashtiring.",
    cyr: "Бир нечта PDF файлни битта ҳужжатга бирлаштиринг.",
  },
  // Tool: compress-pdf
  "tool.compress-pdf.title": { lat: "PDF siqish", cyr: "PDF сиқиш" },
  "tool.compress-pdf.desc": {
    lat: "PDF hajmini sifatni saqlagan holda kamaytiring.",
    cyr: "PDF ҳажмини сифатни сақлаган ҳолда камайтиринг.",
  },
  // Tool: pdf-to-word
  "tool.pdf-to-word.title": { lat: "PDF dan Word", cyr: "PDF дан Word" },
  "tool.pdf-to-word.desc": {
    lat: "PDF'ni tahrirlanadigan Word (DOCX) hujjatiga aylantiring.",
    cyr: "PDF'ни таҳрирланадиган Word (DOCX) ҳужжатига айлантиринг.",
  },
  // Tool: image-to-text
  "tool.image-to-text.title": { lat: "Rasmdan matn (OCR)", cyr: "Расмдан матн (OCR)" },
  "tool.image-to-text.desc": {
    lat: "Rasm yoki skanerdan matnni avtomatik ajratib oling.",
    cyr: "Расм ёки сканердан матнни автоматик ажратиб олинг.",
  },

  // Coming soon tools
  "tool.split-pdf.title": { lat: "PDF bo'lish", cyr: "PDF бўлиш" },
  "tool.split-pdf.desc": {
    lat: "PDF'ni alohida sahifalar yoki bo'limlarga ajrating.",
    cyr: "PDF'ни алоҳида саҳифалар ёки бўлимларга ажратинг.",
  },
  "tool.rotate-pdf.title": { lat: "PDF aylantirish", cyr: "PDF айлантириш" },
  "tool.rotate-pdf.desc": {
    lat: "Sahifalarni kerakli tomonga buring.",
    cyr: "Саҳифаларни керакли томонга буринг.",
  },
  "tool.pdf-to-jpg.title": { lat: "PDF dan JPG", cyr: "PDF дан JPG" },
  "tool.pdf-to-jpg.desc": {
    lat: "Har bir sahifani rasmga aylantiring.",
    cyr: "Ҳар бир саҳифани расмга айлантиринг.",
  },
  "tool.word-to-pdf.title": { lat: "Word dan PDF", cyr: "Word дан PDF" },
  "tool.word-to-pdf.desc": {
    lat: "DOCX hujjatlarini PDF formatiga o'tkazing.",
    cyr: "DOCX ҳужжатларини PDF форматига ўтказинг.",
  },
  "tool.protect-pdf.title": { lat: "PDF himoyalash", cyr: "PDF ҳимоялаш" },
  "tool.protect-pdf.desc": {
    lat: "PDF'ga parol qo'yib himoyalang.",
    cyr: "PDF'га парол қўйиб ҳимояланг.",
  },
  "tool.sign-pdf.title": { lat: "PDF imzolash", cyr: "PDF имзолаш" },
  "tool.sign-pdf.desc": {
    lat: "Hujjatga elektron imzo qo'ying.",
    cyr: "Ҳужжатга электрон имзо қўйинг.",
  },

  // Tool page UI
  "tool.action.run": { lat: "Boshlash", cyr: "Бошлаш" },
  "tool.action.processing": { lat: "Qayta ishlanmoqda...", cyr: "Қайта ишланмоқда..." },
  "tool.action.download": { lat: "Natijani yuklab olish", cyr: "Натижани юклаб олиш" },
  "tool.action.reset": { lat: "Boshqa fayl tanlash", cyr: "Бошқа файл танлаш" },
  "tool.action.copy": { lat: "Nusxa olish", cyr: "Нусха олиш" },
  "tool.action.copied": { lat: "Nusxa olindi!", cyr: "Нусха олинди!" },
  "tool.result.ready": { lat: "Tayyor!", cyr: "Тайёр!" },
  "tool.result.readyDesc": {
    lat: "Faylingiz muvaffaqiyatli qayta ishlandi.",
    cyr: "Файлингиз муваффақиятли қайта ишланди.",
  },

  // Compress tool — quality variants
  "compress.original": { lat: "Asl hajm", cyr: "Асл ҳажм" },
  "compress.choose": {
    lat: "Siqish darajasini tanlang:",
    cyr: "Сиқиш даражасини танланг:",
  },
  "compress.estimating": {
    lat: "Hajmlar hisoblanmoqda...",
    cyr: "Ҳажмлар ҳисобланмоқда...",
  },
  "compress.estimateFailed": {
    lat: "Taxminiy hajmni hisoblab bo'lmadi, lekin siqishni davom ettirishingiz mumkin.",
    cyr: "Тахминий ҳажмни ҳисоблаб бўлмади, лекин сиқишни давом эттиришингиз мумкин.",
  },
  "compress.result": { lat: "Natija", cyr: "Натижа" },
  "compress.reduction": { lat: "qisqarish", cyr: "қисқариш" },
  "compress.approxNote": {
    lat: "Hajmlar taxminiy. Aniq natija siqishdan keyin ko'rinadi.",
    cyr: "Ҳажмлар тахминий. Аниқ натижа сиқишдан кейин кўринади.",
  },
  "compress.quality.high": { lat: "Yuqori sifat", cyr: "Юқори сифат" },
  "compress.quality.high.desc": {
    lat: "Eng yaxshi sifat, kamroq siqish",
    cyr: "Энг яхши сифат, камроқ сиқиш",
  },
  "compress.quality.recommended": { lat: "Tavsiya etilgan", cyr: "Тавсия этилган" },
  "compress.quality.recommended.desc": {
    lat: "Sifat va hajm muvozanati",
    cyr: "Сифат ва ҳажм мувозанати",
  },
  "compress.quality.maximum": { lat: "Maksimal siqish", cyr: "Максимал сиқиш" },
  "compress.quality.maximum.desc": {
    lat: "Eng kichik hajm",
    cyr: "Энг кичик ҳажм",
  },

  // Split tool
  "split.pages": { lat: "sahifa", cyr: "саҳифа" },
  "split.thumbsLoading": {
    lat: "Sahifalar yuklanmoqda...",
    cyr: "Саҳифалар юкланмоқда...",
  },
  "split.choose": { lat: "Ajratish usulini tanlang:", cyr: "Ажратиш усулини танланг:" },
  "split.changeFile": { lat: "Boshqa fayl", cyr: "Бошқа файл" },
  "split.mode.range": { lat: "Oraliqlar bo'yicha", cyr: "Оралиқлар бўйича" },
  "split.mode.range.desc": {
    lat: "Masalan 1-5, 6-10 — har oraliq alohida fayl",
    cyr: "Масалан 1-5, 6-10 — ҳар оралиқ алоҳида файл",
  },
  "split.mode.every": { lat: "Har N sahifadan", cyr: "Ҳар N саҳифадан" },
  "split.mode.every.desc": {
    lat: "Hujjatni teng bo'laklarga bo'ladi",
    cyr: "Ҳужжатни тенг бўлакларга бўлади",
  },
  "split.mode.each": { lat: "Har sahifa alohida", cyr: "Ҳар саҳифа алоҳида" },
  "split.mode.each.desc": {
    lat: "Har bir sahifa alohida PDF bo'ladi",
    cyr: "Ҳар бир саҳифа алоҳида PDF бўлади",
  },
  "split.ranges.label": { lat: "Sahifa oraliqlari", cyr: "Саҳифа оралиқлари" },
  "split.ranges.hint": {
    lat: "Sahifa qo'shish uchun quyidagi rasm ustiga bosing.",
    cyr: "Саҳифа қўшиш учун қуйидаги расм устига босинг.",
  },
  "split.every.label": { lat: "Har nechta sahifadan:", cyr: "Ҳар нечта саҳифадан:" },
  "split.each.info": {
    lat: "Har bir sahifa alohida faylga ajratiladi.",
    cyr: "Ҳар бир саҳифа алоҳида файлга ажратилади.",
  },
  "split.willCreate": { lat: "Natijada", cyr: "Натижада" },
  "split.files": { lat: "ta fayl (ZIP)", cyr: "та файл (ZIP)" },
  "split.oneFile": { lat: "ta fayl", cyr: "та файл" },
  "split.pagesTitle": { lat: "Sahifalar", cyr: "Саҳифалар" },
  "error.split.range": {
    lat: "Sahifa oralig'ini to'g'ri kiriting (masalan: 1-5, 8).",
    cyr: "Саҳифа оралиғини тўғри киритинг (масалан: 1-5, 8).",
  },
  "error.split.every": {
    lat: "Sahifa sonini to'g'ri kiriting (1 dan katta).",
    cyr: "Саҳифа сонини тўғри киритинг (1 дан катта).",
  },

  // Rotate tool
  "rotate.choose": { lat: "Sahifalarni aylantiring:", cyr: "Саҳифаларни айлантиринг:" },
  "rotate.all": { lat: "Hammasini:", cyr: "Ҳаммасини:" },
  "rotate.left": { lat: "Chapga 90°", cyr: "Чапга 90°" },
  "rotate.right": { lat: "O'ngga 90°", cyr: "Ўнгга 90°" },
  "rotate.reset": { lat: "Bekor qilish", cyr: "Бекор қилиш" },
  "rotate.hint": {
    lat: "Bitta sahifani aylantirish uchun rasm ustidagi tugmani bosing.",
    cyr: "Битта саҳифани айлантириш учун расм устидаги тугмани босинг.",
  },
  "rotate.willRotate": { lat: "sahifa aylantiriladi", cyr: "саҳифа айлантирилади" },
  "error.rotate.none": {
    lat: "Avval kamida bitta sahifani aylantiring.",
    cyr: "Аввал камида битта саҳифани айлантиринг.",
  },

  // Dropzone
  "drop.title": { lat: "Fayllarni bu yerga tashlang", cyr: "Файлларни бу ерга ташланг" },
  "drop.or": { lat: "yoki", cyr: "ёки" },
  "drop.browse": { lat: "Fayl tanlash", cyr: "Файл танлаш" },
  "drop.hint.pdf": { lat: "PDF fayllari qo'llab-quvvatlanadi", cyr: "PDF файллари қўллаб-қувватланади" },
  "drop.hint.image": { lat: "JPG va PNG rasmlari qo'llab-quvvatlanadi", cyr: "JPG ва PNG расмлари қўллаб-қувватланади" },
  "drop.selected": { lat: "Tanlangan fayllar", cyr: "Танланган файллар" },
  "drop.dragHandle": { lat: "Drag tutgich", cyr: "Drag тутғич" },
  "drop.remove": { lat: "O'chirish", cyr: "Ўчириш" },
  "drop.addMore": { lat: "Yana qo'shish", cyr: "Яна қўшиш" },

  // Errors
  "error.minTwo": { lat: "Kamida 2 ta PDF fayl tanlang.", cyr: "Камида 2 та PDF файл танланг." },
  "error.needFile": { lat: "Avval fayl tanlang.", cyr: "Аввал файл танланг." },
  "error.wrongPdf": { lat: "Faqat PDF fayllari qabul qilinadi.", cyr: "Фақат PDF файллари қабул қилинади." },
  "error.wrongImage": { lat: "Faqat JPG yoki PNG rasmlari qabul qilinadi.", cyr: "Фақат JPG ёки PNG расмлари қабул қилинади." },
  "error.server": {
    lat: "Serverda xatolik yuz berdi. Qayta urinib ko'ring.",
    cyr: "Серверда хатолик юз берди. Қайта уриниб кўринг.",
  },
  "error.network": {
    lat: "Serverga ulanib bo'lmadi. Internetni tekshiring.",
    cyr: "Серверга уланиб бўлмади. Интернетни текширинг.",
  },

  // Footer
  "footer.product": { lat: "Mahsulot", cyr: "Маҳсулот" },
  "footer.company": { lat: "Kompaniya", cyr: "Компания" },
  "footer.legal": { lat: "Huquqiy", cyr: "Ҳуқуқий" },
  "footer.about": { lat: "Biz haqimizda", cyr: "Биз ҳақимизда" },
  "footer.contact": { lat: "Bog'lanish", cyr: "Боғланиш" },
  "footer.privacy": { lat: "Maxfiylik siyosati", cyr: "Махфийлик сиёсати" },
  "footer.terms": { lat: "Foydalanish shartlari", cyr: "Фойдаланиш шартлари" },
  "footer.rights": { lat: "Barcha huquqlar himoyalangan.", cyr: "Барча ҳуқуқлар ҳимояланган." },
  "footer.madeIn": { lat: "O'zbekistonda ishlab chiqilgan", cyr: "Ўзбекистонда ишлаб чиқилган" },
} satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof translations;
