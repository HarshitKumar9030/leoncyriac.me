import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/common/Footer";
import ProgressiveScrollBlur from "@/components/common/scroll-blur";
import Providers from "./Providers";
import MusicWidget from "@/components/music/music-widget";
import QuizBanner from "@/components/quiz/QuizBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Harshit - LeonCyriac",
  description:
    "Dive into the digital realm of Harshit, a passionate full-stack developer and UI/UX enthusiast. Explore a showcase of innovative projects, cutting-edge web technologies, and creative solutions that push the boundaries of modern web development.",
  openGraph: {
    title: "Harshit | Crafting Digital Experiences with Code & Creativity",
    description: "Explore the innovative projects and creative solutions by Harshit, a full-stack developer passionate about modern web technologies.",
    url: "https://leoncyriac.me",
    siteName: "Harshit's Digital Playground",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@OhHarshit",
    creator: "@OhHarshit",
  },
  alternates: {
    canonical: "https://leoncyriac.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harshit",
              url: "https://leoncyriac.me",
              sameAs: [
                "https://github.com/harshitkumar9030",
                "https://twitter.com/OhHarshit",
                "https://dribbble.com/leoncyriac",
                "https://youtube.com/@leoncyriac",
                "https://instagram.com/_harshit.xd"
              ],
              jobTitle: "Full-Stack Developer",
              knowsAbout: ["Next.js", "Tailwind CSS", "TypeScript", "UI/UX Design", "Web Development"],
              nationality: {
                "@type": "Country",
                name: "India"
              }
            })
          }}
        />
      </head>
      <Providers>
        <body
          className={`${inter.variable} ${inter.className} antialiased dark:bg-neutral-900 bg-neutral-50`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QuizBanner />
            <Navbar />
            <main className="pointer-events-auto">
              <ProgressiveScrollBlur>
                {children}
              </ProgressiveScrollBlur>
              <MusicWidget />
              <Toaster />
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}