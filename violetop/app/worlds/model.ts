export type PollKind = "duel" | "choice" | "text";
export type Ballot = { answer: string; approved: boolean; at: number };
export type Poll = { id: string; title: string; kind: PollKind; options: string[]; open: boolean; revealed: boolean; votes: Record<string, Ballot> };
export type Room = { revision: number; activeId: string; polls: Poll[] };
export class PollError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
export const presets = [
  { title: "Who’s winning the series?", kind: "duel", options: ["BLG", "Gen.G"] },
  { title: "Who’s getting the next Baron?", kind: "duel", options: ["BLG", "Gen.G"] },
  { title: "Who’s your favorite player in the finals?", kind: "text", options: [] },
  { title: "Who’s running it down right now?", kind: "text", options: [] },
  { title: "Who’s your MVP of the series?", kind: "text", options: [] },
  { title: "What champion is turbo broken?", kind: "text", options: [] },
] satisfies {title:string; kind:PollKind; options:string[]}[];
export function initialRoom(): Room {
  return { revision: 0, activeId: "opening", polls: [{ ...presets[0], id: "opening", open: false, revealed: false, votes: {} }] };
}
function clean(value: unknown, max: number) {
  if (typeof value !== "string") throw new PollError("Please enter text.");
  const result = value.trim().replace(/[\u0000-\u001f\u007f]/g, " ");
  if (!result || result.length > max) throw new PollError(`Please use 1–${max} characters.`);
  return result;
}
export function vote(room: Room, voter: string, pollId: unknown, answer: unknown) {
  const poll = room.polls.find(p => p.id === pollId);
  if (!poll || room.activeId !== poll.id) throw new PollError("That poll has closed. Please wait for the next one.", 409);
  const text = clean(answer, 120);
  if (poll.votes[voter]) {
    // Retrying the same confirmed answer is safe, including after voting closes.
    if (poll.votes[voter].answer === text) return;
    throw new PollError("Your answer is locked in. Wait for the next question.", 409);
  }
  if (!poll.open || poll.revealed) throw new PollError("That poll has closed. Please wait for the next one.", 409);
  if (poll.kind !== "text" && !poll.options.includes(text)) throw new PollError("Choose one of the available options.");
  if (!poll.votes[voter] && Object.keys(poll.votes).length >= 2000) throw new PollError("This poll has reached its response limit.", 409);
  // Confirmed ballots stay locked for this question.
  poll.votes[voter] = { answer: text, approved: poll.kind !== "text", at: Date.now() };
}
export function hostAction(room: Room, body: Record<string, unknown>) {
  if (body.action === "create") {
    if (room.polls.length >= 50) throw new PollError("This event supports up to 50 questions.");
    if (!["duel", "choice", "text"].includes(String(body.kind))) throw new PollError("Choose a question type.");
    const kind = body.kind as PollKind;
    const options = kind === "text" ? [] : Array.isArray(body.options) ? body.options.map(o => clean(o, 60)) : [];
    if (kind !== "text" && (options.length < 2 || options.length > 8 || (kind === "duel" && options.length !== 2))) throw new PollError("Use two choices for a head-to-head, or 2–8 for multiple choice.");
    if (new Set(options.map(o => o.toLowerCase())).size !== options.length) throw new PollError("Each choice must be different.");
    room.polls.push({ id: crypto.randomUUID(), title: clean(body.title, 180), kind, options, open: false, revealed: false, votes: {} });
    return;
  }
  const poll = room.polls.find(p => p.id === body.pollId);
  if (!poll) throw new PollError("Question not found.", 404);
  switch (body.action) {
    case "activate": room.polls.forEach(p => { p.open = false; }); room.activeId = poll.id; poll.open = true; poll.revealed = false; break;
    case "close": poll.open = false; break;
    case "reveal": poll.revealed = !poll.revealed; if (poll.revealed) poll.open = false; break;
    case "moderate": {
      const ballot = poll.votes[String(body.voter)];
      if (!ballot || poll.kind !== "text") throw new PollError("Response not found.", 404);
      ballot.approved = body.approved === true; break;
    }
    default: throw new PollError("Unknown action.");
  }
}
export function projectPoll(p: Poll, voter: string, host = false) {
  const ballots = Object.entries(p.votes);
  const visible = host || p.revealed;
  return { id: p.id, title: p.title, kind: p.kind, options: p.options, open: p.open, revealed: p.revealed,
    total: ballots.length, mine: p.votes[voter]?.answer ?? null,
    counts: visible && p.kind !== "text" ? p.options.map(option => ballots.filter(([, v]) => v.answer === option).length) : null,
    responses: visible && p.kind === "text" ? ballots.filter(([, v]) => host || v.approved).map(([id, v]) => ({ id: host ? id : undefined, answer: v.answer, approved: v.approved })) : [],
  };
}
export function publicRoom(room: Room, voter: string, host = false) {
  const active = room.polls.find(p => p.id === room.activeId);
  return { revision: room.revision, active: active ? projectPoll(active, voter, host) : null,
    polls: host ? room.polls.map(p => projectPoll(p, voter, true)) : [], host };
}
export type RoomView = ReturnType<typeof publicRoom> & { configured?: boolean; local?: boolean };
