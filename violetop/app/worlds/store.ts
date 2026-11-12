import { mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";
import { initialRoom, PollError, type Room } from "./model.ts";

const key = "vop:worlds:2026:room";
const restUrl = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const restToken = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const localMode = () => process.env.NODE_ENV !== "production" && process.env.WORLDS_LOCAL_DEV === "1";
export const configured = () => Boolean(localMode() || (restUrl() && restToken()));
export async function redis(command: (string | number)[]) {
  if (!restUrl() || !restToken()) throw new PollError("Live voting is not configured yet.", 503);
  const response = await fetch(restUrl()!, { method: "POST", headers: { Authorization: `Bearer ${restToken()}`, "Content-Type": "application/json" }, body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!response.ok) throw new PollError("Live connection interrupted. Please try again.", 503);
  const data = await response.json();
  if (data.error) throw new PollError("Live connection interrupted. Please try again.", 503);
  return data.result;
}
const localFile = () => path.join(process.env.WORLDS_DATA_DIR || path.join(process.cwd(), ".worlds-local"), "room.json");
export async function readRaw(): Promise<string | null> {
  if (!configured()) throw new PollError("Live voting is not configured yet.", 503);
  if (localMode()) { try { return readFileSync(localFile(), "utf8"); } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; } }
  return redis(["GET", key]);
}
export async function readRoom(): Promise<Room> { const raw = await readRaw(); return raw ? JSON.parse(raw) : initialRoom(); }
export async function changeRoom(change: (room: Room) => void) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const before = await readRaw();
    const room: Room = before ? JSON.parse(before) : initialRoom();
    change(room); room.revision++;
    const after = JSON.stringify(room);
    if (localMode()) {
      // Synchronous compare/write is atomic within the single development server process.
      let current: string | null = null;
      try { current = readFileSync(localFile(), "utf8"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
      if (current !== before) continue;
      mkdirSync(path.dirname(localFile()), { recursive: true });
      writeFileSync(`${localFile()}.tmp`, after); renameSync(`${localFile()}.tmp`, localFile()); return room;
    }
    // Server-side compare-and-swap prevents lost votes across concurrent Vercel instances.
    const written = await redis(["EVAL", "local v=redis.call('GET',KEYS[1]); if (v or '')==ARGV[1] then redis.call('SET',KEYS[1],ARGV[2]); return 1 else return 0 end", 1, key, before || "", after]);
    if (written === 1) return room;
    await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 40));
  }
  throw new PollError("Lots of fans are voting. Please tap again.", 409);
}
const devLimits = new Map<string, { n: number; until: number }>();
export async function limit(identity: string, maximum: number) {
  const slot = Math.floor(Date.now() / 60000);
  if (localMode()) {
    for (const [k,v] of devLimits) if (v.until < Date.now()) devLimits.delete(k);
    const id = `${identity}:${slot}`; const v = devLimits.get(id) || { n: 0, until: Date.now() + 60000 };
    v.n++; devLimits.set(id, v); if (v.n > maximum) throw new PollError("Please wait a minute before trying again.", 429); return;
  }
  const n = await redis(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],90) end; return n", 1, `vop:worlds:limit:${identity}:${slot}`]);
  if (n > maximum) throw new PollError("Please wait a minute before trying again.", 429);
}
