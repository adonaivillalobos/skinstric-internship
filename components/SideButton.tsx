import Link from "next/link";

type SideButtonProps = {
  label: string;
  direction: "left" | "right";
  href?: string;
  onClick?: () => void;
};

export default function SideButton({
  label,
  direction,
  href = "#",
  onClick,
}: SideButtonProps) {
  const isLeft = direction === "left";

  const diamond = (
    <span
      className={`flex rotate-45 items-center justify-center border border-current ${
        isLeft ? "h-16 w-16 md:h-9 md:w-9" : "h-9 w-9"
      }`}
    >
      {/* Phones: the label sits inside the diamond (Back buttons only) */}
      {isLeft && (
        <span className="-rotate-45 text-xs font-semibold md:hidden">
          {label}
        </span>
      )}

      {/* Tablet and desktop: the arrow sits inside the diamond */}
      <span
        className={`-rotate-45 text-[10px] ${isLeft ? "hidden md:inline" : ""}`}
      >
        {isLeft ? "◀" : "▶"}
      </span>
    </span>
  );

  const className = "flex items-center gap-4 text-sm uppercase";

  const content = (
    <>
      {isLeft && diamond}
      {/* On phones, Back buttons show the label inside the diamond instead */}
      <span className={isLeft ? "hidden md:inline" : ""}>{label}</span>
      {!isLeft && diamond}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}