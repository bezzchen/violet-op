"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { presets, type PollKind, type RoomView } from "./model";
import styles from "./WorldsLive.module.css";

const joinUrl = "https://www.violet-op.com/worlds";
type ViewPoll = NonNullable<RoomView["active"]>;
export default function WorldsLive({ mode }: { mode: "fan" | "host" | "screen" }) {
  const [room, setRoom] = useState<RoomView | null>(null);
  const [connected, setConnected] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hostKey, setHostKey] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<PollKind>("duel");
  const [options, setOptions] = useState("BLG\nGen.G");
  const generation = useRef(0);
  const activeId = useRef<string | null>(null);
  const lastRoom = useRef<RoomView | null>(null);
  const applyRoom = useCallback((next: RoomView) => {
    if (lastRoom.current && next.revision < lastRoom.current.revision) return;
    if (next.active?.id !== activeId.current) {
      activeId.current = next.active?.id || null;
      setAnswer(next.active?.mine || ""); setNotice(""); setShowResults(false);
    }
    lastRoom.current = next; setRoom(next); setConnected(true); setFailed(false);
  }, []);
  const refresh = useCallback(async () => {
    const at = generation.current;
    try {
      const response = await fetch("/api/worlds", { cache: "no-store", signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (generation.current === at) applyRoom(data);
    } catch { if (generation.current === at) { setConnected(false); setFailed(true); } }
  }, [applyRoom]);
  useEffect(() => {
    let stopped = false; let timer: ReturnType<typeof setTimeout>;
    const tick = async () => { await refresh(); if (!stopped) timer = setTimeout(tick, document.hidden ? 8000 : 2000); };
    void tick();
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { stopped = true; clearTimeout(timer); document.removeEventListener("visibilitychange", visible); };
  }, [refresh]);
  async function act(body: Record<string, unknown>) {
    if (busy) return false;
    setBusy(true); setError(""); generation.current++;
    try {
      const response = await fetch("/api/worlds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save. Please retry.");
      if ("revision" in data) applyRoom(data); else { lastRoom.current = null; await refresh(); }
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "Connection interrupted. Please retry."); return false; }
    finally { setBusy(false); }
  }
  async function submitVote(e: FormEvent) {
    e.preventDefault(); if (!room?.active) return;
    const id = room.active.id;
    if (await act({ action: "vote", pollId: id, answer })) {
      if (activeId.current === id) setNotice(room.active.kind === "text" ? "Answer received. The host will review it before it appears on screen." : "You’re locked in. You can change your pick while voting is open.");
    }
  }
  async function create(e: FormEvent) {
    e.preventDefault();
    if (await act({ action: "create", title, kind, options: options.split("\n").map(o => o.trim()).filter(Boolean) })) { setTitle(""); setNotice("Question added. Select Go live when you’re ready."); }
  }
  const poll = room?.active;
  const isScreen = mode === "screen";
  const status = failed ? "RECONNECTING" : !room ? "CONNECTING" : !connected ? "RECONNECTING" : !room.configured ? "LOBBY" : poll?.open ? "VOTING OPEN" : "STAND BY";
  return <>
    {!isScreen && <Header />}
    <main id="main-content" className={`${styles.worlds} ${isScreen ? styles.screen : ""}`}>
      <div className={styles.art} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.brandline}><Link href="/worlds">VIOLET OP <span>/ WORLDS LIVE</span></Link><span className={styles.connection} data-online={connected}>{status}</span></header>
        <div className={styles.eventline}>LEAGUE OF LEGENDS <span>WORLD FINALS WATCH PARTY</span></div>
        {room?.local && <p className={styles.devnote}>Local rehearsal — votes on this server only</p>}
        {mode === "host" ? <>
          <div className={styles.hostHeading}><div><p className={styles.eyebrow}>YOU RUN THE ROOM</p><h1>Host desk.</h1></div><div className={styles.row}><Link href="/worlds">Fan view</Link><Link href="/worlds/screen" target="_blank">Open big screen</Link>{room?.host && <button onClick={() => void act({ action: "logout" })}>Sign out</button>}</div></div>
          {!room?.configured && room && <div className={styles.message}><h2>Live setup is still needed</h2><p>Connect the shared Redis store and set WORLDS_HOST_KEY in the hosting project. The fan page stays in the lobby until setup is complete.</p></div>}
          {!room?.host ? <form className={styles.login} onSubmit={async e => {e.preventDefault(); if (await act({action:"login",key:hostKey})) setHostKey("");}}><label htmlFor="host-key">Host key</label><input id="host-key" type="password" autoComplete="current-password" value={hostKey} onChange={e=>setHostKey(e.target.value)} required /><button className={styles.primary} disabled={busy || !room?.configured}>Open host desk</button><p>Only event staff need a key. Fans join without an account.</p></form> : <div className={styles.hostGrid}>
            <section><h2>Question queue <span>{room.polls.length}/50</span></h2><div className={styles.queue}>{room.polls.map(p=><article className={styles.queueItem} key={p.id} data-active={p.id===poll?.id}><div><small>{p.kind === "duel" ? "HEAD TO HEAD" : p.kind === "text" ? "OPEN ANSWER" : "MULTIPLE CHOICE"} · {p.total} responses</small><h3>{p.title}</h3></div><div className={styles.row}><button disabled={busy || (p.id===poll?.id && p.open)} onClick={()=>void act({action:"activate",pollId:p.id})}>{p.id===poll?.id&&p.open ? "Live now" : "Go live"}</button><button disabled={busy || !p.open} onClick={()=>void act({action:"close",pollId:p.id})}>Close voting</button><button disabled={busy} onClick={()=>void act({action:"reveal",pollId:p.id})}>{p.revealed ? "Hide results" : "Show results"}</button></div>{p.kind==="text" && p.responses.length>0 && <details><summary>Review {p.responses.length} answers</summary>{p.responses.map(r=><div className={styles.review} key={r.id}><p>{r.answer}</p><button disabled={busy} onClick={()=>void act({action:"moderate",pollId:p.id,voter:r.id,approved:!r.approved})}>{r.approved?"Hide from screen":"Approve for screen"}</button></div>)}</details>}</article>)}</div></section>
            <section className={styles.composer}><h2>Next question</h2><label htmlFor="preset">Start with a prompt</label><select id="preset" defaultValue="" onChange={e=>{const p=presets[Number(e.target.value)]; if(p){setTitle(p.title);setKind(p.kind);setOptions(p.options.join("\n"));}}}><option value="" disabled>Choose a preset…</option>{presets.map((p,i)=><option value={i} key={p.title}>{p.title}</option>)}</select><form onSubmit={create}><label htmlFor="question">Question</label><textarea id="question" value={title} onChange={e=>setTitle(e.target.value)} maxLength={180} required placeholder="What does the room think?"/><label htmlFor="kind">Answer format</label><select id="kind" value={kind} onChange={e=>setKind(e.target.value as PollKind)}><option value="duel">Left or right · 2 choices</option><option value="choice">Multiple choice · 2–8 choices</option><option value="text">Open-ended answer</option></select>{kind!=="text"&&<><label htmlFor="choices">Choices, one per line</label><textarea id="choices" value={options} onChange={e=>setOptions(e.target.value)} required rows={4}/></>}<button className={styles.primary} disabled={busy}>Add to queue</button></form><p>New questions stay off-screen until you select Go live. Typed answers need approval before the crowd sees them.</p><JoinCard /></section>
          </div>}
        </> : <div className={styles.experience}>
          <section className={styles.votePanel}>
            <p className={styles.eyebrow}>THE ROOM DECIDES</p>
            <h1>{poll?.title || "The room is warming up."}</h1>
            {!poll && <p className={styles.waiting}>{!room ? "Connecting you to the watch party…" : !connected ? "The connection dropped. Keep this page open—we’re reconnecting." : "Keep this page open. The next question will appear here automatically."}</p>}
            {poll && ((isScreen || showResults) ? <Results poll={poll} /> : <form onSubmit={submitVote}>
              {poll.kind === "text" ? <div className={styles.textAnswer}><label htmlFor="answer">Make your call</label><textarea id="answer" placeholder="Who’s your pick?" maxLength={120} value={answer} onChange={e=>setAnswer(e.target.value)} disabled={!poll.open || busy} rows={3}/><small>{answer.length}/120 · Answers are reviewed before display</small></div> : <div className={`${styles.choices} ${poll.kind==="duel"?styles.duel:""}`} role="group" aria-label="Choose your answer">{poll.options.map((option)=><button key={option} type="button" className={styles.choice} aria-pressed={answer===option} data-selected={answer===option} onClick={()=>{setAnswer(option);setNotice("");}} disabled={!poll.open || busy}><span>{option}</span><small>{answer===option?"SELECTED":"PICK YOUR SIDE"}</small></button>)}</div>}
              <button className={styles.primary} disabled={!poll.open || !answer.trim() || busy || !connected}>{busy?"LOCKING IN…":!poll.open?"VOTING IS CLOSED":poll.kind==="text"?"SEND MY ANSWER":"LOCK IN MY PICK"}</button>
              {poll.mine && !notice && <p className={styles.receipt}>Your saved answer: <strong>{poll.mine}</strong></p>}
            </form>)}
            <p role="status" className={styles.receipt}>{notice}</p>
            {!isScreen && <><p className={styles.tagline}>Your vote. The whole room.</p>{poll && <button className={styles.textButton} onClick={()=>setShowResults(v=>!v)}>{showResults?"Back to my pick":"View live results"}</button>}<p className={styles.fine}>No account needed. One answer per browser, per question.</p></>}
          </section>
          <aside className={styles.sidePanel}><p className={styles.sideTitle}>PICK A SIDE.<br/>MAKE SOME NOISE.</p><p>Your team. Your take.<br/>Violet through and through.</p><JoinCard />{isScreen && <button className={styles.textButton} onClick={()=>void document.documentElement.requestFullscreen().catch(()=>setError("Use your browser’s fullscreen control."))}>Enter fullscreen</button>}</aside>
        </div>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {!connected && room && <p role="status" className={styles.error}>Reconnecting… Showing the last received update. Voting is paused until we reconnect.</p>}
        <footer className={styles.footer}><span>NYU VIOLET OP · WORLDS WATCH PARTY</span><div><Link href="/worlds">Vote</Link><Link href="/worlds/screen">Big screen</Link><Link href="/worlds/host">Host controls</Link></div></footer>
      </div>
    </main>
  </>;
}
function Results({poll}:{poll:ViewPoll}) {
  const approvedAnswers = poll.responses.filter(response => response.approved);
  if (!poll.revealed) return <div className={styles.message}><h2>{poll.open ? "The room is making its call." : "Picks are locked."}</h2><p>The host will reveal the results on the big screen.</p><strong>{poll.total} responses received</strong></div>;
  return <div className={styles.results}><p className={styles.resultCount}>{poll.total} {poll.total===1?"response":"responses"} · {poll.open?"Updating live":"Final results"}</p>{poll.kind === "text" ? <div className={styles.answers}>{approvedAnswers.length ? approvedAnswers.map((r,i)=><p key={`${r.answer}-${i}`}>{r.answer}</p>) : <p>Approved answers will appear here.</p>}</div> : poll.options.map((option,i)=>{const count=poll.counts?.[i]||0;const percent=poll.total?Math.round(count/poll.total*100):0;return <div className={styles.result} key={option}><div><strong>{option}</strong><span>{percent}% <small>({count})</small></span></div><progress max={100} value={percent} aria-label={`${option}: ${count} votes, ${percent} percent`} /></div>;})}</div>;
}
function JoinCard() {return <div className={styles.joinCard}><img src="/images/worlds-join-qr.svg" alt="QR code: open violet-op.com/worlds to vote" width={160} height={160}/><div><strong>SCAN. PICK. REPEAT.</strong><a href={joinUrl}>violet-op.com/worlds</a><a href="/images/worlds-join-qr.svg" download="VOP-Worlds-QR.svg">Download QR</a></div></div>;}
