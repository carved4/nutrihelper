import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Header } from "../components/header";
import { ThemeProvider } from "../components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nutrition Tracker",
  description: "Track your nutrition and health goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header />
            <main className="pt-16">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
