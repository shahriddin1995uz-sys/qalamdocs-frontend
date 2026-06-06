# QalamDocs — Loyiha rejasi va Claude Code yo'riqnomasi

> Bu hujjat ikki maqsadli: (1) foydalanuvchi uchun yo'l xaritasi, (2) Claude Code uchun
> doimiy yo'riqnoma. Har bir yangi sessiyada Claude Code shu faylni o'qib, qoidalarga rioya qilsin.

---

## 1. LOYIHA HAQIDA

- **Backend:** `C:\Projects\qalamdocs-backend` — FastAPI + Python (port 8000), Render'da deploy
- **Frontend:** `C:\Projects\qalamdocs-frontend` — Next.js + Tailwind (port 3000)
- **Auditoriya:** O'zbekiston, buxgalteriya/soliq hujjatlari bilan ishlovchilar
  (счёт-фактура, ГТД, солиштирма далолатнома va h.k.)
- **Til:** interfeys o'zbekcha (lotin + kirill almashtirish), foydalanuvchi bilan o'zbekcha muloqot
- **Asosiy kutubxonalar:** frontend'da react-pdf, dnd-kit (drag&drop)

---

## 2. CLAUDE CODE UCHUN ISH QOIDALARI (har sessiyada amal qil)

Foydalanuvchi ishtirokini KAMAYTIRISH maqsad qilingan. Shuning uchun:

1. **Mustaqil ishla.** Kichik qarorlarni (o'zgaruvchi nomi, fayl strukturasi, kichik
   dizayn tanlovlari) o'zing qabul qil, foydalanuvchidan so'rab o'tirma.

