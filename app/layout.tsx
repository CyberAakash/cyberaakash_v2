import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "@next/font/local";

export const metadata: Metadata = {
  title: 'CyberAakash',
  description: 'Portfolio of CyberAakash',
}

const winchester = localFont({
  src: [
    {
      path: "../public/fonts/WinchesterCaps.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/WinchesterOrnate.ttf",
      weight: "700",
    },
    {
      path: "../public/fonts/WinchesterRegular.ttf",
      weight: "900",
    },
  ],
  variable: "--font-winchester",
});

const roashe = localFont({
  src: [
    {
      path: "../public/fonts/RoashePersonalUse-jEa4M.otf",
      // weight: "400",
    },
  ],
  variable: "--font-roashe",
});

const devalencia = localFont({
  src: [
    {
      path: "../public/fonts/De Valencia (beta).otf",
      // weight: "400",
    },
  ],
  variable: "--font-devalencia",
});

const designer = localFont({
  src: [
    {
      path: "../public/fonts/Designer-Bold.otf",
      // weight: "400",
    },
  ],
  variable: "--font-designer",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${winchester.variable} ${roashe.variable} ${devalencia.variable} ${designer.variable} font-sans`}>
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
