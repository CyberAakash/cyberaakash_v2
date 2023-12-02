import { ModeToggle } from "@/components/theme-button";
import HomePage from "@/pages/Home.Page"
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen h-fit w-screen bg-zinc-200 dark:bg-zinc-800 overflow-x-hidden">
        {/* <Button>Click me</Button> */}
        <ModeToggle />
        {/* <h1 className="text-9xl font-roashe">CyberAakash</h1> */}
        <HomePage />
        <div className="min-h-screen w-screen"></div>
      </div>
    </>
  );
}
