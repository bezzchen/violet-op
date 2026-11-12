import { createHash, timingSafeEqual } from "node:crypto";

// Only the verifier is committed. The private link itself is shared with the host.
const hostLinkHash = "feac53a362dc4bc9e677f6e2026eeaec56668d958ef39fcb7ecf22646fc9f765";

export function validHostLink(value: unknown): value is string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value)) return false;
  return timingSafeEqual(createHash("sha256").update(value).digest(), Buffer.from(hostLinkHash, "hex"));
}

export function fanIdentity(value: string | undefined) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : null;
}
