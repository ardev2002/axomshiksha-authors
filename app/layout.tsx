import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/custom/Header";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { Toaster } from "@/components/custom/Toaster";
import Footer from "@/components/custom/Footer";
import UserProvider from "@/components/custom/UserProvider";
import { getSession } from "@/utils/helpers/getSession";
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
  const sessionPromise = getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          <UserProvider sessionPromise={sessionPromise}>
            <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
              <Header sessionPromise={sessionPromise} />
              {children}
              <Footer />
            </main>
          </UserProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
