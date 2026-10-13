"use client";

import { useState } from "react";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

const isValidText = (value: string) =>
  /^[A-Za-zÀ-ÿ\s'-]+$/.test(value.trim());

export default function TestingPage() {
  const [step, setStep] = useState<"name" | "location">("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [showError, setShowError] = useState(false);

  const value = step === "name" ? name : location;
  const valid = isValidText(value);

  function handleChange(newValue: string) {
    setShowError(false);
    if (step === "name") setName(newValue);
    else setLocation(newValue);
  }

  function handleProceed() {
    if (!valid) {
      setShowError(true);
      return;
    }

    if (step === "name") {
      localStorage.setItem("name", name.trim());
      setStep("location");
    } else {
      localStorage.setItem("location", location.trim());
      // Next step: send name + location to the API
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

      {/* Input */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
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
          className="w-[90%] max-w-3xl border-b border-[#1a1b1c] bg-transparent text-center text-5xl font-light tracking-tighter outline-none placeholder:text-gray-500 md:text-7xl"
        />
        {showError && (
          <p className="mt-4 text-sm text-red-600">
            Please enter a valid {step} using letters only (no numbers or
            symbols).
          </p>
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
              setStep("name");
            }}
          />
        )}
      </div>

      {/* Proceed button */}
      <div className="absolute bottom-10 right-8">
        <SideButton label="Proceed" direction="right" onClick={handleProceed} />
      </div>
    </main>
  );
}