import { ModeToggle } from "@/components/theme-button";
import HomeButton from "@/components/small/home-button";

import HomePage from "@/pages/Home.Page"
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-fit w-screen bg-zinc-200 dark:bg-zinc-800 overflow-x-hidden">
        <HomePage />
        <div className="min-h-screen w-screen"></div>
        <div className="min-h-screen w-screen"></div>
        <div className="min-h-screen w-screen"></div>
        <div className="min-h-screen w-screen"></div>
      </div>
    </>
  );
}
