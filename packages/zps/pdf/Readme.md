# Pdf

## compile Pdf

### Note

you have to in your root path(which package.json exits path to run scripts)

### pre software

- git
- make
- node

### what if pdf component for pdf?

Mupdf -- a C library for parse PDF files.
Pdf use Mupdf as wasm's source code , generate wasm file for render pdf files.

> what we did was we change our own wrap.c to overwride `Mupdf wasm demo` to custum it.

```
lib/mupdf/src/platform/wasm/wrap.c --> Mupdf wasm demo
lib/mupdf/wrap.c --> custome
```

### prepare enviroment and compile

> if you use zsh(mac or linux zsh), just run follow commands.
> if you use windows, perhaps read the shell and do it manually, i don't have windows, so I cannot test, welcome pr.

```
1. install and config emcc:(for zsh)

> npm runinstall:emcc

2. compile mupdf

> npm run build:mupdf


```

### change wrap.c and recompile it

> npm run build:mupdf
