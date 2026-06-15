# Major Match — Hackathon Submission

**Tagline:** Find the college major that fits the way you think — a 4-minute quiz that
matches students to majors with real ML, then uses AI to tell them how to start.

**Theme:** AI × STEM Education

**Live demo:** https://majormatchdeltastem.vercel.app
**Code:** https://github.com/junnywoo14-commits/majormatch

---

## Inspiration

A lot of high schoolers (me included) have no real idea what we want to study. We have
to pick classes now and a major soon, but the usual advice is "follow your passion" —
which isn't helpful when you don't know what your passion *is* yet. I wanted to build
something that turns "I have no idea" into an actual starting point: a few honest
questions, a real recommendation, and a concrete first step you can take this week.

## What it does

1. **Take a quick quiz** — 18 statements you rate 1–5 ("not at all me" → "totally me").
   No sign-up, about 4 minutes.
2. **Get matched** — your answers are scored across 8 interest traits, and the app ranks
   15 college majors by how well they fit you, with a match percentage.
3. **Explore your fit** — each major shows related careers and salaries, free starter
   resources, and role models in the field.
4. **Get an AI plan** — an AI advisor reads your top traits and best-fit major and writes
   you a personalized note explaining *why* it fits, plus 3 concrete free first steps to
   explore it this month.

## How it works

```
18-question quiz  →  score into 8 interest traits  →  rank majors by cosine similarity
                                                              │
        AI advisor: personalized note + 3 first steps  ←──────┘
```

- **The matching is real machine learning, not a lookup table.** Each answer adds to a
  vector across 8 interest traits (analytical, creative, social, investigative, building,
  enterprising, nature, tech). Every major is also represented as a trait vector. The app
  ranks majors by **cosine similarity** between the student's vector and each major's —
  the same core idea behind recommendation systems. Scores are normalized to an
  encouraging 60–98% range so even the top match feels earned, not fake-perfect.
- **The AI is grounded in the result.** The student's strongest traits and top major are
  sent to Google Gemini, which generates the personalized explanation and action steps.
  The AI builds *on top of* the deterministic match — it doesn't replace it.
- **The API key is handled securely.** The key never touches the browser. All AI calls go
  through a small backend (a serverless function on Vercel) that holds the key as an
  environment variable.

## How I built it

- **Frontend:** plain HTML, CSS, and JavaScript — no framework and no build step. I chose
  vanilla on purpose so I could understand every line instead of relying on a framework's
  magic.
- **Matching engine:** a ~70-line JavaScript file that builds the trait profile and
  computes cosine similarity. Runs instantly in the browser.
- **Backend:** the same logic powers two "doors" — a tiny Node server for local
  development, and a Vercel serverless function (`/api/advisor`) in production. Both call
  a single shared module so there's no duplicated logic.
- **AI:** Google Gemini (`gemini-2.5-flash`) via its REST API.
- **Hosting:** deployed on Vercel (free tier), connected to GitHub so every push
  auto-deploys.

## Challenges I ran into

- **You can't put an API key in frontend code.** My first instinct was to call the AI
  straight from JavaScript, but anyone could open the page source and steal the key. I had
  to learn the real pattern: a backend that holds the secret and proxies the request. That
  reshaped the whole architecture.
- **The "free" AI tier wasn't free for every model.** My Gemini key returned `limit: 0`
  free quota on the default model (`gemini-2.0-flash`). I had to debug the 429 error, list
  the models my key could actually access, and switch to `gemini-2.5-flash`, which had
  working quota. I also disabled the model's "thinking" step to keep responses fast.
- **Keeping the quiz on one screen.** The step-by-step quiz kept overflowing and forcing
  the user to scroll. I had to lock it to the viewport height and center it so each
  question fits cleanly.
- **Keeping results encouraging.** Early on, disagreeing with questions actively tanked
  unrelated majors. I floored negative trait scores at zero so a "no" never punishes a
  major it has nothing to do with.

## Accomplishments I'm proud of

- A real, deployed, working product with a shareable link — not just a mockup.
- The matching is genuine ML I can actually explain, not a hardcoded if/else.
- I handled the API key securely instead of taking the unsafe shortcut.
- I built the whole frontend from scratch in vanilla code and understand all of it.

## What I learned

- How websites actually run: the split between structure (HTML), style (CSS), and
  behavior (JavaScript), and how JavaScript edits the page through the DOM.
- That cosine similarity and feature vectors are a real, practical recommendation
  technique — and how to implement them by hand.
- Why secrets can't live in the browser, and how serverless functions solve it.
- How to deploy a real app, manage environment variables, and ship continuously from
  GitHub.

## What's next

- **Chat advisor:** let students ask follow-up questions about a major ("is it a lot of
  math?") and get answers in context.
- **More majors and questions:** the data and scoring scale automatically, so the quiz can
  grow without code changes.
- **Save/share results:** a link students can send to a parent or counselor.
- **Real-world data:** back the major trait-vectors with public O*NET interest profiles.

## Built with

`javascript` · `html` · `css` · `node.js` · `vercel` · `google-gemini` · `cosine-similarity`
