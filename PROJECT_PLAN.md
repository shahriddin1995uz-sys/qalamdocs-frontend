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

3. **PDF Split (ajratish)** — ⏳ yangi
   - Sahifa oralig'i bo'yicha ajratish (masalan 1-5, 6-10)
   - Har N sahifaga ajratish
   - Sahifalarni alohida fayllarga ajratish
   - Sahifa thumbnail'larini ko'rsatib, vizual tanlash

4. **PDF Rotate (aylantirish)** — ⏳ yangi
   - Butun hujjatni yoki tanlangan sahifalarni aylantirish (90/180/270)
   - Thumbnail ustida aylantirish tugmasi
   - Merge sahifasiga ham integratsiya (har thumbnail'da kichik rotate tugmasi)

5. **PDF ↔ boshqa formatlar (convert)** — ⏳ yangi
   - PDF → Word, PDF → Excel (auditoriya jadvalли hisobotlar bilan ishlaydi — muhim),
     PDF → JPG, va aksincha (Word/Excel/JPG → PDF)
   - Birinchi bosqichda eng kerakli: PDF→Excel, PDF→Word, JPG→PDF

### GURUH B — QO'SHIMCHA (ishonchli ishlaydigan daraja, mukammal shart emas)
Kamroq ishlatiladi. Bug'siz ishlasin, lekin ortiqcha sayqal berilmaydi.

6. PDF'ga sahifa raqami qo'shish (page numbers)
7. Watermark (suv belgisi) qo'shish
8. PDF protect (parol qo'yish) / unlock (parolni olib tashlash)
9. PDF'dan sahifa o'chirish / qo'shish (organize)
10. PDF/A formatga o'tkazish (arxivlash)
11. PDF'dan rasm chiqarish (extract images)
12. PDF'ni rasmga aylantirish (har sahifa = rasm)
13. eSign (imzo qo'yish)
14. PDF tahrirlash (matn/annotatsiya)
15. OCR (skanlangan hujjatdan matn) — murakkab, oxirroqda

### GURUH C — RAQOBATCHILARDA BOR, FARQLOVCHI (keyingi bosqich)
Asosiy va qo'shimchalar tugagach, merge'ni yetakchilar darajasiga chiqaradi.

16. **Sahifa darajasida tanlash (page-level selection)** — eng katta farqlovchi.
    Merge/split'da faylning faqat kerakli sahifalarini tanlash. Auditoriya uchun
    juda foydali (ГТД 17 sahifa, lekin 2 tasi kerak).
17. **Sahifalarni fayllar orasida aralashtirib joylashtirish** (page-level reorder
    across files) — A faylning sahifasini B orasiga sudrash.
18. **Merge'dan keyin darhol compress tugmasi** (qayta yuklamasdan) — Smallpdf uslubi.
19. Bo'sh sahifa / ajratuvchi sahifa qo'shish.

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
- ⏳ Qolganlari — boshlanmagan

**Keyingi qadam:** PDF Split (ajratish) — Guruh A, 3-band.
