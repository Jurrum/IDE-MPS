# Project Instructions for Claude

## Command Execution Workflow
When executing any commands or making changes, always follow these steps:

1. **Plan First**: Use TodoWrite to create a task list for multi-step operations
2. **Understand Context**: Read relevant files and understand the codebase structure
3. **Execute Safely**: Run commands with proper error handling
4. **Verify Results**: Check that changes work as expected
5. **Run Quality Checks**: Execute lint, typecheck, and test commands if available
6. **Mark Complete**: Update todo status as tasks are finished

## Quality Standards
- Always run `npm run lint` and `npm run typecheck` (or equivalent) after code changes
- Run tests with `npm test` (or equivalent) to verify functionality
- Follow existing code conventions and patterns
- Never commit changes unless explicitly requested

## Project-Specific Commands
Add your project's specific commands here, for example:
- Test command: `npm test`
- Lint command: `npm run lint`
- Build command: `npm run build`
- Development server: `npm run dev`

## Documentation & Backlog Policy (Always-On)

Claude must continuously document every meaningful action to ensure full traceability. Do not skip documentation, even for small changes. Use the following artifacts and conventions:

1. Backlog (chronological development record)
   - File: `round-01/backlog.md`
   - Every multi-step task or change must append a new entry using the template below.
   - Include timestamps, objectives, rationale, prompts, commands, results, diffs/summary of changes, verification, and next steps.

2. Prompt Log (all prompts given and assistant responses)
   - Directory: `round-01/prompts/`
   - Create a new file per session or major task: `YYYY-MM-DD_HHMM-task-slug.md`
   - Record: exact user prompts, system/developer instructions if applicable, and assistant responses; link entries back to `backlog.md`.

3. Evidence
   - Save visual or data evidence under the round folder when relevant:
     - Screens/GIFs: `round-01/assets/`
     - Sample data: `round-01/data/`
   - Reference these assets from the backlog entry.

4. Changelog (course-level)
   - Optional central log: `make-it-prototyping/docs/changelog.md`
   - Summarize high-level milestones and link to relevant backlog entries.

### Backlog Entry Template

Copy and append this to `round-01/backlog.md` for each task:

```md
## [YYYY-MM-DD HH:MM] <Task Title>

### Objective
What are we trying to achieve and why?

### Context
Relevant files/dirs: `path/to/file`, `round-01/src/`, etc. Links to README/recipe.

### Plan (TodoWrite)
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

### Prompts & Commands
- Prompts used (link to `prompts/YYYY-MM-DD_HHMM-task-slug.md`)
- Commands executed with flags and cwd

### Changes Made
- Summary of edits (files, functions, rationale)
- Diffs or key excerpts if helpful

### Results & Verification
- What happened? Output, screenshots, logs
- Lint/typecheck/test status

### Issues/Risks
- Known issues, blockers, trade-offs

### Next Steps
- Immediate follow-ups and owners
```

### Prompt Log Template

Save as `round-01/prompts/YYYY-MM-DD_HHMM-task-slug.md`:

```md
# Prompt Log — <task-slug> — YYYY-MM-DD HH:MM

## System/Developer Instructions (if any)
<paste>

## User Prompt(s)
<paste exact text>

## Assistant Response(s)
<paste>

## References
- Linked backlog entry: `<link or section anchor>`
```

### Workflow Hooks (tie-in with Command Execution Workflow)
- Plan First → Create/Update a Backlog entry (Plan section) and a Prompt Log file.
- Understand Context → Note relevant files/dirs in Backlog Context.
- Execute Safely → Record exact commands in Backlog.
- Verify Results → Capture outputs; run `npm run lint`, `npm run typecheck`, `npm test` where applicable; record status.
- Mark Complete → Check off plan items; add Next Steps.

### Naming Conventions
- Timestamps: `YYYY-MM-DD HH:MM` (local time)
- Prompt files: `YYYY-MM-DD_HHMM-task-slug.md`
- Task slugs: `kebab-case` summaries (e.g., `react-p5-setup`).

### Privacy & Secrets
- Never include secrets in logs or prompts. Redact and store secrets only in `environment/.env` files. Reference as `<REDACTED>` in documentation.

By following this policy, every change remains auditable and reproducible across the entire Round 01 lifecycle.