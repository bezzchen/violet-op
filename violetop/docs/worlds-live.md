# Worlds Live

The existing VOP site includes a **Worlds Live** navigation tab on desktop and mobile.

- Fans: `/worlds`
- Host desk: the private link shared directly with event staff (not linked publicly).
- Projector: `/worlds/screen`
- Printable QR: `/images/worlds-join-qr.svg` (opens https://www.violet-op.com/worlds)

## Production activation

Use the existing VOP Vercel project. No new domain or DNS record is required.
Set these server-only environment variables, then redeploy:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: credentials for a shared Redis REST database. Existing `KV_REST_API_URL` and `KV_REST_API_TOKEN` are also supported.

Without the Redis credentials the fan page presents a waiting lobby and does not accept votes. Local disk storage is explicitly disabled in production.

## Running the event

1. Open your private host link. It signs you in automatically; no password is required. Keep the original link somewhere private to use it again after signing out.
2. Use the opening question or create a head-to-head, multiple choice, or written question.
3. Select **Go live**. All fan browsers update automatically, normally within two seconds.
4. Select **Show results** when ready. **Close voting** locks answers.
5. Review and approve written answers before they appear publicly.
6. Open the big-screen view and enter fullscreen; display its QR code for fans.

Fans do not create accounts. An HTTP-only anonymous cookie identifies each browser; changing a choice replaces the existing ballot. Clearing cookies or using another browser creates a new anonymous identity. This is an informal audience poll, not identity-verified voting. Limits: 50 questions and 2,000 browser responses per question. Store updates use Redis compare-and-swap to prevent concurrent votes from overwriting each other. Results are withheld by the server until revealed; written answers require approval.

## Local rehearsal

Set `WORLDS_LOCAL_DEV=1`, then run the development server. Data persists in ignored `.worlds-local/room.json`. This mode works only outside production and is labeled on the page. Test at least two separate browser sessions before the event.

## Private link access

The private link carries a random 256-bit capability in its URL fragment. The browser exchanges it for a Secure, HTTP-only, SameSite=Strict cookie, then removes the fragment from the address bar. Only its SHA-256 verifier is committed; the link itself must never be added to source, QR codes, or public pages. Host access works before storage is connected, but poll actions remain disabled. To revoke all copies, generate a new capability and replace the verifier in app/worlds/auth.ts, deploy, and share the new link privately.
