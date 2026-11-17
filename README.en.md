# ai-work-assistant-playbook

An Agent Skill that carries the **complete text** of two Chinese community playbooks locally:

- [AlephAITech/WorkBuddyGuide](https://github.com/AlephAITech/WorkBuddyGuide) — *The WorkBuddy Playbook* (MIT, 3.2k stars): 28 chapters + appendices + 8 community case studies, 49 files, ~500 KB
- [AlephAITech/DoubaoWorkGuide](https://github.com/AlephAITech/DoubaoWorkGuide) — *The Doubao Work Playbook* (MIT): 50 articles, ~165 KB

`SKILL.md` decides which product a question is about, then routes to the right file; text loads on demand. Two sync scripts keep each corpus current.

## Install

Pick one. All four ship the full text, so answering needs **no upstream repo and no network**.

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
  ~/.agents/skills/ai-work-assistant-playbook
```

For a project-scoped install, use `<your-repo>/.agents/skills/ai-work-assistant-playbook` instead.

**4. zip (no CLI needed, easy to forward to someone)**

Grab `ai-work-assistant-playbook-<version>.zip` from [Releases](https://github.com/unrealinux/workbuddy-guide-skill/releases/latest) and extract it into the skills directory:

```bash
unzip ai-work-assistant-playbook-*.zip -d ~/.agents/skills/
```

Windows PowerShell:

```powershell
Expand-Archive .\ai-work-assistant-playbook-*.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

The result must be `~/.agents/skills/ai-work-assistant-playbook/SKILL.md` — one level too deep or too shallow and it will not load. The zip bundles its own `README.md` / `README.en.md` plus `LICENSE`, `NOTICE.md` and `CHANGELOG.md`, so whoever receives it needs nothing else.

## Update

```bash
pi update --extensions                          # pi package
git -C ~/.agents/skills/ai-work-assistant-playbook pull    # clone
# zip: re-download and overwrite (version lives in SKILL.md version)
```

## What an answer looks like

It never answers from memory. It picks the product first, routes the question to a chapter, then cites it:

| You ask | It reads | What you get |
| --- | --- | --- |
| "What's the difference between a Skill and a Prompt in WorkBuddy?" | Ch. 5 `workbuddy/part1-ch05.md` | The action first, then the chapter's own comparison |
| "How do I connect an internal system? How do I create a connector?" | Ch. 7 `workbuddy/part1-ch07.md` | What MCP is, plus load/create connector steps, with chapter + file path |
| "How do I build a scheduled task in Doubao Work that doesn't fail?" | `doubao/part1-10.md` | The settings that matter plus stability caveats |
| "Doubao Work or WorkBuddy — which should I use?" | one article from each | Product positioning first, then fit for each |

For UI, pricing and permission details, answers add "check the official channels" and link the source chapter — the books were written in 2026 and those details drift.

Note: the source text is Chinese. Questions in any language work; answers come back in Chinese unless you ask for English.

## Repository layout

```text
workbuddy-guide-skill/
├─ package.json
├─ LICENSE / NOTICE.md / CHANGELOG.md
├─ packaging/                    # manuals shipped inside the zip
├─ scripts/                      # release tooling: build-zip.mjs, check-version.mjs
└─ skills/
   └─ ai-work-assistant-playbook/
      ├─ SKILL.md                 # product gate + two routing tables
      ├─ workbuddy/               # 49 chapters + index + sync caches (~500 KB)
      │  └─ part1-ch01.md …       # sits beside INDEX.md, no chapters/ subfolder
      ├─ doubao/                  # 50 articles + index + sync caches (~165 KB)
      │  └─ part1-01.md …
      └─ scripts/
         ├─ sync.mjs              # incremental WorkBuddy sync
         └─ sync-doubao.mjs       # incremental Doubao Work sync
```

## Re-sync the text

```bash
npm run sync:check              # has WorkBuddy upstream changed?
npm run sync                    # incremental, writes only changed files
npm run sync:doubao:check       # has Doubao Work upstream changed?
npm run sync:doubao             # incremental, rewrites the 50 articles
GITHUB_TOKEN=xxx npm run sync   # lifts the GitHub API 60 req/hour limit
```

WorkBuddy media links are rewritten to jsDelivr pinned at the synced commit, cross-chapter links become local filenames. Doubao's single `site-content.json` is split into 50 files, `/media/...` becomes a doubaowork.homes link, and `INDEX.md` is regenerated. `workbuddy/`、`doubao/` 下的正文 is generated — never edit it by hand.

## License and attribution

- Upstream text: MIT for both. `Copyright (c) 2026 WorkBuddy Guide Contributors` and `Copyright (c) 2026 DoubaoWork Guide Contributors`; both notices are kept verbatim in `LICENSE`.
- This skill layer (`SKILL.md`, `scripts/`, `README*`, `NOTICE.md`): MIT.
- Not affiliated with AlephAITech, Tencent or ByteDance. Product details may be out of date — official channels win.
- Full attribution: `NOTICE.md`.

## Known limits

1. Upstream screenshots/videos are not bundled (WorkBuddy ~178 MB, Doubao Work ~700 MB) — only links, so images need network.
2. WorkBuddy has two chapter-numbering schemes (the table of contents is off by one from chapter 8 onward). Filenames follow the TOC numbering; `workbuddy/INDEX.md` is authoritative.
3. Doubao Work has no chapter numbers; entries are grouped as usage (12), basics (6) and scenarios (31) — see `doubao/INDEX.md`.
4. Either upstream may lag product changes; run its `--check`.
