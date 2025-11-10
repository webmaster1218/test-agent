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
              // Prevenir flash de tema - establecer tema light inmediatamente
              (function() {
                // Si no hay tema guardado, usar light por defecto
                const savedTheme = localStorage.getItem('marcos-chat-theme');
                const theme = savedTheme || 'light';

                // Aplicar tema inmediatamente antes de que la página renderice
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
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
