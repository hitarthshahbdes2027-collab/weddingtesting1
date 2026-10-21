# Wedding flipbook

Extract the ZIP, then open dist/index.html. Upload the contents of dist/ to any static website host to publish it. Everything is included locally; no internet or build step is needed.

The invitation cards are the entire website. Grab a corner and drag, swipe, tap a page, or use the arrows. A single card fills phone screens; wide screens show a two-page spread. The small expand control opens the current card for closer reading; Escape closes it.

Original artwork is unchanged. Page curling uses StPageFlip 2.0.7, included in dist/vendor with its MIT license: https://github.com/Nodlik/StPageFlip

Validation: run node check-reader.cjs. Checks cover viewport sizing, assets, navigation boundaries, turn locking, spread counts and resize without duplicate engines. The browser tool blocks local file URLs, so visual animation and physical-device swipe testing were not verified. This version is local and has not been published.
