"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="icon">
    //       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <>
      <div
        onClick={() =>
          theme == "dark" ? setTheme("light") : setTheme("dark")
        }
        className="fixed z-50 cursor-pointer h-12 w-12 p-2 rounded-full backdrop-blur flex items-center justify-center top-10 left-28 bg-white/50 dark:bg-black/50 text-black dark:text-white"
      >
        {/* {currentTheme == "dark" ? ( */}
        <Sun
          className={twMerge(
            "h-6 w-6 rotate-90 scale-0 transition-all",
            theme == "dark" && "dark:rotate-0 dark:scale-100 "
          )}
          //   onClick={() => setTheme("light")}
        />
        {/* ) : ( */}
        <Moon
          className={twMerge(
            "absolute h-6 w-6 rotate-0 scale-100 transition-all ",
            currentTheme == "dark" && "dark:-rotate-90 dark:scale-0"
          )}
          //   onClick={() => setTheme("dark")}
        />
        {/* )} */}
      </div>
    </>
  );
}
