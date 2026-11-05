import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KolabZ — Where Creators & Brands Collaborate",
  description:
    "KolabZ connects creators with brands for meaningful collaborations, campaigns, and opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}