// app/page.js

import './globals.css'; // Global CSS MUST be imported her
import Navbar from "./components/Navbar";

export const metadata = {
  title: 'SurfQuest',
  description: 'Plan your dream surf-trip',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}