"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiImage } from "react-icons/fi";
import Header from "../../components/Header";
import SideButton from "../../components/SideButton";

const API_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export default function ResultPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCameraPrompt, setShowCameraPrompt] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      uploadImage(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage(base64: string) {
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      localStorage.setItem("demographics", JSON.stringify(result.data));

      setLoading(false);
      alert("Image analyzed successfully!");
      router.push("/select");
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try another image.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      <p className="absolute left-8 top-24 text-sm font-semibold uppercase">
        To start analysis
      </p>

      {/* Preview box */}
      <div className="absolute right-6 top-24 z-30 md:right-8">
        <p className="mb-2 text-sm">Preview</p>
        <div className="h-24 w-24 overflow-hidden border border-gray-300 bg-white md:h-40 md:w-40">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Selected preview"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Camera option (Phase 3) */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 md:left-[25%] md:top-1/2">
        {/* Tilted dotted squares: slowly rotating clockwise */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 md:h-80 md:w-80">
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
            style={{ rotate: "8deg", animationDuration: "40s" }}
          />
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-400"
            style={{ rotate: "20deg", animationDuration: "32s" }}
          />
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
            style={{ rotate: "32deg", animationDuration: "24s" }}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowCameraPrompt(true)}
          disabled={loading}
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#1a1b1c]"
        >
          <FiCamera size={40} />
        </button>
        <p className="absolute left-1/2 top-full mt-6 w-48 -translate-x-1/2 text-center text-sm uppercase md:-top-8 md:left-24 md:mt-0 md:w-40 md:translate-x-0 md:text-left">
          Allow A.I. to scan your face
        </p>
      </div>

      {/* Gallery option (Phase 2) */}
      <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 md:left-[75%] md:top-1/2">
        {/* Tilted dotted squares: slowly rotating clockwise */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 md:h-80 md:w-80">
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
            style={{ rotate: "8deg", animationDuration: "40s" }}
          />
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-400"
            style={{ rotate: "20deg", animationDuration: "32s" }}
          />
          <div
            className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
            style={{ rotate: "32deg", animationDuration: "24s" }}
          />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#1a1b1c]"
        >
          <FiImage size={40} />
        </button>
        <p className="absolute left-1/2 top-full mt-6 w-48 -translate-x-1/2 text-center text-sm uppercase md:-bottom-10 md:left-auto md:right-24 md:top-auto md:mt-0 md:w-40 md:translate-x-0 md:text-right">
          Allow A.I. access gallery
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Camera permission box: centered on phones, next to the camera on desktop */}
      {showCameraPrompt && (
        <div className="absolute left-1/2 top-1/2 z-40 w-[80vw] max-w-72 -translate-x-1/2 -translate-y-1/2 bg-[#1a1b1c] text-white md:left-[calc(25%+64px)] md:top-[calc(50%+64px)] md:w-72 md:max-w-none md:translate-x-0 md:translate-y-0">
          <p className="px-5 pb-10 pt-5 text-sm font-semibold uppercase">
            Allow A.I. to access your camera
          </p>
          <div className="flex justify-end gap-6 border-t border-gray-600 px-5 py-3 text-sm uppercase">
            <button
              type="button"
              onClick={() => setShowCameraPrompt(false)}
              className="text-gray-400 hover:text-white"
            >
              Deny
            </button>
            <button
              type="button"
              onClick={() => router.push("/camera")}
              className="font-semibold"
            >
              Allow
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-sm uppercase text-red-600">
          {error}
        </p>
      )}

      {/* Loading screen */}
      {loading && (
        <div className="absolute inset-x-0 bottom-28 top-32 z-20 flex flex-col items-center justify-center bg-white">
          {/* Tilted dotted squares: slowly rotating clockwise */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 md:h-96 md:w-96">
            <div
              className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
              style={{ rotate: "8deg", animationDuration: "40s" }}
            />
            <div
              className="spin-clockwise absolute inset-0 border border-dotted border-gray-400"
              style={{ rotate: "20deg", animationDuration: "32s" }}
            />
            <div
              className="spin-clockwise absolute inset-0 border border-dotted border-gray-300"
              style={{ rotate: "32deg", animationDuration: "24s" }}
            />
          </div>

          <p className="relative px-4 text-center text-xl font-semibold uppercase">
            Preparing your analysis...
          </p>
          <div className="relative mt-6 flex gap-4">
            <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500" />
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="absolute bottom-10 left-8">
        <SideButton label="Back" direction="left" href="/testing" />
      </div>
    </main>
  );
}