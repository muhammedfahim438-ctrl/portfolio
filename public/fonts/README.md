# Fonts (drop-in)

Four WOFF2 faces are shipped here. Each has one job:

| File | Font | Role |
| --- | --- | --- |
| `NType82-Headline.woff2` | NType82 Headline | Headlines H1–H3 (`font-display`, `.dg-f-display`) |
| `NType82-Regular.woff2` | NType82 Regular | Body copy (`font-subhead` / `font-sans`) |
| `NType82Mono-Regular.woff2` | NType82 Mono | Labels, eyebrows, buttons, badges, UI readouts (`font-mono`, `.dg-ui-mono`) |
| `NDot_55.woff2` | Ndot 55 | Product names, monograms, logotypes (`font-logo`, `.dg-f-logo`) |

The `@font-face` rules in `src/app/globals.css` point at `/fonts/<file>` with
`font-display: swap`, so layout holds on the fallback stack until a face loads.

## About `NDot_55.woff2`

The original file at this path was an HTML error page from Nothing.wiki, not a
font — Ndot 55 is distributed as an **OTF**, so a `.woff2` download page never
existed. It was replaced with the real `Ndot55-Regular.otf` from the public
`xeji01/nothingfont` mirror, converted to WOFF2 with fontTools. Verify the
magic bytes are `wOF2` if you ever replace it.

## Not included

- `NDot57` — dot-matrix numerals. `--font-data` currently uses NType82 Mono.
  Add a real `NDot57` plus an `@font-face` to restore it.

These are Nothing Technology brand faces ("All Rights Reserved"). Use them
under the font's license; only redistribute where that license allows.
Lettera Mono LL is retired and is not referenced anywhere.
