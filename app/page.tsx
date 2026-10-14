"use client";

import { useState } from "react";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

export default function Home() {
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);

  // Heading slides toward the side of the button that disappears
  const headingShift =
    hovered === "right" ? "-18vw" : hovered === "left" ? "18vw" : "0px";

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      {/* Left dotted diamond: fades out when the right button is hovered */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-dotted border-gray-400"
        style={{
          opacity: hovered === "right" ? 0 : 1,
          transition: "opacity 500ms ease",
        }}
      />

      {/* Right dotted diamond: fades out when the left button is hovered */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-125 w-125 -translate-y-1/2 translate-x-1/2 rotate-45 border border-dotted border-gray-400"
        style={{
          opacity: hovered === "left" ? 0 : 1,
          transition: "opacity 500ms ease",
        }}
      />

      {/* Heading */}
      <h1 className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-7xl font-light leading-none tracking-tighter md:text-9xl">
        <span
          style={{
            display: "block",
            transform: `translateX(${headingShift})`,
            transition: "transform 700ms ease-out",
          }}
        >
          Sophisticated
          <br />
          skincare
        </span>
      </h1>

      {/* Left button: fades out when the right one is hovered */}
      <div
        onMouseEnter={() => setHovered("left")}
        onMouseLeave={() => setHovered(null)}
        className="absolute left-[6%] top-1/2 z-10 -translate-y-1/2"
        style={{
          opacity: hovered === "right" ? 0 : 1,
          pointerEvents: hovered === "right" ? "none" : "auto",
          transition: "opacity 500ms ease",
        }}
      >
        <SideButton label="Discover A.I." direction="left" />
      </div>

      {/* Right button: fades out when the left one is hovered */}
      <div
        onMouseEnter={() => setHovered("right")}
        onMouseLeave={() => setHovered(null)}
        className="absolute right-[6%] top-1/2 z-10 -translate-y-1/2"
        style={{
          opacity: hovered === "left" ? 0 : 1,
          pointerEvents: hovered === "left" ? "none" : "auto",
          transition: "opacity 500ms ease",
        }}
      >
        <SideButton label="Take test" direction="right" href="/testing" />
      </div>

      <p className="absolute bottom-10 left-8 max-w-xs text-xs uppercase">
        Skinstric developed an A.I. that creates a highly-personalized routine
        tailored to what your skin needs.
      </p>
    </main>
  );
}