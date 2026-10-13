"use client";

import { useState } from "react";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

const API_URL =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";

const isValidText = (value: string) =>
  /^[A-Za-zÀ-ÿ\s'-]+$/.test(value.trim());

export default function TestingPage() {
  const [step, setStep] = useState<"name" | "location" | "success">("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const value = step === "name" ? name : location;
  const valid = isValidText(value);

  function handleChange(newValue: string) {
    setShowError(false);
    setApiError("");
    if (step === "name") setName(newValue);
    else setLocation(newValue);
  }

  async function handleProceed() {
    if (loading || step === "success") return;

    if (!valid) {
      setShowError(true);
      return;
    }

    if (step === "name") {
      localStorage.setItem("name", name.trim());
      setStep("location");
      return;
    }

    // Location step: save locally and send both values to the API
    localStorage.setItem("location", location.trim());
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStep("success");
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      <p className="absolute left-8 top-24 text-xs font-semibold uppercase">
        To start analysis
      </p>

      {/* Tilted dotted squares */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rotate-8 border border-dotted border-gray-300" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rotate-20 border border-dotted border-gray-400" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rotate-32 border border-dotted border-gray-300" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {step === "success" ? (
          <div className="text-center">
            <h2 className="text-5xl font-light tracking-tighter md:text-7xl">
              Thank you!
            </h2>
            <p className="mt-4 text-sm uppercase text-gray-500">
              Proceed to the next step
            </p>
          </div>
        ) : (
          <>
            <label
              htmlFor="field"
              className="mb-2 text-sm uppercase tracking-wide text-gray-400"
            >
              Click to type
            </label>
            <input
              key={step}
              id="field"
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleProceed();
              }}
              placeholder={
                step === "name" ? "Introduce Yourself" : "Where are you from?"
              }
              autoFocus={step === "location"}
              disabled={loading}
              className="w-[90%] max-w-3xl border-b border-[#1a1b1c] bg-transparent text-center text-5xl font-light tracking-tighter outline-none placeholder:text-gray-500 md:text-7xl"
            />
            {showError && (
              <p className="mt-4 text-sm text-red-600">
                Please enter a valid {step} using letters only (no numbers or
                symbols).
              </p>
            )}
            {apiError && (
              <p className="mt-4 text-sm text-red-600">{apiError}</p>
            )}
            {loading && (
              <p className="mt-4 text-sm uppercase text-gray-500">
                Processing submission...
              </p>
            )}
          </>
        )}
      </div>

      {/* Back button */}
      <div className="absolute bottom-10 left-8">
        {step === "name" ? (
          <SideButton label="Back" direction="left" href="/" />
        ) : (
          <SideButton
            label="Back"
            direction="left"
            onClick={() => {
              setShowError(false);
              setApiError("");
              setStep(step === "success" ? "location" : "name");
            }}
          />
        )}
      </div>

      {/* Proceed button */}
      {step !== "success" && (
        <div className="absolute bottom-10 right-8">
          <SideButton
            label="Proceed"
            direction="right"
            onClick={handleProceed}
          />
        </div>
      )}
    </main>
  );
}