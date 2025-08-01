import type { Metadata } from "next";
import "../globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "Админ панель - Креативное добро",
  description: "Панель администратора",
};

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
        <Theme accentColor="pink" panelBackground="solid" radius="none">
          {/* Admin layout without sidebar */}
          <main className="min-h-screen p-6">
            {children}
          </main>
        </Theme>
      </body>
    </html>
  );
}