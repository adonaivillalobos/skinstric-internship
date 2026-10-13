"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

type Scores = Record<string, number>;

type Demographics = {
  race: Scores;
  age: Scores;
  gender: Scores;
};

const CATEGORIES = [
  { key: "race", label: "Race" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Sex" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Reading from localStorage (the saved data never changes on this page,
// so there is nothing to subscribe to)
const subscribe = () => () => {};
const getSnapshot = () => localStorage.getItem("demographics");
const getServerSnapshot = () => undefined; // the server has no localStorage

// Highest score first
function sortScores(scores: Scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

// "latino hispanic" -> "Latino hispanic", "male" -> "MALE"
function formatName(category: CategoryKey, name: string) {
  if (category === "gender") return name.toUpperCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// 0.5254 -> "52.54%"
function formatPercent(score: number) {
  return `${(score * 100).toFixed(2)}%`;
}

export default function SummaryPage() {
  const saved = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // undefined = still loading, null = nothing saved yet
  const data = useMemo<Demographics | null | undefined>(() => {
    if (saved === undefined) return undefined;
    if (!saved) return null;
    try {
      return JSON.parse(saved) as Demographics;
    } catch {
      return null;
    }
  }, [saved]);

  const [active, setActive] = useState<CategoryKey>("race");
  const [selected, setSelected] = useState<
    Partial<Record<CategoryKey, string>>
  >({});

  if (data === undefined) {
    return <main className="min-h-screen bg-white" />;
  }

  if (data === null) {
    return (
      <main className="relative min-h-screen bg-white text-[#1a1b1c]">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm uppercase">No analysis found.</p>
          <Link href="/result" className="text-sm uppercase underline">
            Upload an image first
          </Link>
        </div>
      </main>
    );
  }

  // The value shown for each group: the user's pick, or the AI's top guess
  const currentValue = (key: CategoryKey) =>
    selected[key] ?? sortScores(data[key])[0][0];

  const rows = sortScores(data[active]);
  const activeValue = currentValue(active);
  const activeScore = data[active][activeValue];
  const dashOffset = CIRCUMFERENCE * (1 - activeScore);

  return (
    <main className="relative min-h-screen bg-white pb-32 text-[#1a1b1c]">
      <Header />

      {/* Title */}
      <div className="px-8 pt-2">
        <p className="text-xs font-semibold uppercase">A.I. Analysis</p>
        <h1 className="text-4xl font-light tracking-tighter md:text-6xl">
          DEMOGRAPHICS
        </h1>
        <p className="mt-1 text-xs uppercase">Predicted race &amp; age</p>
      </div>

      <div className="mt-14 flex flex-col gap-4 px-8 md:flex-row">
        {/* Left: one box per group */}
        <div className="flex flex-row gap-3 md:w-40 md:flex-col md:gap-3">
          {CATEGORIES.map(({ key, label }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`flex h-20 flex-1 flex-col justify-between border-t border-[#1a1b1c] p-3 text-left outline-none transition-colors md:flex-none ${
                  isActive
                    ? "bg-[#1a1b1c] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className="text-xs font-semibold">
                  {formatName(key, currentValue(key))}
                </span>
                <span className="text-xs font-semibold uppercase">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center: selected value and circle */}
        <div className="relative min-h-72 flex-1 border-t border-[#1a1b1c] bg-gray-100 p-5 md:min-h-90">
          <h2 className="text-2xl font-light tracking-tight md:text-4xl">
            {formatName(active, activeValue)}
          </h2>

          <div className="absolute bottom-5 right-5 h-48 w-48 md:h-76 md:w-76">
            <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
              <circle
                cx="150"
                cy="150"
                r={RADIUS}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="6"
              />
              <circle
                cx="150"
                cy="150"
                r={RADIUS}
                fill="none"
                stroke="#1a1b1c"
                strokeWidth="6"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-light md:text-4xl">
              {formatPercent(activeScore)}
            </span>
          </div>
        </div>

        {/* Right: all scores, highest first */}
        <div className="border-t border-[#1a1b1c] bg-gray-100 md:w-80">
          <div className="flex justify-between px-3 py-3 text-sm uppercase">
            <span>{CATEGORIES.find((c) => c.key === active)?.label}</span>
            <span>A.I. Confidence</span>
          </div>

          {rows.map(([name, score]) => {
            const isSelected = name === activeValue;
            return (
              <button
                key={name}
                type="button"
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [active]: name }))
                }
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm outline-none transition-colors ${
                  isSelected
                    ? "bg-[#1a1b1c] text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rotate-45 border border-current ${
                      isSelected ? "bg-current" : ""
                    }`}
                  />
                  {formatName(active, name)}
                </span>
                <span>{formatPercent(score)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-10 left-8">
        <SideButton label="Back" direction="left" href="/select" />
      </div>

      {/* Hint */}
      <p className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 text-sm text-gray-400 md:block">
        If A.I. estimate is wrong, select the correct one.
      </p>

      {/* Home button */}
      <div className="absolute bottom-10 right-8">
        <SideButton label="Home" direction="right" href="/" />
      </div>
    </main>
  );
}