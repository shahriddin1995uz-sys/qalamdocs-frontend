import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qalamdocs.uz"),
  title: {
    default: "QalamDocs — PDF va hujjatlar uchun bepul onlayn vositalar",
    template: "%s · QalamDocs",
  },
  description:
    "PDF birlashtirish, siqish, Word'ga aylantirish va rasmdan matn (OCR) ajratib olish. O'zbek tilida, bepul va xavfsiz.",
  keywords: [
    "PDF",
    "PDF birlashtirish",
    "PDF siqish",
    "PDF Word",
    "OCR",
    "QalamDocs",
    "hujjat",
    "o'zbek",
  ],
  openGraph: {
    title: "QalamDocs — PDF vositalari",
    description: "PDF va hujjatlar bilan ishlashning eng oson yo'li.",
    type: "website",
    locale: "uz_UZ",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz-Latn" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-ink-900 antialiased">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
