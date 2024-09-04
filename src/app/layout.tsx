import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harshit - LeonCyriac | Developer Portfolio",
  description:
    "Explore the projects and work of Harshit, a passionate developer skilled in modern web technologies like Next.js, Tailwind CSS, and TypeScript. Discover a sleek, professional portfolio showcasing innovative solutions and creative designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={`${inter.className} dark:bg-neutral-900 bg-neutral-50`}>
          <Navbar />
          <main className="pointer-events-auto">{children}
              <Toaster />
            </main>
        </body>
      </ThemeProvider>
    </html>
  );
}
