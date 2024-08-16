Destructible pixel terrain
===

Library works on binary data (e.g. from getImageData from Canvas). It doesn't contain any renderer. This is a new library so treat it as WIP.

It allows you to create game level from pixels. Terrain fragments will fall if there's nothing under them. Look into:
- test cases: [terrpixel.test.js](terrpixel.test.js)
- [example.html](example.html) (notice that this example needs some kind of server to run. You can run server on localhost via `python3 -m http.server`

API is not stable and can change any moment
