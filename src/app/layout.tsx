import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Shower Quote | LusoGlass",
  description: "Design your custom frameless shower and get a free quote from LusoGlass.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans">{children}</body>
    </html>
  );
}
