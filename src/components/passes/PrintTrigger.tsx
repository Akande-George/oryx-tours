"use client";

import { useEffect } from "react";

export function PrintTrigger({ auto = false }: { auto?: boolean }) {
  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => window.print(), 350);
    return () => window.clearTimeout(id);
  }, [auto]);

  return (
    <div className="pass-actions no-print">
      <button type="button" onClick={() => window.print()}>
        Download / Print
      </button>
      <button type="button" onClick={() => window.close()}>
        Close
      </button>
    </div>
  );
}
