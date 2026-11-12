import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomUUID, timingSafeEqual, createHash } from "node:crypto";
import { configured, localMode, readRoom, changeRoom, limit } from "../../worlds/store";
import { PollError, publicRoom, vote, hostAction } from "../../worlds/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const secret = () => process.env.WORLDS_HOST_KEY || "";
function equal(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function sign(text: string) { return createHmac("sha256", secret()).update(text).digest("hex"); }
function token(role: string, id: string, lifetime: number) { const value = `${role}.${id}.${Date.now() + lifetime}`; return `${value}.${sign(value)}`; }
function verify(value: string | undefined, role: string) {
  if (!value || !secret()) return null;
  const parts = value.split(".");
  if (parts.length !== 4 || parts[0] !== role || Number(parts[2]) < Date.now() || !equal(parts[3], sign(parts.slice(0,3).join(".")))) return null;
  return parts[1];
}
function host(req: NextRequest) { return Boolean(verify(req.cookies.get("worlds_host")?.value, "host")); }
function json(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" } }); }
function cookie(response: NextResponse, name: string, value: string, maxAge: number) {
  response.cookies.set(name, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge });
}
function failure(error: unknown) { return error instanceof PollError ? json({ error: error.message }, error.status) : json({ error: "Connection interrupted. Your answer has not been confirmed. Please retry." }, 503); }
export async function GET(req: NextRequest) {
  if (!configured()) return json({ configured: false, host: host(req), active: null, polls: [], revision: 0 });
  try {
    const existing = verify(req.cookies.get("worlds_fan")?.value, "fan");
    const voter = existing || randomUUID();
    const response = json({ ...publicRoom(await readRoom(), voter, host(req)), configured: true, local: localMode() });
    if (!existing) cookie(response, "worlds_fan", token("fan", voter, 30 * 86400000), 30 * 86400);
    return response;
  } catch (error) { return failure(error); }
}
export async function POST(req: NextRequest) {
  try {
    // Cookies cannot authorize cross-origin changes. All UI mutations use same-origin JSON.
    const origin = req.headers.get("origin");
    let sameOrigin = false;
    try {
      const submittedFrom = new URL(origin || "");
      sameOrigin = submittedFrom.host === req.headers.get("host") &&
        (submittedFrom.protocol === "https:" || (process.env.NODE_ENV !== "production" && submittedFrom.protocol === "http:"));
    } catch { /* Missing or invalid origins cannot authorize a mutation. */ }
    if (!sameOrigin || !req.headers.get("content-type")?.startsWith("application/json")) throw new PollError("Please use this website to submit your answer.", 403);
    if (!configured()) throw new PollError("The host needs to connect shared storage and set a host key before live voting can open.", 503);
    const raw = await req.text();
    if (raw.length > 4096) throw new PollError("Request too large.", 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { throw new PollError("Invalid request."); }
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new PollError("Invalid request.");
    if (body.action === "login") {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
      await limit(`login:${createHash("sha256").update(ip).digest("hex")}`, 10);
      if (typeof body.key !== "string" || !equal(body.key, secret())) throw new PollError("That host key isn’t correct.", 401);
      const response = json({ ok: true }); cookie(response, "worlds_host", token("host", randomUUID(), 12 * 3600000), 12 * 3600); return response;
    }
    if (body.action === "logout") { const response = json({ ok: true }); cookie(response, "worlds_host", "", 0); return response; }
    const voter = verify(req.cookies.get("worlds_fan")?.value, "fan");
    if (!voter) throw new PollError("Refresh this page to join the room, then try again.", 401);
    if (body.action === "vote") {
      await limit(`fan:${voter}`, 20);
      const room = await changeRoom(room => vote(room, voter, body.pollId, body.answer));
      return json({ ...publicRoom(room, voter, host(req)), configured: true, local: localMode() });
    }
    if (!host(req)) throw new PollError("Host access is required.", 401);
    await limit(`host:${verify(req.cookies.get("worlds_host")?.value, "host")}`, 120);
    const room = await changeRoom(room => hostAction(room, body));
    return json({ ...publicRoom(room, voter, true), configured: true, local: localMode() });
  } catch (error) { return failure(error); }
}
