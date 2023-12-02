import React from "react";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";

const HomeButton = () => {
  return (
    <>
      <Link href="/" className="cursor-pointer h-12 w-12 p-2 rounded-full backdrop-blur flex items-center justify-center bg-white/50 dark:bg-black/50 text-black dark:text-white">
        <HomeIcon className="h-full w-full text-black dark:text-white" />
      </Link>
    </>
  );
};

export default HomeButton;
