import type { Metadata } from "next";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";


export const metadata: Metadata = {
  title: "Креативное добро",
  description: "Креативное добро",
  icons: {
    icon: '/Vector.svg',
    shortcut: '/Vector.svg',
    apple: '/Vector.svg',
  },
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
          {children}
        </Theme>
      </body>
    </html>
  );
}
