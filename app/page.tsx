import Header from "./components/Header";
import SideButton from "./components/SideButton";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#1a1b1c]">
      <Header />

      {/* Dotted diamonds */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-dotted border-gray-400" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-125 w-125 -translate-y-1/2 translate-x-1/2 rotate-45 border border-dotted border-gray-400" />

      <h1 className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-7xl font-light leading-none tracking-tighter md:text-9xl">
        Sophisticated
        <br />
        skincare
      </h1>

      {/* Side buttons */}
      <div className="absolute left-[6%] top-1/2 -translate-y-1/2">
        <SideButton label="Discover A.I." direction="left" />
      </div>
      <div className="absolute right-[6%] top-1/2 -translate-y-1/2">
        <SideButton label="Take test" direction="right" href="/testing" />
      </div>

      <p className="absolute bottom-10 left-8 max-w-xs text-xs uppercase">
        Skinstric developed an A.I. that creates a highly-personalized routine
        tailored to what your skin needs.
      </p>
    </main>
  );
}