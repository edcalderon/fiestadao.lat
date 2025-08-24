import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { FiestaDAOProvider } from "@/context/FiestaDAOContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "FiestaDAO - Cultura en tus manos con Astar",
  description: "Plataforma de gobernanza on-chain para la cultura local. Vota con ASTR y recibe NFTs conmemorativos.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThirdwebProvider>
          <FiestaDAOProvider>
            {children}
          </FiestaDAOProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
