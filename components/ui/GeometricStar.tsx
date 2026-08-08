export default function GeometricStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="#C8A24F" strokeWidth="1">
        <polygon points="50,5 61,39 97,39 68,60 79,95 50,74 21,95 32,60 3,39 39,39" />
        <polygon
          points="50,5 61,39 97,39 68,60 79,95 50,74 21,95 32,60 3,39 39,39"
          transform="rotate(45 50 50)"
        />
      </g>
    </svg>
  );
}