2. **Faqat haqiqiy noaniqlikda so'ra.** Faqat ikki holatda to'xtab so'ra:
   (a) vizual natija noma'lum bo'lganda (chunki sen brauzerni ko'rmaysan), yoki
   (b) bir nechta mumkin yo'l bo'lib, biri foydalanuvchi maqsadiga jiddiy ta'sir qilsa.

3. **Tashxisni avval qil.** Vizual bug bo'lsa, taxmin qilib tuzatishdan oldin
   console.log yoki kichik diagnostika qo'shib, foydalanuvchidan natijani so'ra.
   (Bugungi tajriba: taxmin = behuda urinish. Tashxis = aniq tuzatish.)

4. **Har funksiyani "TUGADI" mezoni bilan yopib ket.** "Tugadi" mezoni (3-bo'limda)
   bajarilmaguncha keyingisiga o'tma. Lekin mezondan ortiq cheksiz sayqal ham berma.

5. **Mavjud ishlaydigan kodga TEGMA.** Yangi funksiya qo'shganda, ishlab turgan
   funksiyalarni buzma. Refactor faqat zarur bo'lsa va aniq sababli bo'lsin.

6. **Har funksiya tugagach git commit qil.** Aniq commit xabari bilan, shunda orqaga
   qaytarish oson bo'ladi.

7. **Kichik, aniq o'zgarishlarni afzal ko'r.** Katta refactor o'rniga maqsadli kichik
   o'zgarishlar — bu test qilishni osonlashtiradi va xatoni kamaytiradi.

8. **Har funksiya quyidagilarni qo'llab-quvvatlasin:** drag&drop (kerak bo'lsa),
   thumbnail/preview, xato holatlarini ushlash (try/catch + foydalanuvchiga xabar),
   mobile responsive, o'zbekcha interfeys.

---

## 3. HAR BIR FUNKSIYA UCHUN "TUGADI" MEZONI (Definition of Done)

Funksiya quyidagilarning HAMMASIni qondirса — tugagan hisoblanadi:

- [ ] Asosiy vazifa to'liq ishlaydi (oddiy va chekka holatlarda)
- [ ] Xato holatlarini ushlaydi (noto'g'ri fayl, bo'sh input, server xatosi) va
      foydalanuvchiga tushunarli o'zbekcha xabar beradi
- [ ] Yuklash holatida progress/spinner ko'rsatadi
- [ ] Natijani preview yoki yuklab olish imkoni bor
- [ ] Mobile (telefon) ekranida to'g'ri ko'rinadi
- [ ] Interfeys o'zbekcha (lotin/kirill almashtiruvga mos)
- [ ] Mavjud boshqa funksiyalarni buzmaydi
- [ ] Git commit qilingan

---

## 4. FUNKSIYALAR REJASI

### GURUH A — ASOSIY (mukammal darajada, ustuvor)
Foydalanuvchilarning ~80% i shularni ishlatadi. To'liq mukammal qilinadi.

1. **PDF Merge (birlashtirish)** — ✅ MUKAMMAL TUGADI
   - drag&drop, thumbnail, hover preview (portrait+landscape), full-screen modal
     (ko'p sahifa scroll), fayllar numeratsiyasi
   - Qoldi (keyinroq sayqal): modal'da ГТД jadval chiziqlari sifati
     (react-pdf yuqori devicePixelRatio/scale bilan)

2. **PDF Compress (siqish)** — ✅ TUGADI
   - 3 variant (Yuqori sifat / Tavsiya etilgan / Maksimal siqish) "Boshlash"dan
     oldin ko'rsatiladi, har birида taxminiy fayl hajmi va qisqarish foizi
   - Haqiqiy siqish: backend rasmlarni qayta siqadi (PyMuPDF `replace_image`,
     downsample + JPEG), matn vektor bo'lib qoladi. 3 variant haqiqatan turli
     natija beradi (rasmli hujjatда ~51% / ~74% / ~89% qisqarish)
   - Estimate tezlashtirildi: avval har variantни to'liq siqib o'lchardi (3-4s),
     endi rasm baytlarini matematik baholaydi (`xref_stream_raw`, ~50ms, <1s).
     Natija "~" bilan taxminiy belgilanadi, aniq hajm siqishdan keyin ko'rinadi
   - Tuzatilgan bug'lar: estimate frontend'да relativ URL bilan noto'g'ri portga
     so'rov yuborardi; backend `quality` form parametrини `Form()` siz o'qimasdi

3. **PDF Split (ajratish)** — ✅ TUGADI
   - 3 rejim: Oraliqlar bo'yicha (1-5, 6-10) / Har N sahifadan / Har sahifa alohida
   - Barcha sahifalar thumbnail'lari ko'rsatiladi (raqamlangan); oraliq rejimida
     thumbnail ustiga bosib sahifa qo'shiladi, tanlangan sahifalar yoritiladi
   - Natija fayllar soni oldindan ko'rsatiladi; bitta fayl bo'lsa PDF, ko'p
     bo'lsa ZIP yuklab olinadi (backend `/api/pdf/split`, fitz `insert_pdf`)
   - Xato holatlari (noto'g'ri oraliq, bo'sh/buzuq PDF, chegaradan tashqari)
     o'zbekcha xabar bilan; thumbnail yuklash va siqishда spinner

4. **PDF Rotate (aylantirish)** — ✅ TUGADI
   - Har sahifa thumbnail'ida rotate tugmasi (90° qadam bilan, jonli CSS preview)
   - "Hammasini" boshqaruvi: chapga 90° / o'ngga 90° / 180° + bekor qilish
   - Tanlangan sahifalarni yoki hammasini aylantirish; backend joriy burchakka
     qo'shadi (`/api/pdf/rotate`, `page:burchak` juftliklari, fitz `set_rotation`)
   - Xato holatlari o'zbekcha; thumbnail/ishlovда spinner; mobil grid
   - ⏳ Qoldi (keyinroq): Merge sahifasiga integratsiya (har thumbnail'da rotate)
     — merge "MUKAMMAL TUGADI" bo'lgani uchun alohida, ehtiyotkorlik bilan

5. **PDF ↔ boshqa formatlar (convert)** — 🔶 QISMAN (rasm konvertatsiyalari TUGADI)
   - ✅ **PDF → Word** — mavjud (matn + OCR → docx; layout/jadval saqlamaydi)
   - ✅ **JPG → PDF** — yangi (bir nechta rasm → bitta PDF, tartib saqlanadi,
     `/api/pdf/jpg-to-pdf`; brauzerda tasdiqlandi)
   - ✅ **PDF → JPG** — yangi (har sahifa → JPG, ZIP, `/api/pdf/pdf-to-jpg`;
     brauzerda tasdiqlandi)
   - ⏳ **PDF → Excel** — keyinga: jadval ajratish kutubxonasi (pdfplumber/camelot)
     + openpyxl o'rnatish kerak, Render deploy o'zgaradi, sifat real hujjatlarда
     nomukammal bo'lishi mumkin — alohida qaror bilan qilinadi
   - ⏳ PDF→Word sifatini oshirish (pdf2docx bilan layout/jadval) — alohida

6. **PDF Organize / Sahifalarni boshqarish** — ✅ TUGADI
   - Sahifa thumbnail'lari grid'i; dnd-kit bilan drag&drop tartiblash
   - Har thumbnail'da: o'chirish + aylantirish (90° qadam, jonli CSS preview)
   - **Sahifa qo'shish:** boshqa PDF yoki rasm (JPG/PNG) yuklab, sahifalarini
     qo'shadi — ularni ham suriladi/o'chiriladi/aylantiriladi; "Aslini tiklash"
   - Bitta endpoint barcha amallarni qabul qiladi (`/api/pdf/organize`:
     `operations` JSON {src,page,rot} + `additions` fayllar) → bitta yakuniy PDF;
     yangi kutubxonasiz (fitz + PIL + mavjud dnd-kit)
   - Xato holatlari o'zbekcha; thumbnail/ishlovда spinner; mobil grid
   - **Split'dan farqi:** Split alohida fayllarga *ajratadi*; Organize esa bitta
     fayl ichida sahifalarni *tahrirlaydi* (o'chirish + tartiblash + aylantirish
     + qo'shish → 1 PDF)
   - ⚠️ **Ma'lum qoldiq:** thumbnail birinchi yuklash sekin (~7-8s cold start,
     pdf.js worker ilk yuklanishi) — keyinroq optimizatsiya (worker prewarm /
     progressiv render)

### GURUH B — QO'SHIMCHA (ishonchli ishlaydigan daraja, mukammal shart emas)
Kamroq ishlatiladi. Bug'siz ishlasin, lekin ortiqcha sayqal berilmaydi.

7. PDF'ga sahifa raqami qo'shish (page numbers)
8. Watermark (suv belgisi) qo'shish
9. PDF protect (parol qo'yish) / unlock (parolni olib tashlash)
10. PDF'ga tashqi sahifa/fayl qo'shish (sahifa o'chirish/tartiblash → A-6 Organize'da)
11. PDF/A formatga o'tkazish (arxivlash)
12. PDF'dan rasm chiqarish (extract images)
13. PDF'ni rasmga aylantirish (har sahifa = rasm)
14. eSign (imzo qo'yish)
15. PDF tahrirlash (matn/annotatsiya)
16. OCR (skanlangan hujjatdan matn) — murakkab, oxirroqda

### GURUH C — RAQOBATCHILARDA BOR, FARQLOVCHI (keyingi bosqich)
Asosiy va qo'shimchalar tugagach, merge'ni yetakchilar darajasiga chiqaradi.

17. **Sahifa darajasida tanlash (page-level selection)** — eng katta farqlovchi.
    Merge/split'da faylning faqat kerakli sahifalarini tanlash. Auditoriya uchun
    juda foydali (ГТД 17 sahifa, lekin 2 tasi kerak).
18. **Sahifalarni fayllar orasida aralashtirib joylashtirish** (page-level reorder
    across files) — A faylning sahifasini B orasiga sudrash.
19. **Merge'dan keyin darhol compress tugmasi** (qayta yuklamasdan) — Smallpdf uslubi.
20. Bo'sh sahifa / ajratuvchi sahifa qo'shish.

---

## 5. ISH TARTIBI (foydalanuvchi ishtirokini kamaytirish uchun)

Har bir funksiya ustida quyidagi tartibда ishlanadi:

1. **Claude Code:** funksiyani to'liq yozadi (3-bo'lim mezoniga ko'ra), kichik
   diagnostika (console.log) bilan, git commit qiladi.
2. **Claude Code:** foydalanuvchiga QISQA test ko'rsatmasi beradi — "buni-buni test qil,
   konsolда nima chiqsa ayt".
3. **Foydalanuvchi:** brauzerда test qiladi, natijani (skrinshot yoki konsol log) aytadi.
4. **Claude Code:** feedback bo'yicha kichik aniq tuzatish qiladi (katta refactor emas).
5. Mezon bajarilsa → keyingi funksiyaga. Bajarilmasa → 3-4 takrorlanadi (maksimum 2-3 marta).

Maqsad: har funksiyaga foydalanuvchi **1-2 marta** aralashadi (har qadamда emas).

---

## 6. JORIY HOLAT

- ✅ Merge — mukammal (kichik qoldiq: ГТД chiziqlari)
- ✅ Compress — TUGADI (3 variant + real siqish + tez estimate)
- ✅ Split — TUGADI (3 rejim + thumbnail tanlash, brauzerda tasdiqlandi)
- ✅ Rotate — TUGADI (thumbnail rotate + jonli preview, brauzerda tasdiqlandi)
- 🔶 Convert — rasm konvertatsiyalari TUGADI (JPG→PDF + PDF→JPG, brauzerda
  tasdiqlandi). PDF→Word mavjud. PDF→Excel keyinga qoldirildi (dependency qarori)
- ✅ Organize — TUGADI (drag&drop tartiblash + o'chirish + aylantirish + sahifa
  qo'shish, brauzerda tasdiqlandi; qoldiq: thumbnail cold start ~7-8s)
- ⏳ Qolganlari — boshlanmagan

**Keyingi qadam:** PDF→Excel uchun dependency qarori, yoki Guruh B funksiyalari.
