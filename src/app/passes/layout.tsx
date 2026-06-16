import type { ReactNode } from "react";
import "./passes.css";

export default function PassesLayout({ children }: { children: ReactNode }) {
  return <div className="pass-shell">{children}</div>;
}
