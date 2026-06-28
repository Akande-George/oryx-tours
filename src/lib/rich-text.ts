// Self-contained rich-text helpers - no external editor or sanitizer
// dependency. Tour descriptions are authored as HTML in the rich-text editor
// and rendered through `sanitizeHtml` so only a safe whitelist of tags and
// attributes ever reaches the DOM. Everything here is isomorphic (no DOM /
// browser APIs) so it runs the same on the server and the client.

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "strike",
  "ul",
  "ol",
  "li",
  "h3",
  "h4",
  "blockquote",
  "a",
  "span",
  "div",
]);

// Tags whose text content (not just the tag) must be dropped entirely.
const STRIP_BLOCK = /<(script|style)[\s\S]*?<\/\1>/gi;

const safeHref = (raw: string): string | null => {
  const value = raw.trim();
  // Allow absolute http(s), mail/phone links, and root-relative paths only -
  // this rejects javascript:, data:, and other script-bearing schemes.
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(value)) return value;
  return null;
};

/**
 * Whitelist-sanitise an HTML string. Disallowed tags are removed but their
 * inner text is kept; every attribute is stripped except a validated `href`
 * on anchors. Safe to feed into dangerouslySetInnerHTML.
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return "";

  const html = input
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .replace(/<![\s\S]*?>/g, "") // doctype / declarations
    .replace(STRIP_BLOCK, ""); // script / style blocks (with content)

  return html.replace(
    /<\/?([a-zA-Z0-9]+)([^>]*)>/g,
    (match, rawName: string, rawAttrs: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return ""; // drop tag, keep inner text

      const closing = match.startsWith("</");
      if (closing) return `</${name}>`;

      if (name === "a") {
        const hrefMatch =
          /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(rawAttrs);
        const href = hrefMatch
          ? safeHref(hrefMatch[2] ?? hrefMatch[3] ?? hrefMatch[4] ?? "")
          : null;
        if (href) {
          return `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer nofollow">`;
        }
        return "<a>";
      }

      // Every other allowed tag is rebuilt with no attributes at all, which
      // removes inline styles and on* event handlers in one stroke.
      return `<${name}>`;
    },
  );
};

const HTML_TAG = /<(p|br|b|strong|i|em|u|s|strike|ul|ol|li|h3|h4|blockquote|a|span|div)\b[^>]*>/i;

/** True when the value looks like editor-authored HTML (vs. legacy plain text). */
export const isHtml = (value: string): boolean =>
  Boolean(value) && HTML_TAG.test(value);

/**
 * Flatten HTML to a single line of readable text for cards, hero summaries,
 * and search indexes. Block-level tags become spaces so words don't run
 * together; a small set of common entities is decoded.
 */
export const htmlToPlainText = (input: string): string => {
  if (!input) return "";
  if (!isHtml(input)) return input;
  return input
    .replace(/<\/(p|div|li|h3|h4|blockquote|ul|ol)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};
