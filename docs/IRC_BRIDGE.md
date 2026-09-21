# IRC Bridge v0.7

## Decision

Inform 7 remains the reconstruction/world model. IRC is an external social transport, not implemented inside the Glulx VM.

```
Inform 7 world
  <-> Vorple browser bridge
  <-> HTTPS/WebSocket gateway
  <-> Eggdrop/Tcl
  <-> IRC network
```

A curl-compatible HTTP surface is retained for diagnostics, archival tooling and simple server-to-server calls. curl is not the IRC client.

## Invariants

- The Inform story remains playable when IRC is offline.
- No IRC credentials, tokens, passwords or server secrets are shipped to the browser or story file.
- The browser talks only to the gateway over HTTPS/WebSocket.
- Eggdrop owns the persistent IRC connection and TLS credentials.
- Automated IRC identities are disclosed as software agents/bots.
- IRC input is untrusted external text. It cannot directly execute Inform commands, Tcl, shell commands or JavaScript.
- Remote activity may create correspondence/events; it cannot mutate historical evidence or bypass reconstruction locks.
- Chess Atlas remains an external preserved human artefact. This bridge does not modify Chess Atlas.

## Minimal event contract

Browser -> gateway:

```json
{"type":"reconstruction.correspondence","version":1,"session":"<opaque id>","payload":{"record":"chess-atlas","action":"recover"}}
```

Gateway -> browser:

```json
{"type":"irc.message","version":1,"payload":{"channel":"#archive","sender":"ArchivistBot","automated":true,"text":"correspondence 0001 indexed"}}
```

## Boundaries

Inform emits semantic events such as recover correspondence, enter gallery, and inspect record. Vorple serializes those events for the gateway. Incoming events become constrained story events/correspondence. Inform never receives executable Tcl or JavaScript from IRC.

Eggdrop joins the configured IRC network and channels. Tcl translates only an allowlisted set of IRC events to gateway requests and gateway notifications to IRC messages.

Initial channel: #archive. Add #archaeology and #theory only after the single-channel bridge is tested.

## curl

The gateway will expose curl-compatible health/event endpoints so transport can be tested without Inform or Eggdrop and used by CI smoke tests:

```
GET /health
POST /events/reconstruction
GET /events?after=<cursor>
```

Authentication is intentionally deferred until a server host is selected.

## Failure model

If gateway or IRC is unavailable, Inform records EXTERNAL CORRESPONDENCE: UNAVAILABLE and continues locally. Recovery state never depends on IRC availability.

## Construction order

1. Move browser runtime from raw Quixe to Vorple-compatible release.
2. Prove Inform -> JavaScript semantic event locally.
3. Add tiny gateway with health/event endpoints and WebSocket/SSE delivery.
4. Add Eggdrop/Tcl adapter.
5. Connect one disclosed bot to one development IRC channel.
6. Add persistence/replay and provenance.
7. Only then connect recovery events to narrative progression.
