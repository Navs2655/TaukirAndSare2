export default function OrnamentalCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {/* Double-line bracket */}
      <path d="M2 22 L2 6 L22 6" stroke="#C8A24F" strokeWidth="1" opacity="0.85" />
      <path d="M8 26 L8 12 L26 12" stroke="#C8A24F" strokeWidth="0.75" opacity="0.5" />
      {/* Paisley-inspired curl at the joint */}
      <path
        d="M2 6 C 14 4, 18 14, 10 20 C 5 24, 2 20, 6 16 C 9 13, 13 15, 11 19"
        stroke="#C8A24F"
        strokeWidth="0.75"
        opacity="0.6"
      />
      <circle cx="2" cy="6" r="1.4" fill="#C8A24F" opacity="0.7" />
    </svg>
  );
}
