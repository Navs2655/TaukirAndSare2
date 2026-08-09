export default function JaaliPattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23C8A24F' stroke-width='0.6'%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3Cpath d='M30 6 L54 30 L30 54 L6 30 Z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
