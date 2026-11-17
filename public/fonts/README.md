# Fonts (drop-in)

This folder is intentionally empty of binaries. The portfolio uses four faces,
one job each — nothing else:

| File | Font | Role |
| --- | --- | --- |
| `Ntype82.woff2` | NType82 (headline + regular) | Headlines (H1–H3, `font-display`) and body copy (`font-subhead` / `font-sans`) |
| `Ntype82-Mono.woff2` | NType82 Mono | Labels, eyebrows, buttons, badges, UI readouts (`font-mono` / `.dg-ui-mono`) |
| `NDot55.woff2` | NDot55 | Product names, logotypes, monograms, special items (`font-logo` / `.dg-f-logo`) |
| `NDot57.woff2` | NDot57 | Numerals and data readouts only — stats, counts, indices, coordinates (`font-data` / `.dg-f-data`) |

Drop the four `.woff2` files here with exactly those names and rebuild. The
`@font-face` rules in `src/app/globals.css` point at `/fonts/<file>` with
`font-display: swap`, so the layout holds on system fallbacks until then.

These are the Nothing/Lineto brand faces shipped as separate licensed files;
this repo does not (and should not) commit them. Lettera Mono LL is retired —
it is not referenced anywhere.
