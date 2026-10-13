import Link from "next/link";
import Header from "../components/Header";
import SideButton from "../components/SideButton";

const cellClass =
  "flex h-40 w-40 items-center justify-center bg-gray-100 md:h-48 md:w-48";

const enabledClass = "bg-gray-200 transition-colors hover:bg-gray-300";

const disabledClass = "cursor-not-allowed";

const labelClass =
  "-rotate-45 text-center text-sm font-semibold uppercase md:text-base";

export default function SelectPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      {/* Title */}
      <div className="absolute left-8 top-24">
        <h1 className="text-lg font-semibold uppercase">A.I. Analysis</h1>
        <p className="mt-3 text-sm uppercase leading-7">
          A.I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      {/* Diamonds */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid rotate-45 grid-cols-2 gap-1">
          {/* Available */}
          <Link href="/summary" className={`${cellClass} ${enabledClass}`}>
            <span className={labelClass}>Demographics</span>
          </Link>

          {/* Not available yet */}
          <div
            aria-disabled="true"
            className={`${cellClass} ${disabledClass}`}
          >
            <span className={labelClass}>
              Skin type
              <br />
              details
            </span>
          </div>
          <div
            aria-disabled="true"
            className={`${cellClass} ${disabledClass}`}
          >
            <span className={labelClass}>
              Cosmetic
              <br />
              concerns
            </span>
          </div>
          <div
            aria-disabled="true"
            className={`${cellClass} ${disabledClass}`}
          >
            <span className={labelClass}>Weather</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-10 left-8">
        <SideButton label="Back" direction="left" href="/result" />
      </div>

      {/* Get summary button (placeholder for now) */}
      <div className="absolute bottom-10 right-8">
        <SideButton label="Get summary" direction="right" />
      </div>
    </main>
  );
}