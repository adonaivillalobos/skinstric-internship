"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiImage } from "react-icons/fi";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

const API_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export default function ResultPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <div className="absolute right-8 top-24 z-30 hidden md:block">
        <p className="mb-2 text-sm">Preview</p>
        <div className="h-40 w-40 overflow-hidden border border-gray-300 bg-white">
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
      <div className="absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-8 border border-dotted border-gray-300" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-20 border border-dotted border-gray-400" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-32 border border-dotted border-gray-300" />

        <button
          type="button"
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#1a1b1c]"
        >
          <FiCamera size={40} />
        </button>
        <p className="absolute -top-8 left-24 w-40 text-sm uppercase">
          Allow A.I. to scan your face
        </p>
      </div>

      {/* Gallery option (Phase 2) */}
      <div className="absolute left-[75%] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-8 border border-dotted border-gray-300" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-20 border border-dotted border-gray-400" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rotate-32 border border-dotted border-gray-300" />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#1a1b1c]"
        >
          <FiImage size={40} />
        </button>
        <p className="absolute -bottom-10 right-24 w-40 text-right text-sm uppercase">
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

      {/* Error message */}
      {error && (
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-sm uppercase text-red-600">
          {error}
        </p>
      )}

      {/* Loading screen */}
      {loading && (
        <div className="absolute inset-x-0 bottom-28 top-32 z-20 flex flex-col items-center justify-center bg-white">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rotate-8 border border-dotted border-gray-300" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rotate-20 border border-dotted border-gray-400" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rotate-32 border border-dotted border-gray-300" />

          <p className="relative text-xl font-semibold uppercase">
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