# Workflow Quick Reference

## Every project has three phases

> `CLAUDE-EN.md` is the authoritative source for phase definitions. This file is the staff-facing operations guide.

```
Phase 1: Build a demo  (staff-led, no engineer)
    ↓
Phase 2: Engineer handoff  (engineer-led)
    ↓
Phase 3: Add features  (staff-led, on engineer's foundation)
```

---

## Phase 1: Build a demo (no engineer needed)

Turn your idea into a working prototype. No production environment required — just build something you can show and get feedback on.
If the demo needs real data, **Supabase** (free tier) is available. Claude Code will walk you through account creation and setup.

### Steps

1. **Download this template**
   - Clone or download the repository from GitHub
   - Open the folder in Claude Code

2. **Start building**
   - Type **`/start`** (or say "let's begin")
   - Describe what you want in plain language:
     - "I want a property listing page and a detail page"
     - "I need a contact inquiry form"
     - Share reference websites if you have them

3. **Save your work regularly**
   - Type **`/save`** at natural stopping points (or say "save")

4. **Share the demo**
   - Type **`/publish`** (or say "publish" / "share this")
   - A preview URL is generated — share it with your manager, team, or client for feedback

5. **Demo is ready? → Contact the engineer**
   - Let the engineer know: "The demo is done"
   - The engineer takes it from here

---

## Phase 2: Engineer reviews and hardens the code (you wait)

Nothing for staff to do here. The engineer will:

- Review what was built in the demo
- Fix any security vulnerabilities
- Set up Vercel environments and production env vars
- Polish and clean up the code
- Activate Phase 3 protection (creates `.claude/phase3.lock`)

Once you receive a "ready" notification, move to Phase 3.

---

## Phase 3: Add features (on top of the engineer's foundation)

Use the repository the engineer prepared to add screens and features.

### Steps

1. **Clone the engineer's repository**
   - Open the folder in Claude Code

2. **Start building**
   - Type **`/start`**
   - Claude will summarize the current state and what's already been built

3. **Add features**
   - Give instructions in plain language: "Add a filter to the property listing page"
   - Do not modify the database, authentication, or API configuration the engineer set up

4. **Save, check, publish**
   - Use the `/save` → `/check` → `/publish` flow as usual

### Phase 3 rules

- ⚠️ Do not modify the database, login system, or API configuration (hooks block this automatically)
- ⚠️ Do not write API keys or passwords in the code
- ✅ You are free to create and modify screen designs and add new pages

---

## If something goes wrong

- Tell Claude Code "There's an error. Please fix it"
- If a hook shows "🚫" and stops → follow the "✅ Correct procedure" in the message
- If Claude says "Please consult the engineer" → contact the engineer
