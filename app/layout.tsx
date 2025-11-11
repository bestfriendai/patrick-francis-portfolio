import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
  display: 'swap', // Use font-display: swap for faster initial render
  preload: true,
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
  display: 'swap', // Use font-display: swap for faster initial render
  preload: true,
});

export const metadata: Metadata = {
  title: "Patrick Francis | DontFollowPat | TrapPat - Entrepreneur, App Developer & Author",
  description: "Patrick Francis (DontFollowPat, TrapPat) - Entrepreneur, App Developer, and Author. Creator of PATS APPS including PrayAI and FakeFlex. Contact: Contact@DontFollowPat.com",
  keywords: "Patrick Francis, DontFollowPat, TrapPat, Trap Pat, Don't Follow Pat, Entrepreneur, App Developer, Author, PrayAI, FakeFlex, PATS APPS, Frontend Engineer, React Developer, Three.js, Mobile Apps, iOS Developer, Android Developer, Creative Developer, Web Development, JavaScript, TypeScript, Portfolio, Software Engineer, Tech Entrepreneur",
  authors: [{ name: "Patrick Francis" }, { name: "DontFollowPat" }, { name: "TrapPat" }],
  creator: "Patrick Francis (DontFollowPat)",
  publisher: "Patrick Francis",
  alternates: {
    canonical: "https://dontfollowpat.com",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "Patrick Francis | DontFollowPat | TrapPat - Entrepreneur & App Developer",
    description: "Entrepreneur, App Developer, and Author. Creator of PrayAI and FakeFlex. Building the future of mobile apps.",
    url: "https://dontfollowpat.com",
    siteName: "Patrick Francis (DontFollowPat)",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://dontfollowpat.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Patrick Francis - DontFollowPat - Entrepreneur and App Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Francis | DontFollowPat | TrapPat",
    description: "Entrepreneur, App Developer, and Author. Creator of PrayAI and FakeFlex.",
    site: "@DontFollowPat",
    creator: "@DontFollowPat",
    images: ["https://dontfollowpat.com/og-image.png"],
  },
  verification: {
    google: "GsRYY-ivL0F_VKkfs5KAeToliqz0gCrRAJKKmFkAxBA",
  },
  other: {
    "contact:email": "Contact@DontFollowPat.com",
    "brand": "DontFollowPat, TrapPat, Patrick Francis",
    "category": "Technology, Entrepreneurship, Software Development",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5, // Allow zoom for better quality viewing
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Patrick Francis",
    "alternateName": ["DontFollowPat", "TrapPat", "Trap Pat"],
    "jobTitle": "Entrepreneur, App Developer, and Author",
    "description": "Entrepreneur, App Developer, and Author. Creator of PATS APPS including PrayAI and FakeFlex.",
    "url": "https://dontfollowpat.com",
    "email": "Contact@DontFollowPat.com",
    "image": "https://dontfollowpat.com/og-image.png",
    "sameAs": [
      "https://dontfollowpat.com",
      "https://twitter.com/DontFollowPat"
    ],
    "knowsAbout": [
      "Software Development",
      "Mobile App Development",
      "Web Development",
      "Entrepreneurship",
      "React",
      "Three.js",
      "JavaScript",
      "TypeScript"
    ],
    "brand": {
      "@type": "Brand",
      "name": "DontFollowPat",
      "alternateName": "TrapPat"
    }
  };

  return (
    <html lang="en" className="overscroll-y-none">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Inline critical CSS for immediate paint */}
        <style dangerouslySetInnerHTML={{ __html: `
          body{margin:0;overscroll-behavior:none;background:#000;color:#fff}
          *{-webkit-user-select:none;user-select:none}
          .loader-fallback{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(to bottom,#000814,#001d3d,#000814);color:#00d9ff;font-family:monospace;z-index:9999}
        ` }} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={'G-7WD4HM3XRE'}/>
    </html>
  );
}
