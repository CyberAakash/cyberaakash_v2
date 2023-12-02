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
          <Link
            href="/dashboard"
            className="absolute flex items-center justify-center left-1/2 -translate-x-1/2 lg:left-[24%] lg:top-[43.5%] hover:lg:left-[24.5%] hover:left-[51%] text-white/70 hover:animate-none hover:text-text/95 p-2 font-winchester text-4xl hover:border-2 border-white transition-all duration-100 ease-linear"
          >
            Go to Dashboard
          </Link>
          <Spline scene="https://prod.spline.design/2iQaJ8VtqLe8zZPf/scene.splinecode" />
        </Suspense>
      </div>
    </>
  );
};

export default MySplineHome;
