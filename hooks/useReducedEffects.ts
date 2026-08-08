"use client";

import { useEffect, useState } from "react";

/**
 * Detects slow connections (2G/3G or explicit data-saver mode) so purely
 * decorative effects — film grain, particle count, star density — can be
 * trimmed. Never affects core content or functionality, only visual extras.
 *
 * Note: the Network Information API isn't supported in iOS Safari, so this
 * defaults to `false` (full effects) there — it's a bandwidth-conscious
 * enhancement for supporting browsers, not a guarantee.
 */
export function useReducedEffects() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection) return;

    const evaluate = () => {
      const slowTypes = ["slow-2g", "2g", "3g"];
      setReduced(
        Boolean(connection.saveData) ||
          slowTypes.includes(connection.effectiveType)
      );
    };

    evaluate();
    connection.addEventListener?.("change", evaluate);
    return () => connection.removeEventListener?.("change", evaluate);
  }, []);

  return reduced;
}
