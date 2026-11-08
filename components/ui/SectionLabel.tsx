import { cn } from "@/lib/utils";

export default function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold",
        className,
      )}
    >
      {children}
    </p>
  );
}
