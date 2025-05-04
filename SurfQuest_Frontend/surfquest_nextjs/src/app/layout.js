// app/page.js

import './globals.css';
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";


export const metadata = {
  title: 'SurfQuest',
  description: 'Plan your dream surf-trip',
};

export default function RootLayout({ children }) {
  
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  console.log(`Environment: ${environment}`);

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}