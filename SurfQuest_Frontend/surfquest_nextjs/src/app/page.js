/**
 * SurfQuest - Home Page (SSR)
 *
 * Server-side renders the "best surfzones for the current month" list for
 * better performance and SEO.
 */
import { API } from "@/config/api";
import { fetchSurfZones } from "@/services/surfzoneService";
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

// async function fetchSurfZones() {
//   const url = API.server.surfzones;

//   if (!url)
//     throw new Error(
//       "Missing API base URL (NEXT_PUBLIC_API_BASE_URL / API_INTERNAL_BASE_URL).",
//     );

//   const res = await fetch(url, {
//     cache: "no-store",
//     headers: { Accept: "application/json" },
//   });
//   if (!res.ok) return [];
//   return res.json();
// }

async function fetchSurfZonesLite() {
  const url = API.server.surfzones;
  if (!url) throw new Error("Missing API base URL...");
  return fetchSurfZones(url, { cache: "no-store" });
}

export default async function HomePage() {
  const currentMonth = monthNames[new Date().getMonth()];
  const zones = await fetchSurfZonesLite();

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
