"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SystemLoader from "@/components/ui/SystemLoader";

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleComplete = () => {
    setIsFirstLoad(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading: isFirstLoad, setIsLoading: setIsFirstLoad }}>
      <AnimatePresence mode="wait">
        {isFirstLoad && <SystemLoader key="loader" onComplete={handleComplete} />}
      </AnimatePresence>
      <div 
        className="w-full"
        style={{ 
          visibility: isFirstLoad ? "hidden" : "visible",
          position: isFirstLoad ? "fixed" : "relative"
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
