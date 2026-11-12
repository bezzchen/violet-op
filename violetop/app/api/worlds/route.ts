import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { validHostLink, fanIdentity } from "../../worlds/auth";
import { configured, localMode, readRoom, changeRoom, limit } from "../../worlds/store";
import { PollError, publicRoom, vote, hostAction } from "../../worlds/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function host(req: NextRequest) { return validHostLink(req.cookies.get("worlds_host")?.value); }
function json(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" } }); }
function cookie(response: NextResponse, name: string, value: string, maxAge: number) {
  response.cookies.set(name, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge });
}
function failure(error: unknown) { return error instanceof PollError ? json({ error: error.message }, error.status) : json({ error: "Connection interrupted. Your answer has not been confirmed. Please retry." }, 503); }
export async function GET(req: NextRequest) {
  if (!configured()) return json({ configured: false, host: host(req), active: null, polls: [], revision: 0 });
  try {
    const existing = fanIdentity(req.cookies.get("worlds_fan")?.value);
    const voter = existing || randomUUID();
    const response = json({ ...publicRoom(await readRoom(), voter, host(req)), configured: true, local: localMode() });
    if (!existing) cookie(response, "worlds_fan", voter, 30 * 86400);
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
    const raw = await req.text();
    if (raw.length > 4096) throw new PollError("Request too large.", 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { throw new PollError("Invalid request."); }
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new PollError("Invalid request.");
    if (body.action === "login") {
      if (!validHostLink(body.link)) throw new PollError("This private host link is invalid. Open the complete link shared with you.", 401);
      const response = json({ ok: true }); cookie(response, "worlds_host", body.link, 12 * 3600); return response;
    }
    if (body.action === "logout") { const response = json({ ok: true }); cookie(response, "worlds_host", "", 0); return response; }
    if (!configured()) throw new PollError("Connect shared voting storage before opening a poll.", 503);
    const voter = fanIdentity(req.cookies.get("worlds_fan")?.value);
    if (!voter) throw new PollError("Refresh this page to join the room, then try again.", 401);
    if (body.action === "vote") {
      await limit(`fan:${voter}`, 20);
      const room = await changeRoom(room => vote(room, voter, body.pollId, body.answer));
      return json({ ...publicRoom(room, voter, host(req)), configured: true, local: localMode() });
    }
    if (!host(req)) throw new PollError("Host access is required.", 401);
    await limit("host:worlds", 120);
    const room = await changeRoom(room => hostAction(room, body));
    return json({ ...publicRoom(room, voter, true), configured: true, local: localMode() });
  } catch (error) { return failure(error); }
}
