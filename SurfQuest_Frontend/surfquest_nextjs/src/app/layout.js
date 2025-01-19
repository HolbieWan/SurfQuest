// app/page.js

import './globals.css';
import Navbar from "./components/Navbar";

export const metadata = {
  title: 'SurfQuest',
  description: 'Plan your dream surf-trip',
};

export default function RootLayout({ children }) {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const environment = process.env.ENVIRONMENT;
  console.log(`API URL: ${apiUrl}`);
  console.log(`Environment: ${environment}`);

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}