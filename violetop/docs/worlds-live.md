# Worlds Live

The existing VOP site includes a **Worlds Live** navigation tab on desktop and mobile.

- Fans: `/worlds`
- Host desk: `/worlds/host`
- Projector: `/worlds/screen`
- Printable QR: `/images/worlds-join-qr.svg` (opens https://www.violet-op.com/worlds)

## Production activation

Use the existing VOP Vercel project. No new domain or DNS record is required.
Set these server-only environment variables, then redeploy:

- `WORLDS_HOST_KEY`: a strong random password shared only with event staff.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: credentials for a shared Redis REST database. Existing `KV_REST_API_URL` and `KV_REST_API_TOKEN` are also supported.

Without these variables the fan page presents a waiting lobby and does not accept votes. Local disk storage is explicitly disabled in production.

## Running the event

1. Open the host desk and sign in with the host key.
2. Use the opening question or create a head-to-head, multiple choice, or written question.
3. Select **Go live**. All fan browsers update automatically, normally within two seconds.
4. Select **Show results** when ready. **Close voting** locks answers.
5. Review and approve written answers before they appear publicly.
6. Open the big-screen view and enter fullscreen; display its QR code for fans.

Fans do not create accounts. An HTTP-only signed cookie identifies each browser; changing a choice replaces the existing ballot. Clearing cookies or using another browser creates a new anonymous identity. This is an informal audience poll, not identity-verified voting. Limits: 50 questions and 2,000 browser responses per question. Store updates use Redis compare-and-swap to prevent concurrent votes from overwriting each other. Results are withheld by the server until revealed; written answers require approval.

## Local rehearsal

Set `WORLDS_LOCAL_DEV=1` and a temporary `WORLDS_HOST_KEY`, then run the development server. Data persists in ignored `.worlds-local/room.json`. This mode works only outside production and is labeled on the page. Test at least two separate browser sessions before the event.
