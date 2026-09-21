# Build the playable web release

The repository stores source and the eventual generated web release separately.

## Fastest path

Open the Inform project in a current Inform 7 environment, target **Glulx**, and release with **Quixe**. Put the generated release files under `web/play/`.

The story source should remain playable without Vorple. This gives the project a durable text-first baseline and makes the richer gallery an enhancement rather than a dependency.

## Mobile development path

Borogove can compile Inform 7 with Vorple in a browser and is useful when working from a phone. Do not copy generated third-party runtime files into this repository until their exact versions and licenses have been recorded in `OPEN_SOURCE.md`.

## Acceptance test

A successful v0.2 browser build must:

- open without a server-side application;
- show the Recovery Console;
- accept LOOK and movement commands;
- reach Orientation, Gallery, Archive and Terminal;
- show six memory housings in Archive;
- preserve the rule that opening a housing does not interpret the memory;
- remain usable on a narrow mobile viewport.
