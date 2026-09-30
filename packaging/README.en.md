# WorkBuddy Bluebook Skill (v{{VERSION}})

The full text of *The WorkBuddy Bluebook* (Chinese) plus a routing layer, packaged as a local Agent Skill. When you ask about WorkBuddy it reads the bundled chapters instead of guessing, and it needs no network.

- 28 chapters + appendices + 8 community case studies = 49 files (~540 KB)
- `SKILL.md` routes only (question -> which file); chapter text loads on demand
- Answers cite the chapter number and file path so you can trace them back

Note: the reference text is Chinese. Ask in any language; answers come back in Chinese unless you ask for English.

## 1. Install

Drop the whole `workbuddy-guide/` directory into a skills directory your agent reads:

| Scope | Target |
| --- | --- |
| All projects, any agent (recommended) | `~/.agents/skills/` |
| pi only | `~/.pi/agent/skills/` |
| One project | `<project>/.agents/skills/` |

macOS / Linux / Git Bash:

```bash
unzip workbuddy-guide-skill-{{VERSION}}.zip -d ~/.agents/skills/
```

Windows PowerShell:

```powershell
Expand-Archive .\workbuddy-guide-skill-{{VERSION}}.zip -DestinationPath "$env:USERPROFILE\.agents\skills"
```

Alternatives that skip the zip:

```bash
pi install git:github.com/unrealinux/workbuddy-guide-skill
git clone https://github.com/unrealinux/workbuddy-guide-skill ~/.agents/skills/workbuddy-guide
```

## 2. Verify it loaded

1. `ls ~/.agents/skills/workbuddy-guide/SKILL.md` — one level too deep or too shallow will not load.
2. Ask a WorkBuddy question; the answer should read a file under `references/chapters/` and cite it.
3. In pi you can force it with `/skill:workbuddy-guide <question>`.
4. Nothing happens? Check the directory is named `workbuddy-guide`, that there is no duplicate copy, then restart the agent — skill lists are scanned at startup.

## 3. Use

Just ask. You do not have to name the skill first.

| Ask | It reads | You get |
| --- | --- | --- |
| What's the difference between a Skill and a Prompt in WorkBuddy? | Ch. 5 `references/chapters/part1-ch05.md` | The action first, then the chapter's own comparison |
| How do I connect an internal system? How do I create a connector? | Ch. 7 `references/chapters/part1-ch07.md` | What MCP is, plus load/create connector steps, with citations |
| How do I follow up on action items after a meeting? | Ch. 18 `references/chapters/part2-ch17.md` | Decide-before-the-meeting -> Tencent Meeting -> recording/transcript flow |

Habits to expect: one or two chapters per question; UI, pricing and permission details come with "check WorkBuddy's official channels" plus the source link; steps that are not in the book are not invented.

## 4. Update and uninstall

Re-download the zip and overwrite, or `git -C ~/.agents/skills/workbuddy-guide pull` for a clone install.
The installed version is in `SKILL.md` under `metadata.version`; changes are listed in `CHANGELOG.md`.

To re-sync the chapter text from upstream you need Node.js 20+ and the repo's `scripts/sync.mjs` (`npm run sync:check`, `npm run sync`).

Uninstall: delete the directory. The skill writes nothing else.

## 5. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Agent does not see the skill | Wrong nesting | Must be `~/.agents/skills/workbuddy-guide/SKILL.md`; if you extracted a double `workbuddy-guide/workbuddy-guide/`, delete the outer one |
| Duplicate-name warning | Installed twice | Keep one copy (for example both a git clone and an unzipped folder) |
| Short answers, no citations | Routing not triggered | Include the word WorkBuddy, or load it explicitly with `/skill:workbuddy-guide` |
| Images do not open | Image files are not bundled | They are jsDelivr links and need network; switch the host to `raw.githubusercontent.com` if jsDelivr is unreachable |
| Chapter numbers look off | Upstream has two numbering schemes | `references/INDEX.md` is authoritative; the upstream table of contents is one behind from chapter 8 onward |

## 6. Layout, version, license

```text
workbuddy-guide/
├─ SKILL.md              # routing table: question -> file
├─ README.md / README.en.md
├─ CHANGELOG.md
├─ LICENSE / NOTICE.md
└─ references/
   ├─ INDEX.md           # 49 files with chapter numbers, names, sizes
   ├─ .source.json       # synced commit and content hashes
   └─ chapters/          # 49 chapter files
```

- Version {{VERSION}} (built {{DATE}})
- Upstream text: MIT, `Copyright (c) 2026 WorkBuddy Guide Contributors`; that notice is kept verbatim, see `NOTICE.md`
- This skill layer: MIT, see `LICENSE`
- Not affiliated with AlephAITech or Tencent WorkBuddy. UI, pricing and permissions change; official channels win.
