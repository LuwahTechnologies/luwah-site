import type { Metadata } from "next";
import { Montserrat, Open_Sans, JetBrains_Mono, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/structuredData";
import { AccessibilityWidget } from "@/components/a11y/AccessibilityWidget";
import { ReadingOverlays } from "@/components/a11y/ReadingOverlays";
import { ImageDescriptions } from "@/components/a11y/ImageDescriptions";
import { TextMagnifier } from "@/components/a11y/TextMagnifier";
import { HiddenImageAltText } from "@/components/a11y/HiddenImageAltText";
import { MuteSounds } from "@/components/a11y/MuteSounds";
import { ReadMode } from "@/components/a11y/ReadMode";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-display",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-mono",
});

// Drives the accessibility widget's "Readable font" toggle only. Designed
// by the Braille Institute for low-vision readers. Self-hosted at build
// like the other three, so turning the toggle on costs no extra request.
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: {
    default: "Luwah Technologies",
    template: "%s | Luwah Technologies",
  },
  description:
    "Custom automation, data insights, and workflow solutions for small businesses. n8n, Python, and AI-powered. Free consultation. Aurora, CO.",
  metadataBase: new URL("https://luwahtechnologies.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Luwah Technologies",
    title: "Luwah Technologies | Small Business Automation",
    description:
      "Eliminate repetitive tasks and streamline your operations with custom business process automation services.",
    images: [
      {
        url: "/images/sharing-img-logo.jpg",
        width: 869,
        height: 976,
        alt: "Luwah Technologies",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Luwah Technologies | Small Business Automation",
    description:
      "Custom automation for small businesses. n8n, Python, AI-powered. Free consultation.",
    images: ["/images/sharing-img-logo.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/images/logo-favicon.png",
    apple: "/images/logo-favicon.png",
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
      className={`${montserrat.variable} ${openSans.variable} ${jetbrainsMono.variable} ${atkinson.variable}`}
    >
      <body>
        <JsonLd data={organizationSchema} />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {/* Wraps everything except the accessibility widget and its
            overlays, so the widget's saturation and inverted-contrast
            filters (globals.css, scoped to #a11y-page-content) never
            gray out or invert the widget's own controls. Read mode and
            the text magnifier sit outside for the same reason: they must
            stay legible and correctly positioned whatever theme state the
            page is in. */}
        <div id="a11y-page-content">
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <AccessibilityWidget />
        <ReadingOverlays />
        <ImageDescriptions />
        <TextMagnifier />
        <HiddenImageAltText />
        <MuteSounds />
        <ReadMode />
      </body>
    </html>
  );
}
