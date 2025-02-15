// app/page.js

import MonthBestDestinations from "./components/MonthBestDestinations";

export const metadata = {
  title: "SurfQuest",
  description: "Plan your dream surf-trip",
};

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-start pt-20 h-screen">
        <h1 className="text-4xl font-bold">Welcome to <span className="text-white text-6xl italic grechen-fuemen-regular">Surf</span><span className="text-blue-500 text-6xl italic grechen-fuemen-regular">Q</span><span className="text-white text-6xl italic grechen-fuemen-regular">uest</span></h1>
        <p className="text-2xl mt-4 mb-10 text-blue-500">The place to find and book your <span className="text-pink-500">dream</span> surf trip!</p>
        <div className="flex flex-col items-center mt-8 justify-start bg-black text-white">
          <MonthBestDestinations />
        </div>
      </div>
    </>
  );
}