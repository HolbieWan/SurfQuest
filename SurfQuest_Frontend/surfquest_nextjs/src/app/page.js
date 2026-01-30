// /**
//  * SurfQuest - Home Page
//  *
//  * This is the main landing page of the SurfQuest application.
//  * It sets the SEO metadata and renders the MonthBestDestinations component,
//  * which displays surf zones based on the current month.
//  *
//  * The page layout uses TailwindCSS for responsive and centered styling.
//  */

// // ============================
// // Local Component Imports
// // ============================
// import MonthBestDestinations from "@/components/SurfZones/MonthBestDestinations";

// // ============================
// // Page Metadata (SEO)
// // ============================
// export const metadata = {
//   title: "SurfQuest",
//   description: "Plan your dream surf-trip",
// };

// // ============================
// // Main Page Component
// // ============================
// export default function HomePage() {
//   return (
//     <>
//       <div className="flex flex-col items-center justify-start min-h-screen">
//         {/* Hero section placeholder - can be activated if needed */}
//         {/* <div className="bg-white w-full flex flex-col items-center p-4 ">
//           <h1 className="text-4xl font-bold text-black">
//             Welcome to <span className="text-black text-6xl italic grechen-fuemen-regular">Surf</span>
//             <span className="text-blue-500 text-6xl italic grechen-fuemen-regular">Q</span>
//             <span className="text-black text-6xl italic grechen-fuemen-regular">uest</span>
//           </h1>
//           <p className="text-2xl mt-4 mb-10 text-blue-500">
//             The place to find and book your <span className="text-pink-500">dream</span> surf trip!
//           </p>
//         </div> */}

//         {/* Main content container */}
//         <div className="flex flex-col items-center mt-8 justify-start bg-black text-white">
//           <MonthBestDestinations />
//         </div>
//       </div>
//     </>
//   );
// }

/**
 * SurfQuest - Home Page (SSR)
 *
 * Server-side renders the "best surfzones for the current month" list for
 * better performance and SEO.
 */
import { API } from "@/config/api";
import MonthBestDestinations from "@/components/SurfZones/MonthBestDestinations";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function fetchSurfZones() {
  const url = API.server.surfzones;

  if (!url)
    throw new Error(
      "Missing API base URL (NEXT_PUBLIC_API_BASE_URL / API_INTERNAL_BASE_URL).",
    );

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const currentMonth = monthNames[new Date().getMonth()];
  const zones = await fetchSurfZones();

  const monthlyZones = Array.isArray(zones)
    ? zones.filter(
        (z) =>
          Array.isArray(z.best_months) && z.best_months.includes(currentMonth),
      )
    : [];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="flex flex-col items-center mt-8 justify-start bg-black text-white w-full">
        <MonthBestDestinations
          currentMonth={currentMonth}
          initialZones={monthlyZones}
        />
      </div>
    </div>
  );
}