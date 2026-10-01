/**
 * Renders a JSON-LD structured-data block. Server component. Titles and
 * excerpts come from Sanity, so `<` is escaped: a value containing
 * "</script>" must not be able to close the tag and inject markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
