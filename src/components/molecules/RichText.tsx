import { cn } from "@/lib/utils";
import { isHtml, sanitizeHtml } from "@/lib/rich-text";

/**
 * Render an editor-authored rich-text value. HTML is whitelist-sanitised
 * before it touches the DOM; legacy plain-text values are rendered as-is with
 * line breaks preserved (React escapes them, so no dangerouslySetInnerHTML).
 */
export function RichText({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  if (!value || !value.trim()) return null;

  if (!isHtml(value)) {
    return (
      <div className={cn("rich-text whitespace-pre-line", className)}>
        {value}
      </div>
    );
  }

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
    />
  );
}
