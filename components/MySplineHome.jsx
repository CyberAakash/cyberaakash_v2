"use client";
import React, { Suspense } from "react";
// import Spline from "@splinetool/react-spline";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import Link from "next/link"
const MySplineHome = () => {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-black relative">
        <Link href="/dashboard" className="absolute left-[18%] top-[45%] text-white/70 animate-pulse hover:animate-none hover:text-white/95 font-winchester text-4xl">Go to Dashboard</Link>
        <Suspense fallback={<div className="text-white flex items-center justify-center w-full h-screen font-roashe text-5xl">Loading </div>}>
        <Spline scene="https://prod.spline.design/2iQaJ8VtqLe8zZPf/scene.splinecode" />
        </Suspense>
      </div>
    </>
  );
};

export default MySplineHome;
