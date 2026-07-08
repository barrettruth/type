# type

Accuracy-first typing trainer at type.barrettruth.com for QWERTY, Dvorak, Colemak-DH, and Baremak.

The current proof of concept is a static Leptos app with strict wrong-key blocking, data-driven layout diagrams, and a Baremak Right Alt symbol layer preview.

## Development

```sh
nix develop .#ci --command just ci
nix develop .#ci --command just run
```
