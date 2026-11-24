# Notes for whoever maintains this drill

The demo the learner uses lives in `dojo/public/match-the-demo/` (`demo.html`, `demo.js`, `demo.css`). It is a minified production bundle of `Dropdown.tsx` from this folder, on purpose: the learner gets behavior but no readable source.

If `Dropdown.tsx` changes, rebuild the bundle so the demo and the tests still agree:

1. Create a temporary entry that renders `<Dropdown />` into `#root` and imports a CSS file containing `@import "tailwindcss";` and an `@source` for this folder.
2. Run `vite build` in library mode (format `iife`, minified, no sourcemaps) with `publicDir: false`, so Vite does not copy the rest of `public/` into the output folder.
3. Output `demo.js` and `demo.css` to `public/match-the-demo/`. `demo.html` only needs a `#root` div and the two tags.
4. Delete the temporary files.

Check the result by loading `/match-the-demo/demo.html` on the dev server.
