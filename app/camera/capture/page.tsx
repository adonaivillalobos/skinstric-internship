"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";
import Header from "../../../components/Header";
import SideButton from "../../../components/SideButton";

const API_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

const TIPS = ["Neutral expression", "Frontal pose", "Adequate lighting"];

export default function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"starting" | "live" | "error">(
    "starting"
  );
  const [photo, setPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Turn the camera on when the page opens, and off when it closes
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera not supported");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus("live");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Copy the current video frame into an image
  function takePicture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
  }

  // Send the photo to the same Phase 2 API used by the gallery option
  async function usePhoto() {
    setUploading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo.split(",")[1] }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      localStorage.setItem("demographics", JSON.stringify(result.data));

      setUploading(false);
      alert("Image analyzed successfully!");
      router.push("/select");
    } catch {
      setUploading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      <div className="absolute inset-x-0 bottom-0 top-18 bg-black">
        {/* Live camera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${
            status === "live" ? "" : "invisible"
          }`}
        />

        {/* Captured photo */}
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Captured"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Camera blocked or not available */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white px-6 text-center text-[#1a1b1c]">
            <p className="text-sm font-semibold uppercase">
              We could not access your camera
            </p>
            <p className="text-sm uppercase text-gray-500">
              Allow camera access in your browser, or go back and upload a
              photo from your gallery.
            </p>
          </div>
        )}

        {/* Live controls */}
        {status === "live" && !photo && (
          <>
            <div className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center gap-4 text-white">
              <span className="text-sm font-semibold uppercase">
                Take picture
              </span>
              <button
                type="button"
                onClick={takePicture}
                aria-label="Take picture"
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white"
              >
                <FiCamera size={28} />
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 px-4 text-center text-white">
              <p className="text-sm uppercase">
                To get better results make sure to have
              </p>
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm uppercase">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-center gap-2">
                    <span className="h-2 w-2 rotate-45 border border-white" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Preview controls */}
        {photo && (
          <>
            <p className="absolute left-1/2 top-1/3 -translate-x-1/2 text-sm uppercase text-white">
              Great shot!
            </p>

            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-4 text-white">
              <p className="text-lg font-semibold">Preview</p>
              {error && (
                <p className="bg-white px-3 py-1 text-sm uppercase text-red-600">
                  {error}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  disabled={uploading}
                  className="bg-gray-200 px-6 py-3 text-sm text-[#1a1b1c]"
                >
                  Retake
                </button>
                <button
                  type="button"
                  onClick={usePhoto}
                  disabled={uploading}
                  className="bg-[#1a1b1c] px-6 py-3 text-sm text-white"
                >
                  Use This Photo
                </button>
              </div>
            </div>
          </>
        )}

        {/* Upload loading screen */}
        {uploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white text-[#1a1b1c]">
            <p className="text-xl font-semibold uppercase">
              Preparing your analysis...
            </p>
            <div className="mt-6 flex gap-4">
              <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500" />
            </div>
          </div>
        )}

        {/* Back button */}
        <div
          className={`absolute bottom-6 left-8 z-10 ${
            status === "error" ? "text-[#1a1b1c]" : "text-white"
          }`}
        >
          <SideButton label="Back" direction="left" href="/result" />
        </div>
      </div>
    </main>
  );
}