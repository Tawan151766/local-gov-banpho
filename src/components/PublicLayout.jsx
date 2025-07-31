"use client";
import Navbar from "../app/component/LandingPage/Navbar";
import Footer from "../app/component/LandingPage/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}