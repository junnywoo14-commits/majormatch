# 🎓 Major Match

**Find the college major that fits the way you think.**

Lots of high schoolers have no idea what to study. Major Match is a quick interests
quiz that matches a student to college majors using a real similarity algorithm, then
uses AI to give them a personalized, encouraging plan to get started.

Built for a hackathon · theme: **AI × STEM Education**.

---

## How it works

```
[ 18-question quiz ]  →  [ score into 8 interest traits ]  →  [ rank majors by
                                                                cosine similarity ]
                                                                      ↓
[ AI advisor writes a personalized note + 3 first steps ]  ←  [ top major + traits ]
```

1. **Quiz** — the student rates 18 statements (1–5). No sign-up.
2. **Matching (the "ML" part)** — each answer adds to a vector of 8 interest traits
   (analytical, creative, social, etc.). Each major is also a trait vector. We rank
   majors by **cosine similarity** between the student's vector and each major's —
   the same idea behind recommendation systems. See [`scoring.js`](scoring.js).
3. **Results** — best-fit major with a match %, runner-up majors, careers + salaries,
   free starter resources, and role models.
4. **AI advisor** — the student's traits + top major are sent to Google Gemini, which
   writes a short personalized explanation and 3 concrete first steps. The API key
   stays on the server and is never exposed to the browser. See [`lib/advisor.js`](lib/advisor.js).

## Tech stack

- **Frontend:** plain HTML / CSS / JavaScript — no framework, no build step.
- **Backend:** a tiny Node server (`dev-server.js`) locally, or a Vercel serverless
  function (`api/advisor.js`) when deployed. Both share one brain, `lib/advisor.js`.
- **AI:** Google Gemini (free tier).

---

## Run it locally

You need [Node.js](https://nodejs.org) (v21+) and a **free** Gemini API key.

```bash
# 1. clone and enter
git clone https://github.com/junnywoo14-commits/majormatch.git
cd majormatch

# 2. add your free Gemini key
cp .env.example .env
#    then open .env and paste your key from https://aistudio.google.com/apikey

# 3. run
node dev-server.js
```

Open **http://localhost:3000**, take the quiz, and the AI advisor appears on the
results page. (Press `Ctrl+C` to stop.)

> No `npm install` needed — there are zero dependencies.

> The quiz, matching, and results work even without a key; only the AI advisor card
> needs one.

## Deploy (optional)

It also runs on [Vercel](https://vercel.com) with no config:

```bash
npx vercel            # first deploy
npx vercel env add GEMINI_API_KEY   # paste your key
npx vercel --prod     # redeploy with the key
```

---

## Project structure

| File | What it does |
|------|--------------|
| `index.html` | Page shell + fonts |
| `style.css` | All styling (warm, earthy design system) |
| `data.js` | 8 traits · 18 questions · 15 majors |
| `scoring.js` | Cosine-similarity matching engine |
| `script.js` | The three screens: welcome → quiz → results |
| `lib/advisor.js` | Calls Gemini for the personalized note (server-side) |
| `dev-server.js` | Local server (static files + `/api/advisor`) |
| `api/advisor.js` | Vercel serverless version of the same endpoint |
