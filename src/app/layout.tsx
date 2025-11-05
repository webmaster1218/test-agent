import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalAppContent from "@/components/conditional-app-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marcos Chat Studio",
  description: "Plataforma de chat y analytics con asistente virtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevenir flash de tema - simple y no destructivo
              (function() {
                const path = window.location.pathname;
                // Aplicar tema de comida solo a rutas específicas
                if (path.includes('/chat/comida') || path.includes('/dashboard/comida') || path.includes('/settings/comida')) {
                  document.documentElement.setAttribute('data-theme', 'comida');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConditionalAppContent>
          {children}
        </ConditionalAppContent>
      </body>
    </html>
  );
}
