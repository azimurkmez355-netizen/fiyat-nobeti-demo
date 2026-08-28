import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { TutorialOfferModal, SpotlightOverlay } from "@/components/tutorial";
import { ToastStack } from "@/components/toast-stack";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiyat Nöbeti — Demo",
  description: "Akakçe fiyat takip panelinin herkese açık demo sürümü. Gerçek veri çekmez, örnek verilerle çalışır.",
};

const THEME_INIT = `(function(){try{var t=JSON.parse(localStorage.getItem('fn_demo_theme'));if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body suppressHydrationWarning>
        <AppProviders>
          {children}
          <ToastStack />
          <TutorialOfferModal />
          <SpotlightOverlay />
        </AppProviders>
      </body>
    </html>
  );
}
