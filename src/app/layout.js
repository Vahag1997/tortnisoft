import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI CLOUD SOLUTIONS – Software Development Company",
  description:
    "AI CLOUD SOLUTIONS builds modern mobile apps, AI-powered tools, and scalable digital solutions for startups and enterprises.",
  keywords:
    "AI CLOUD SOLUTIONS, software development, mobile apps, AI tools, React Native, Next.js, app agency, cloud solutions",
  authors: [{ name: "AI CLOUD SOLUTIONS", url: "https://tortnisoft.com" }],
  creator: "AI CLOUD SOLUTIONS",
  themeColor: "#ffffff",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
