/**
 * Root Layout for the SurfQuest Application
 *
 * This component wraps every page of the app with global layout elements,
 * including the Navbar, Footer, and global styles. It also handles environment
 * logging and applies shared page styling.
 *
 * This layout component is required by the Next.js App Router.
 */

// ============================
// Global Styles Import
// ============================
import '@/styles/globals.css';

// ============================
// Shared Layout Components
// ============================
import Navbar from "@/components/Common/Navbar";
import ScrollToTop from "@/components/Common/ScrollToTop";
import Footer from "@/components/Common/Footer";

// ============================
// SEO Metadata
// ============================
export const metadata = {
  title: 'SurfQuest',
  description: 'Plan your dream surf-trip',
};

// ============================
// Root Layout Component
// ============================
export default function RootLayout({ children }) {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  console.log(`Environment: ${environment}`);  // Log the current environment (dev, staging, prod)

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">
        {/* Persistent navigation bar */}
        <Navbar />

        {/* Main page content injected here */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Scroll-to-top behavior and footer */}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}