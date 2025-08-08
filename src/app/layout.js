import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminAccess from "./component/AdminAccess/AdminAccess";
import SessionProvider from "../components/SessionProvider";
import LayoutContent from "../components/LayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "เทศบาลตำบลบ้านโพธิ์",
  description: "เว็บไซต์เทศบาลตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา",
  icons: {
    icon: [
      { url: "/logobanpho.png", type: "image/png" }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
