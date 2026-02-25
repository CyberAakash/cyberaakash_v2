import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roashe = localFont({
  src: [
    {
      path: "../public/fonts/RoashePersonalUse-jEa4M.otf",
    },
  ],
  variable: "--font-roashe",
});

const designer = localFont({
  src: [
    {
      path: "../public/fonts/Designer-Bold.otf",
    },
  ],
  variable: "--font-designer",
});

export const metadata: Metadata = {
  title: "CyberAakash | Full Stack Developer",
  description:
    "Portfolio of Aakash T — Full Stack Developer at Zoho. Building products, shipping code, chasing entrepreneurship.",
  keywords: [
    "Aakash T",
    "CyberAakash",
    "Full Stack Developer",
    "Zoho",
    "Next.js",
    "React",
    "Portfolio",
  ],
  authors: [{ name: "Aakash T" }],
  openGraph: {
    title: "CyberAakash | Full Stack Developer",
    description:
      "Code. Play. Gym. Learn. Think. Sleep. Portfolio of a builder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${roashe.variable} ${designer.variable} overflow-x-hidden`}
    >
      <body className="font-sans overflow-x-hidden antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
