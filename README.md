# QalamDocs — Frontend

PDF va hujjatlar bilan ishlash uchun professional onlayn vositalar (iLovePDF uslubida).
**Next.js + Tailwind CSS** asosida, **o'zbek tilida (lotin va kirill)**.

## Imkoniyatlar

| Vosita | Sahifa | Backend endpoint |
| --- | --- | --- |
| PDF birlashtirish | `/tools/merge-pdf` | `POST /api/pdf/merge` |
| PDF siqish | `/tools/compress-pdf` | `POST /api/pdf/compress` |
| PDF → Word | `/tools/pdf-to-word` | `POST /api/ocr/pdf-to-word` |
| Rasmdan matn (OCR) | `/tools/image-to-text` | `POST /api/ocr/image-to-text` |

Qo'shimcha vositalar (PDF bo'lish, aylantirish, JPG, parol va h.k.) "Tez orada" sifatida ko'rsatilgan.

### Til (yozuv) almashtirish
Yuqori paneldagi **Lotin / Кирилл** tugmasi orqali butun interfeys ikki yozuvda ishlaydi.
Tanlov `localStorage`'da saqlanadi. Lug'at: [`src/i18n/translations.ts`](src/i18n/translations.ts).

## Texnologiyalar
- Next.js 16 (App Router)
- React 19, TypeScript
- Tailwind CSS v4
- Inter shrifti (lotin + kirill subseti)

## Ishga tushirish

```bash
npm install
npm run dev
```

`http://localhost:3000` manzilida ochiladi.

### Sozlamalar
Backend manzili `.env.local` faylida (`.env.example`'dan nusxa oling):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Backend ([qalamdocs-backend](../qalamdocs-backend)) ayni vaqtda ishlab turishi kerak.
> Uni ishga tushirish: `uvicorn app.main:app --reload`

## Loyiha tuzilishi

```
src/
├─ app/                  # App Router sahifalari
│  ├─ page.tsx           # Bosh sahifa (hero + vositalar grid)
│  ├─ layout.tsx         # Ildiz layout (provider, header, footer)
│  └─ tools/<vosita>/    # Har bir vosita sahifasi
├─ components/           # Header, Footer, ToolCard, FileDropzone, FileToolForm, ...
├─ i18n/                 # translations.ts + LanguageProvider
└─ lib/                  # api.ts (backend klienti), tools.ts (vositalar ro'yxati)
```

## Build

```bash
npm run build
npm start
```
