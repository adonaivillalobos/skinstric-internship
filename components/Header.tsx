export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-4 text-xs font-semibold">
        <span>SKINSTRIC</span>
        <span className="text-gray-500">[ INTRO ]</span>
      </div>
      <button className="bg-[#1a1b1c] px-4 py-3 text-[10px] font-semibold text-white">
        ENTER CODE
      </button>
    </header>
  );
}