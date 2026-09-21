# Browser runtime decision — v0.2

## Decision

Use **Glulx + Quixe as the baseline browser runtime**. Treat Vorple as an optional enhancement layer, not a prerequisite.

Current Inform 7 ships Quixe 2.2.6 as its Glulx JavaScript interpreter. Quixe runs entirely in the browser and supports local save/restore. This is enough for the reconstruction world before we add richer browser-to-Inform communication.

Vorple remains useful for later gallery/UI synchronization because it can communicate between Inform and JavaScript, but it is not required for the first playable build.

## Build target

1. Compile `inform/Reconstruction.inform/Source/story.ni` as Glulx.
2. Release with the Quixe interpreter.
3. Copy the generated browser release into `web/play/`.
4. Keep `web/index.html` as the recovery/gallery shell.
5. Link the shell to `web/play/play.html`.
6. Only introduce Vorple when a concrete gallery interaction requires it.

## Provenance

- Inform core: https://github.com/ganelson/inform — Artistic License 2.0.
- Quixe: https://github.com/erkyrath/quixe — browser Glulx interpreter; pin exact release when copied/generated.
- Vorple: https://github.com/vorple/inform7 — reference only until license and exact version are recorded.

No runtime code is vendored by this document.
