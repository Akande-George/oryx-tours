"use client";

import { useEffect, useRef } from "react";
import {
  Bold,
  Eraser,
  Heading,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/rich-text";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

type ToolbarButton = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  run: (exec: (cmd: string, arg?: string) => void) => void;
};

const toolbar: ToolbarButton[] = [
  { icon: Bold, label: "Bold", run: (exec) => exec("bold") },
  { icon: Italic, label: "Italic", run: (exec) => exec("italic") },
  { icon: Underline, label: "Underline", run: (exec) => exec("underline") },
  {
    icon: Heading,
    label: "Heading",
    run: (exec) => exec("formatBlock", "<h3>"),
  },
  {
    icon: List,
    label: "Bullet list",
    run: (exec) => exec("insertUnorderedList"),
  },
  {
    icon: ListOrdered,
    label: "Numbered list",
    run: (exec) => exec("insertOrderedList"),
  },
  {
    icon: Link2,
    label: "Add link",
    run: (exec) => {
      const url = window.prompt("Link URL (https://…)");
      if (url) exec("createLink", url);
    },
  },
  {
    icon: Eraser,
    label: "Clear formatting",
    run: (exec) => {
      exec("removeFormat");
      exec("formatBlock", "<p>");
    },
  },
];

/**
 * Lightweight contentEditable rich-text editor. Emits whitelist-sanitised HTML
 * via onChange. The incoming `value` is only written back into the DOM when the
 * editor is not focused, so external updates (loading a tour to edit) sync
 * cleanly without clobbering the caret while the user types.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return; // don't disturb active editing
    const next = value ?? "";
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value]);

  const emit = () => {
    const el = ref.current;
    if (!el) return;
    onChange(sanitizeHtml(el.innerHTML));
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 p-1">
        {toolbar.map(({ icon: Icon, label, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()} // keep selection in editor
            onClick={() => run(exec)}
            className="inline-flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className="rte-content min-h-[140px] px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
