"use client";

import { forwardRef, useRef, type InputHTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onKeyDown"
> & {
  hideIcon?: boolean;
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput({ className, hideIcon = false, ...rest }, ref) {
    const internalRef = useRef<HTMLInputElement>(null);
    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    const openPicker = () => {
      const el = internalRef.current;
      if (!el) return;
      const showPicker = (
        el as HTMLInputElement & { showPicker?: () => void }
      ).showPicker;
      if (typeof showPicker === "function") {
        try {
          showPicker.call(el);
          return;
        } catch {
          /* fall through */
        }
      }
      el.focus();
      el.click();
    };

    return (
      <div className="relative w-full">
        <input
          ref={setRefs}
          type="date"
          {...rest}
          onKeyDown={(e) => {
            // Allow Tab so users can move focus; block all typing
            if (e.key !== "Tab") e.preventDefault();
          }}
          onPaste={(e) => e.preventDefault()}
          onClick={openPicker}
          className={cn(
            "flex h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors selection:bg-transparent focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            !hideIcon && "pr-9",
            className,
          )}
        />
        {!hideIcon ? (
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        ) : null}
      </div>
    );
  },
);
