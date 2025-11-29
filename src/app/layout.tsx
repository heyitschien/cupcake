import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cupcake Designer",
  description: "Design your perfect cupcake!",
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

