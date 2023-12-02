"use client"
import React from "react";
import Vector from "../components/small/vector";
import { HomeIcon } from "@heroicons/react/24/solid";
import {motion} from "framer-motion"

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden relative bg-zinc-200 dark:bg-zinc-900">
        {/* <h1 className="text-9xl font-roashe">Cyber</h1> */}
        <div className="absolute z-20 bottom-36 sm:bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 w-screen">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1, type: "spring" }}
            className="flex items-center justify-between py-4 px-10 min-h-full w-full transition-all ease-in-out duration-500"
          >
            <div className="flex flex-col items-center justify-center gap-10 sm:gap-12 lg:gap-16 h-full w-full mr-24 sm:mr-40">
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-10 sm:gap-12 lg:gap-16 h-full w-full ml-24 sm:ml-40">
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
              <div className="bg-zinc-400/90 hover:bg-zinc-400 dark:bg-zinc-600/90 dark:hover:bg-zinc-600 p-6 sm:p-8 lg:p-10 rounded-full flex items-center justify-center">
                <HomeIcon className="h-6 sm:h-8 lg:h-10 text-white dark:text-white" />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 scale-50 sm:scale-75 lg:scale-90">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring", delay:0.2 }}
            className=""
          >
            <Vector />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
