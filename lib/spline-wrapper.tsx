// Local wrapper that re-exports @splinetool/react-spline using the base export
// This avoids the ./next subpath resolution issue across both webpack and Turbopack
"use client";

export { default } from "@splinetool/react-spline";
