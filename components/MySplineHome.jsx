"use client";
import React, { Suspense } from "react";
// import Spline from "@splinetool/react-spline";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import Link from "next/link"
const MySplineHome = () => {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-black relative">
        <Suspense
          fallback={
            <div className="text-white flex items-center justify-center w-full h-screen font-roashe text-5xl">
              Loading{" "}
            </div>
          }
        >
          <Spline scene="https://prod.spline.design/2iQaJ8VtqLe8zZPf/scene.splinecode" />
          <Link
            href="/dashboard"
            className="absolute flex items-center justify-center w-full sm:w-fit top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  hover:left-[51%] hover:top-[51%] text-white/70 hover:animate-none hover:text-black/95 p-4 text-4xl hover:bg-white/70 font-roashe transition-all duration-100 ease-linear"
          >
            Go to Dashboard
          </Link>
        </Suspense>
      </div>
    </>
  );
};

export default MySplineHome;
