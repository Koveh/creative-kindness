import type { Metadata } from "next";
import "../globals.css";
import Script from "next/script";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Админ панель - Креативное добро",
  description: "Панель администратора",
};
export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/Vector.svg" type="image/svg+xml" />
      </head>
      <body className={`antialiased font-['Suisse_Intl',sans-serif]`}>
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
          <div className="flex min-h-screen bg-stone-100">
            {/* Admin Sidebar */}
            <AdminSidebar />
            
            {/* Main content */}
            <main className="flex-1 ml-[25px] lg:ml-[50px] p-4 md:p-6 md:pt-6 pb-20 mb-[25px] md:mb-0 md:mt-[25px] mr-[25px] lg:mt-[50px] lg:mb-0 lg:mr-[50px]">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
