export default function ArchMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" className={className} aria-hidden="true">
      <path
        d="M20 500 L20 180 C20 70 100 10 200 10 C300 10 380 70 380 180 L380 500"
        fill="none"
        stroke="#C8A24F"
        strokeWidth="1"
      />
      <path
        d="M55 500 L55 185 C55 90 120 40 200 40 C280 40 345 90 345 185 L345 500"
        fill="none"
        stroke="#C8A24F"
        strokeWidth="0.6"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
