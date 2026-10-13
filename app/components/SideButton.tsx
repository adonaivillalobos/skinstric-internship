type SideButtonProps = {
  label: string;
  direction: "left" | "right";
};

export default function SideButton({ label, direction }: SideButtonProps) {
  const diamond = (
    <span className="flex h-9 w-9 rotate-45 items-center justify-center border border-[#1a1b1c]">
      <span className="-rotate-45 text-[10px]">
        {direction === "left" ? "◀" : "▶"}
      </span>
    </span>
  );

  return (
    <button className="flex items-center gap-4 text-sm uppercase">
      {direction === "left" && diamond}
      <span>{label}</span>
      {direction === "right" && diamond}
    </button>
  );
}