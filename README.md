# DSA Practical Library

A static, beginner-friendly learning site built from the nine C practicals in the supplied `DSA Solutions SE` page.

## Run it

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.

No build tools, framework, package installation or server are required. Internet is only used for the optional DM Sans / DM Mono fonts; the site still works with local system fonts if offline.

## Files

- `index.html` — page structure
- `styles.css` — layout, responsive design and light/dark themes
- `programs.js` — the nine rewritten C programs and their learning notes
- `app.js` — search, topic filters, navigation, tabs, theme toggle and copy button

## Learning notes

The code has been rewritten to use clearer names, smaller functions and comments that explain intent. The original practical topics and core data-structure approaches are retained. These are teaching versions, not a claim that every edge case of the source programs has been production-hardened.

The code is intended to be compiled with a C compiler such as GCC. For example:

```bash
gcc assignment-01.c -o assignment
./assignment
```
