import localFont from 'next/font/local'
import "./globals.css"
import { Analytics } from '@vercel/analytics/next'
import IosZoomFix from '@/app/utils/iosZoomFix';
import { ThemeProvider } from '@/app/context/ThemeContext'
import ThemeToggle from '@/app/component/ThemeToggle'
import ContactMenu from '@/app/component/ContactMenu'
import ErrorBoundary from '@/app/utils/ErrorBoundary'

export const metadata = {
  title: "Pelvix AI",
  description: "your digital bestfriend - Pelvix AI"
};

const monoSpaced = localFont({
  weight: '100 900',
  src: [
    {
      path: '../app/assets/GeistMono-VariableFont_wght.ttf'
    }
  ],
  variable: '--geistMono',
  display: 'swap',
  preload: true,
  fallback: ['Monaco', 'Menlo', 'Consolas', 'Courier New', 'monospace']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${monoSpaced.variable}`} >
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <ContactMenu />
            <ThemeToggle />
            {children}
            <Analytics />
            <IosZoomFix />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
