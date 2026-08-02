import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://bereket.app"),
  title: {
    template: "%s | Bereket AI",
    default: "Bereket AI | Akıllı Mutfak Planlama",
  },
  description:
    "Evdeki malzemeleri, bütçeyi ve alerjen sınırlarını değerlendirerek güvenli ve ekonomik tarifler öneren yapay zeka destekli mutfak asistanı.",
  applicationName: "Bereket AI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://bereket.app",
    siteName: "Bereket AI",
    title: "Bereket AI | Akıllı Mutfak Planlama",
    description:
      "Evdeki malzemeler ve bütçeye göre tarif öneren Takım 134 projesi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bereket AI | Akıllı Mutfak Planlama",
    description:
      "Bütçe ve eldeki malzemeler için güvenli, açıklanabilir tarif önerileri.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
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
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
