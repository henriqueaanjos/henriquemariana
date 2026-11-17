import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});


import "../styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://henriquemariana.vercel.app"),
  title: "Henrique & Mariana",
  description: "Henrique & Mariana 2027",
  openGraph: {
    title: "Henrique & Mariana",
    description: "Henrique & Mariana 2027",
    url: "https://henriquemariana.vercel.app",
    siteName: "Henrique & Mariana",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henrique & Mariana",
    description: "Henrique & Mariana 2027",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#D9B982",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased snap-mandatory snap-y ${cormorant.variable} ${lora.variable}`}
    >
      <body className={`min-h-full flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
