import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/custom/Header";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Toaster } from "@/components/custom/Toaster";
import Footer from "@/components/custom/Footer";
import { montserrat } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "AxomShiksha - Study Materials, Notes & Learning Resources",
  description:
    "Study materials, notes, and helpful learning resources for students in Assam. AxomShiksha empowers learners with simple, clear, and useful educational content.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className} suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <Header />
            {children}
            <Footer />
          </main>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
