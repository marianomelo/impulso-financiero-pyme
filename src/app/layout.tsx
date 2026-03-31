import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Impulso Financiero PYME",
  description: "Microcreditos y desarrollo de las PYMES",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-border sticky top-0 z-40 bg-bg">
          <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center">
                <span className="text-white text-xs font-bold">IF</span>
              </div>
              <span className="text-[0.9375rem] font-semibold tracking-tight hidden sm:block">
                Impulso Financiero PYME
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="text-[0.75rem] text-fg-tertiary hidden sm:block mr-2">
                Nicol Fermin — UBA
              </span>
              <Link href="/" className="btn-ghost text-xs">Blog</Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-dark text-white mt-auto">
          <div className="max-w-[1120px] mx-auto px-6 py-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Nicol Fermin</p>
              <p className="text-xs text-dark-muted mt-0.5">
                Universidad Bicentenaria de Aragua
              </p>
            </div>
            <p className="text-xs text-dark-muted">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
