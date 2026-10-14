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
  const diamond = (
    <span className="flex h-9 w-9 rotate-45 items-center justify-center border border-current">
      <span className="-rotate-45 text-[10px]">
        {direction === "left" ? "◀" : "▶"}
      </span>
    </span>
  );

  const className = "flex items-center gap-4 text-sm uppercase";

  const content = (
    <>
      {direction === "left" && diamond}
      <span>{label}</span>
      {direction === "right" && diamond}
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