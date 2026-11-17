# AI Office Assistant Playbook (v{{VERSION}})

The complete text of two Chinese community playbooks plus a routing layer, packaged as a local Agent Skill: Tencent WorkBuddy and ByteDance Doubao Work. Answers read the local text — no model memory, no network.

- Volume 1 · WorkBuddy: 28 chapters + appendices + 8 community cases, 49 files (~540 KB)
- Volume 2 · Doubao Work: 50 articles (~165 KB)
- `SKILL.md` decides which product is being asked about, then routes (question → which file); text loads on demand and does not sit in context
- Answers cite chapter numbers and file paths, so anyone can trace them back

## 1. Install

Drop the whole `ai-work-assistant-playbook/` directory into a skills directory your agent reads:

| Scope | Target |
| --- | --- |
| All projects on this machine (recommended, tool-agnostic) | `~/.agents/skills/` |
| pi only | `~/.pi/agent/skills/` |
| One project only | `<project>/.agents/skills/` |

Extract (macOS / Linux / Git Bash):

```bash
unzip ai-work-assistant-playbook-{{VERSION}}.zip -d ~/.agents/skills/
```

Windows PowerShell:

```powershell
Expand-Archive .\ai-work-assistant-playbook-{{VERSION}}.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

Or skip the zip:

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
git clone https://github.com/unrealinux/workbuddy-guide-skill ~/.agents/skills/ai-work-assistant-playbook
```

## 2. Check it loaded

1. The file must exist (one level too deep or too shallow and it will not load):

   ```bash
   ls ~/.agents/skills/ai-work-assistant-playbook/SKILL.md
   ```

2. Ask a WorkBuddy or Doubao Work question and see whether it reads files under `workbuddy/` or `doubao/`.
   In pi you can force it with `/skill:ai-work-assistant-playbook <question>`.

3. Nothing happens? Check the directory is named `ai-work-assistant-playbook`, that there is no duplicate copy, then restart the agent — skill lists are scanned at startup.

## 3. How to use it

Just ask. No need to announce the skill first. Typical questions:

| You ask | It reads | What you get |
| --- | --- | --- |
| What's the difference between a Skill and a Prompt in WorkBuddy? | Ch. 5 `workbuddy/part1-ch05.md` | The action first, then the chapter's own comparison |
| How do I create a connector? How do I connect an internal system? | Ch. 7 `workbuddy/part1-ch07.md` | What MCP is, plus load/create steps with chapter + file path |
| How do I build a scheduled task in Doubao Work that doesn't fail? | `doubao/part1-10.md` | The settings that matter plus stability caveats |
| Doubao Work or WorkBuddy — which should I use? | one article from each | Product positioning first, then fit for each |

Habits: reads 1–2 files per answer; UI, pricing and permission details get "check official channels" plus a source link; steps the text does not contain are not invented.

## 4. Update

Re-download the zip and overwrite, or `git -C ~/.agents/skills/ai-work-assistant-playbook pull` for a clone install.
The installed version is in `SKILL.md` under `version`; changes are listed in `CHANGELOG.md`.

When upstream changes, use the two scripts in the repo (Node.js 20+):
`npm run sync:check` / `npm run sync` (WorkBuddy), `npm run sync:doubao:check` / `npm run sync:doubao` (Doubao Work).

## 5. Uninstall

Delete the directory: `rm -rf ~/.agents/skills/ai-work-assistant-playbook`. The skill touches nothing else and leaves no registry entries.

## 6. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Agent does not see the skill | Wrong nesting | Must be `~/.agents/skills/ai-work-assistant-playbook/SKILL.md`; if you extracted a double `ai-work-assistant-playbook/ai-work-assistant-playbook/`, delete the outer one |
| Duplicate skill warning | Installed twice | Keep one copy only (e.g. both a `git clone` and a zip extract) |
| Short answers, no citations | Routing not triggered | Mention the product (WorkBuddy / Doubao Work), or load it with `/skill:ai-work-assistant-playbook` |
| It answered about the wrong product | Routed without checking | Say "I mean Doubao Work" or "I mean WorkBuddy" |
| Images do not load | Media is not bundled (upstream 178 MB / 700 MB) | Links point to jsDelivr and doubaowork.homes and need network |
| Chapter numbers disagree with the TOC | WorkBuddy upstream has two numbering schemes | `workbuddy/INDEX.md` is authoritative: the TOC is off by one from chapter 8 onward |

## 7. Layout

```text
ai-work-assistant-playbook/
├─ SKILL.md              # product gate + two routing tables
├─ README.md / README.en.md
├─ CHANGELOG.md
├─ LICENSE / NOTICE.md
├─ workbuddy/            # 49 files (see INDEX.md)
│  ├─ INDEX.md
│  ├─ .source.json
│  └─ part1-ch01.md …
├─ doubao/               # 50 files
│  ├─ INDEX.md
│  ├─ .source.json
│  └─ part1-01.md …
└─ scripts/
   ├─ sync.mjs           # WorkBuddy sync
   └─ sync-doubao.mjs    # Doubao Work sync
```

## 8. Version and license

- Version: `{{VERSION}}` (built {{DATE}})
- Source text is MIT for both:
  - AlephAITech/WorkBuddyGuide — `Copyright (c) 2026 WorkBuddy Guide Contributors`
  - AlephAITech/DoubaoWorkGuide — `Copyright (c) 2026 DoubaoWork Guide Contributors`
  - Both notices are kept verbatim
- This skill layer: MIT, see `LICENSE`; full attribution in `NOTICE.md`
- Not affiliated with AlephAITech, Tencent or ByteDance. UI, pricing and permissions are governed by the official channels
