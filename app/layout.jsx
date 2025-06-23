import { Geist, Geist_Mono } from "next/font/google";
 import InruptClient from "../components/InruptClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <main className="grid grid-cols-12 p-5">
          <InruptClient />
          {children}
        </main>
      </body>
    </html>
  );
}
