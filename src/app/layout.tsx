import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3007"),
  applicationName: "Креативное добро",
  title: {
    default: "Креативное добро",
    template: "%s — Креативное добро",
  },
  description:
    "Платформа о креативе и благотворительности: истории в журнале, креаторы и команды, сотрудничество c фондами и социальными проектами, как поддержать инициативы.",
  keywords: [
    "креативное добро",
    "благотворительность",
    "социальные проекты",
    "журнал",
    "креаторы",
    "студии",
    "фонды",
    "сотрудничество",
    "маркетинг",
    "дизайн",
    "фото",
    "видео",
    "истории",
    "поддержать проект"
  ],
  authors: [{ name: "Креативное добро" }],
  creator: "Креативное добро",
  publisher: "Креативное добро",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Креативное добро",
    description:
      "Платформа о креативе и благотворительности: истории, креаторы, команды и сотрудничество с фондами.",
    url: "/",
    siteName: "Креативное добро",
    images: [
      {
        url: "/preview_main_page.jpg",
        width: 1920,
        height: 1080,
        alt: "Креативное добро — превью",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Креативное добро",
    description:
      "Истории про креатив и благотворительность, креаторы и команды, сотрудничество с фондами.",
    images: ["/preview_main_page.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Vector.svg",
    shortcut: "/Vector.svg",
    apple: "/Vector.svg",
    other: {
      rel: "icon",
      url: "/Vector.svg",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/Vector.svg" type="image/svg+xml" />
      </head>
      <body
        className={`antialiased font-['Suisse_Intl',sans-serif]`}
      >
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103665879', 'ym');

ym(103665879, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103665879" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
          {/* Mobile Header - only visible on small screens */}
          <div className="md:hidden">
            <MobileHeader />
          </div>

          <div className="flex min-h-screen">
            {/* Sidebar - hidden on small screens, visible on medium+ */}
            <div className="hidden md:block ml-[25px] lg:ml-[50px]">
              <Sidebar />
            </div>

            {/* Main Content */}
            <main className="
              flex-1
              ml-[25px]
              md:ml-0
              p-4
              md:p-6
              md:pt-6
              pb-20
              mb-[25px]
              md:mb-0
              md:mt-[25px]
              mr-[25px]
              lg:mt-[50px]
              lg:mb-0
              lg:mr-[50px]
            ">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
