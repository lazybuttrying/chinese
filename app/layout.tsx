import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanji — HSK 1 Visual Word Game",
  description: "Learn beginner Chinese with visual hints, an HSK 1 wordbook, and clear radical explanations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
