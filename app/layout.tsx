import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Menu } from "@/components/menu";
import { Sheet } from "@/components/sheet";
import HeaderAuth from "@/components/header-auth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Provider } from "@/providers/app-provider";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chrono Timer",
  description: "A simple and small time tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <div className="flex-1 w-full flex flex-col gap-10">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm sm:gap-5">
                  <div className="flex items-center font-bold text-lg">
                    Chrono Timer
                  </div>
                  <div className="hidden sm:flex sm:flex-1 justify-between">
                    <Menu />
                    <div className="flex flex-row gap-3">
                      <HeaderAuth />
                      <ThemeSwitcher />
                    </div>
                  </div>
                  <Sheet />
                </div>
              </nav>
              <div className="flex flex-1 flex-col gap-20 p-5">
                <Provider>{children}</Provider>
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
                <p>
                  Powered by{" "}
                  <span className="font-bold hover:underline">Thoth</span>
                </p>
              </footer>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
