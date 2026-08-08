import { Moon } from "lucide-react";

export default function SectionDivider() {
  return (
    <div
      className="relative z-10 flex items-center justify-center gap-3 py-2"
      aria-hidden="true"
    >
      <span className="w-10 h-px bg-gold/20" />
      <Moon className="w-3.5 h-3.5 text-gold/40" strokeWidth={1.5} />
      <span className="w-10 h-px bg-gold/20" />
    </div>
  );
}
