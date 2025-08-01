import type { Metadata } from "next";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

export const metadata: Metadata = {
  title: "Креативное добро",
  description: "Креативное добро",
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
        <Theme accentColor="pink" panelBackground="solid" radius="none">
          {/* Mobile Header - only visible on small screens */}
          <div className="md:hidden">
            <MobileHeader />
          </div>

          <div className="flex min-h-screen">
            {/* Sidebar - hidden on small screens, visible on medium+ */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Main Content */}
            <main className="
              flex-1
              md:ml-0
              p-4
              md:p-6
              pt-20
              md:pt-6
              mr-3
              mt-3
            ">
              {children}
            </main>
          </div>
        </Theme>
      </body>
    </html>
  );
}
