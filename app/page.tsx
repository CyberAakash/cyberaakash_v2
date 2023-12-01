import { ModeToggle } from "@/components/theme-button";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen bg-zinc-200 dark:bg-zinc-800">
        {/* <Button>Click me</Button> */}
        <ModeToggle />
        <h1 className="text-9xl font-winchester">CyberAakash</h1>
      </div>
    </>
  );
}
