// app/page.js

import SurfZones from "./components/SurfZones";

export const metadata = {
  title: "SurfQuest",
  description: "Plan your dream surf-trip",
};

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-start pt-20 h-screen">
        <h1 className="text-4xl font-bold">Welcome to SurfQuest</h1>
        <p className="text-2xl mt-8">The place to find and book your dream surf trip!</p>
        <div className="flex flex-col items-center justify-start pt-16 bg-black text-white">
          <SurfZones />
        </div>
      </div>
    </>
  );
}