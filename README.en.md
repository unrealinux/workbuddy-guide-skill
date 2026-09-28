# workbuddy-guide

An Agent Skill that carries the **complete text** of [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide) — *The WorkBuddy Bluebook* (MIT, 3.2k stars, Chinese) — as local references.

- 28 chapters + appendices + 8 community case studies → `skills/workbuddy-guide/references/chapters/` (49 files, ~500 KB)
- `SKILL.md` is **routing only** (question → which file to read); chapter text loads on demand
- `sync.mjs` re-syncs from upstream incrementally, idempotent, with retries

## Install

Pick one. All four ship the chapter text, so answering needs **no upstream repo and no network**.

**1. pi package (recommended)**

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
pi list          # confirm it loaded
```

**2. npm**

```bash
npm install -g workbuddy-guide-skill   # or: pi install npm:workbuddy-guide-skill
```

**3. Drop it in the Agent Skills directory**

```bash
git clone https://github.com/unrealinux/workbuddy-guide-skill \
  ~/.agents/skills/workbuddy-guide
```

For a project-scoped install, use `<your-repo>/.agents/skills/workbuddy-guide` instead.

**4. zip (no CLI needed, easy to forward to someone)**

Grab `workbuddy-guide-skill-<version>.zip` from [Releases](https://github.com/unrealinux/workbuddy-guide-skill/releases/latest) and extract it into the skills directory:

```bash
unzip workbuddy-guide-skill-1.0.0.zip -d ~/.agents/skills/
```

Windows PowerShell:

```powershell
Expand-Archive .\workbuddy-guide-skill-1.0.0.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

The result must be `~/.agents/skills/workbuddy-guide/SKILL.md` — one level too deep or too shallow and it will not load. The zip bundles `LICENSE`, `NOTICE.md` and `INSTALL.md`, so whoever receives it needs nothing else.

## Update

```bash
pi update --extensions                          # pi package
git -C ~/.agents/skills/workbuddy-guide pull    # clone
# zip: re-download and overwrite (version lives in SKILL.md metadata.version)
```

## What an answer looks like

It never answers from memory. It routes the question to a chapter first, then cites it:

| You ask | It reads | What you get |
| --- | --- | --- |
| "What's the difference between a Skill and a Prompt in WorkBuddy?" | Ch. 5 `references/chapters/part1-ch05.md` | The action first, then the chapter's own comparison |
| "How do I connect an internal system? How do I create a connector?" | Ch. 7 `references/chapters/part1-ch07.md` | What MCP is, plus load/create connector steps, with chapter + file path |
| "How do I follow up on action items after a meeting?" | Ch. 18 `references/chapters/part2-ch17.md` | Decide-before-the-meeting → Tencent Meeting → recording/transcript flow |

For UI, pricing and permission details, answers add "check WorkBuddy's official channels" and link the source chapter — the book was written in 2026 and those details drift.

Note: the chapter text is Chinese. Questions in any language work; the answers come back in Chinese unless you ask for English.

## Repository layout

```text
workbuddy-guide-skill/
├─ package.json
├─ LICENSE / NOTICE.md
└─ skills/
   └─ workbuddy-guide/
      ├─ SKILL.md                 # routing table: question → file
      ├─ references/              # 49 chapters + index + sync caches
      └─ scripts/sync.mjs         # incremental upstream sync
```

## Re-sync the chapter text

```bash
npm run sync:check              # has upstream changed?
npm run sync                    # incremental, writes only changed files
npm run sync -- --force         # rewrite all 49 files
GITHUB_TOKEN=xxx npm run sync   # lifts the GitHub API 60 req/hour limit
```

Media links are rewritten to jsDelivr pinned at the synced commit; cross-chapter links become local filenames. `references/chapters/` is generated — never edit it by hand, edit `sync.mjs` instead.

## License and attribution

- Upstream text: MIT. Upstream `LICENSE` reads `Copyright (c) 2026 WorkBuddy Guide Contributors`; that notice is kept verbatim.
- This skill layer (`SKILL.md`, `scripts/`, `README*`, `NOTICE.md`): MIT.
- Not affiliated with AlephAITech or Tencent. Product details may be out of date — official channels win.
- Full attribution: `NOTICE.md`.

## Known limits

1. Upstream screenshots/videos (178 MB) are not bundled — only jsDelivr links, so images need network.
2. Upstream has two chapter-numbering schemes (the table of contents is off by one from chapter 8 onward). Filenames follow the TOC numbering; `references/INDEX.md` is authoritative.
3. Upstream's last substantive update was 2026-09-18, so product details may lag.
