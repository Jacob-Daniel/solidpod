"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Login from "../components/Login";
// import FileUpload from "../components/FileUpload";
// import FileViewer from "../components/FileViewer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={``}>
        <main className="grid grid-cols-12 p-5 gap-y-10 w-full ">
          {children}
        </main>
      </body>
    </html>
  );
}
