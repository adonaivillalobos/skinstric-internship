"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";
import Header from "../../components/Header";

const TIPS = ["Neutral expression", "Frontal pose", "Adequate lighting"];

export default function CameraPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/camera/capture");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      {/* Dotted diamonds */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-dotted border-gray-400" />
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-104 w-104 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-dotted border-gray-300" />
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-md w-md -translate-x-1/2 -translate-y-1/2 rotate-45 border border-dotted border-gray-200" />

      {/* Camera icon and text */}
      <div className="absolute left-1/2 top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gray-400">
          <FiCamera size={40} />
        </div>
        <p className="text-sm font-semibold uppercase">Setting up camera ...</p>
      </div>

      {/* Tips */}
      <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-4 px-4 text-center">
        <p className="text-sm uppercase">To get better results make sure to have</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm uppercase">
          {TIPS.map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 border border-[#1a1b1c]" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}