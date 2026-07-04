import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "%s | Bereket AI",
    default: "Bereket AI: Prototype",
  },
  description:
    "Evdeki malzemeler ve bütçe için sabit mock veriyle yemek planı üreten ChatGPT benzeri Sprint 1 chat prototipi.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={cn(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="tema"
          disableTransitionOnChange
          enableColorScheme
        >
          <TooltipProvider delay={0}>
            <Toaster />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-2xl focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-3 focus:ring-ring/30"
            >
              İçeriğe geç
            </a>
            <main id="main-content">{children}</main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
