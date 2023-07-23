# zim

  <p align="center">Make you a better vim</p>

[![GitHub license](https://img.shields.io/github/license/happysmile12321/zim)](https://github.com/happysmile12321/zim/blob/master/LICENSE)

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [Ability](#Ability)
- [Usage](#usage)
  - [Architecture](#architecture)
- [Install(TODO)](#install)
- [Development](#development)
  - [ZUI](#zui)
- [Source](#source)
  - [reduce4 Organization](#reduce4)

<!-- markdown-toc end -->

# Ability

- [ ] langchain (AI)
- [ ] editor (editor)
- [x] pdf (file render)

# Usage

## architecture

- react
  - zim application layer
- slate.js
  - zim kernal
- leafer.js
  - zim canvas render backend
- coc.nvim
  - zim lsp complete
- pnpm(workspace)
  - monorepo
- zps
  - zim plugin system
- vscode remote
  - zim backend design
- ant design
  - zui design goal

### architectureGraph

#### v1

![architecture v1](./assets/architecture-v1.png)

# install

TODO

# usage

TODO

# development

## zui

zui is the ui library for zim.

```sh
pnpm run ui
```

# Source

zim is `z` and `vim`.

`z` is the last of alphabet, and never be the hot word.

`vim` is a life style.

We usually use different tools to manage our life, we often change between about them, we ofter make choice, make choice is expensive.

## reduce4

we, zimer, comes from an organization named reduce4.

this organization has defined a life style of simple.

zim is an try make reduce4's best ideas to the world.
