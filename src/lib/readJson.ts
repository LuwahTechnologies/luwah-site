import "server-only";

// Sized above the largest valid intake: 49 fields at 5000 chars each is about 245 KB.
const DEFAULT_MAX_BYTES = 512 * 1024;

/**
 * Reads a JSON object body with a hard size cap. Returns null for a missing,
 * oversized, malformed or non-object body. Counts bytes as they stream in and
 * cancels past the cap, so a chunked body cannot buffer in memory first.
 */
export async function readJson(
  request: Request,
  maxBytes = DEFAULT_MAX_BYTES
): Promise<Record<string, unknown> | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}
