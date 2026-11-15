# Fonts (drop-in)

This folder is intentionally empty of binaries. The portfolio uses three fonts:

| File | Font | Role |
| --- | --- | --- |
| `NDot55.woff2` | NDot55 | Display (`font-display`) |
| `Ntype82.woff2` | Ntype82 | Subhead / body (`font-subhead`) |
| `LetteraMonoLL.woff2` | Lettera Mono LL | Mono / UI (`font-mono`) |

Drop the three `.woff2` files here with exactly those names and rebuild. The
`@font-face` rules in `src/app/globals.css` point at `/fonts/<file>` with
`font-display: swap`, so the layout holds on system fallbacks until then.
