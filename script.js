/* Major Match — app behavior (vanilla recreation of the React design)
 *
 * Three screens swap in and out of #root: welcome -> quiz -> results.
 * State lives in two variables: the user's answers, and which question
 * we're on. Each render builds an HTML string and drops it into the page,
 * then wires up the buttons — the same pattern throughout.
 */

const appRoot = document.getElementById("appRoot");
const root = document.getElementById("root");

// --- app state ---
let answers = {};   // { q1: 4, q2: 2, ... }  (1..5)
let quizIndex = 0;  // which question the step-quiz is showing

// 5-point agree scale (label + the number that gets stored)
const AGREE_LABELS = [
  { v: 1, label: "Not at all me", tag: "1" },
  { v: 2, label: "Not really", tag: "2" },
  { v: 3, label: "Neutral", tag: "3" },
  { v: 4, label: "Sounds like me", tag: "4" },
  { v: 5, label: "Totally me", tag: "5" },
];

// First letter(s) of a name -> a short monogram for the badges/avatars.
function monogram(name) {
  const words = name.replace(/&/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2);
  return (words[0][0] + words[1][0]).toUpperCase();
}

function badgeHTML(major, sm) {
  return `<div class="badge tone-${major.tone}${sm ? " sm" : ""}" aria-hidden="true">${monogram(major.name)}</div>`;
}

/* ====================================================================
   WELCOME SCREEN
   ==================================================================== */
function renderWelcome() {
  appRoot.classList.remove("quiz-fit");
  const count = QUESTIONS.length;

  const previewOpts = ["Not really me", "Neutral", "Sounds like me", "Totally me"];
  const steps = [
    { n: 1, t: "Answer", d: "Rate quick statements about what you like — there are no wrong answers." },
    { n: 2, t: "Match", d: "We score your interests across 8 traits and rank the majors that fit." },
    { n: 3, t: "Explore", d: "Get careers, salaries, free starter resources, and role models for each." },
  ];

  root.innerHTML = `
    <div class="stage">
      <div class="welcome-grid">
        <div>
          <div class="eyebrow-chip pop"><span class="ec-dot" aria-hidden="true"></span><span>Built for <strong>Students</strong></span></div>
          <h1 class="display pop-2">Find the major that fits the way you think.</h1>
          <p class="lede pop-3">
            Answer ${count} quick questions about what you enjoy. We'll match you to college majors
            that fit you — plus careers, free courses, and prominent figures in the field.
          </p>
          <div class="cta-row pop-3">
            <button class="btn btn-primary" id="startBtn">Start the quiz →</button>
            <span class="btn btn-ghost" style="pointer-events:none">No sign-up needed</span>
          </div>
          <div class="meta-row pop-3">
            <span>${count} questions</span>
            <span class="meta-dot"></span>
            <span>about 4 minutes</span>
            <span class="meta-dot"></span>
            <span>${MAJORS.length} majors</span>
          </div>
        </div>

        <div class="pop-3">
          <div class="preview-card">
            <div class="pc-q">"I'm curious about how apps, computers, and AI actually work."</div>
            <div class="pc-scale">
              ${previewOpts.map((o, i) => `<div class="pc-opt${i === 3 ? " sel" : ""}"><span class="pc-radio"></span>${o}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="steps">
        ${steps.map((s) => `
          <div class="step-card">
            <div class="step-num">${s.n}</div>
            <h3>${s.t}</h3>
            <p>${s.d}</p>
          </div>`).join("")}
      </div>
    </div>`;

  document.getElementById("startBtn").onclick = () => {
    answers = {};
    quizIndex = 0;
    renderQuiz();
    window.scrollTo({ top: 0 });
  };
}

/* ====================================================================
   QUIZ SCREEN (step mode: one statement at a time, auto-advances)
   ==================================================================== */
function renderQuiz() {
  appRoot.classList.add("quiz-fit"); // lock to one screen, no scroll

  root.innerHTML = `
    <div class="stage quiz-narrow narrow">
      <div class="quiz-head">
        <div class="quiz-head-inner">
          <button class="iconbtn" id="quizBack" aria-label="Back">←</button>
          <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
          <span class="progress-label" id="progressLabel"></span>
        </div>
      </div>
      <div class="q-fill">
        <div class="q-card" id="qCard"></div>
      </div>
    </div>`;

  document.getElementById("quizBack").onclick = () => {
    if (quizIndex > 0) {
      quizIndex--;
      showQuestion();
    } else {
      renderWelcome(); // backing out of the first question returns home
    }
  };

  showQuestion();
}

// Render the current question into #qCard and wire up its answer buttons.
function showQuestion() {
  const q = QUESTIONS[quizIndex];
  const total = QUESTIONS.length;
  const answered = answers[q.id] != null;
  const progress = Math.round(((quizIndex + (answered ? 1 : 0)) / total) * 100);

  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("progressLabel").textContent = `${quizIndex + 1} / ${total}`;

  const card = document.getElementById("qCard");
  card.innerHTML = `
    <div class="q-count">Question ${quizIndex + 1}</div>
    <div class="q-text">"${q.text}"</div>
    <div class="agree-scale" role="radiogroup" aria-label="How much is this like you?">
      ${AGREE_LABELS.map((o) => `
        <button class="agree-opt${answers[q.id] === o.v ? " sel" : ""}" data-v="${o.v}" role="radio" aria-checked="${answers[q.id] === o.v}">
          <span class="dot" aria-hidden="true"></span>${o.label}<span class="emoji">${o.tag}</span>
        </button>`).join("")}
    </div>`;

  // Restart the slide-in animation each time we show a new question.
  card.classList.remove("swap");
  void card.offsetWidth; // force reflow so the animation can replay
  card.classList.add("swap");

  card.querySelectorAll(".agree-opt").forEach((btn) => {
    btn.onclick = () => pick(parseInt(btn.dataset.v, 10));
  });
}

// Record an answer, show it as selected, then auto-advance.
function pick(val) {
  const q = QUESTIONS[quizIndex];
  const total = QUESTIONS.length;
  answers[q.id] = val;

  // reflect the selection immediately
  document.querySelectorAll(".agree-opt").forEach((b) =>
    b.classList.toggle("sel", parseInt(b.dataset.v, 10) === val)
  );
  document.getElementById("progressFill").style.width =
    Math.round(((quizIndex + 1) / total) * 100) + "%";

  // advance after a short beat so the user sees their choice land
  if (quizIndex < total - 1) {
    setTimeout(() => {
      quizIndex++;
      showQuestion();
    }, 260);
  } else {
    setTimeout(finishQuiz, 320);
  }
}

function finishQuiz() {
  window.scrollTo({ top: 0 });
  renderResults();
}

/* ====================================================================
   RESULTS SCREEN
   ==================================================================== */
function renderResults() {
  appRoot.classList.remove("quiz-fit");

  const result = scoreMajors(answers);   // <-- the ML step runs here
  const ranked = result.ranked;
  const top = ranked[0];
  const runners = ranked.slice(1, 4);
  const traitLabels = result.topTraits.map((t) => TRAITS[t].label);
  let selId = top.major.id; // which major's detail is currently shown

  root.innerHTML = `
    <div class="stage">
      <div class="res-eyebrow eyebrow pop">Your best-fit major</div>

      <div class="hero-major pop-2">
        ${badgeHTML(top.major, false)}
        <div>
          <div class="hm-name">${top.major.name}</div>
          <div class="hm-tag">${top.major.tagline}</div>
          <div class="hm-why">
            ${traitLabels.length ? `<span style="font-size:13px;font-weight:700;color:var(--ink-faint);align-self:center">Because you're</span>` : ""}
            ${traitLabels.map((t) => `<span class="trait-chip">${t}</span>`).join("")}
          </div>
        </div>
        ${ringHTML(top.pct)}
      </div>

      <div class="section-title">Your AI advisor <span class="st-line"></span></div>
      <div class="info-card" id="aiAdvisor" style="white-space:pre-wrap;line-height:1.6;color:var(--ink-soft);min-height:64px">Thinking through your results…</div>

      ${runners.length ? `
        <div class="section-title">Other strong fits <span class="st-line"></span></div>
        <div class="runners">
          ${runners.map((r) => `
            <button class="runner" data-id="${r.major.id}">
              ${badgeHTML(r.major, true)}
              <div>
                <div class="r-name">${r.major.name}</div>
                <div class="r-pct">${r.pct}% match</div>
              </div>
            </button>`).join("")}
        </div>` : ""}

      <div class="section-title" id="detailTitle"></div>
      <div id="detailContainer"></div>

      <div class="res-actions">
        <button class="btn btn-primary" id="retakeBtn">↺ Retake the quiz</button>
        <button class="btn btn-soft" id="printBtn">Save / print results</button>
      </div>
    </div>`;

  // Draw + animate the match ring on the hero.
  animateRing(top.pct);

  // Ask the AI for a personalized note (needs the local server running).
  loadAdvisor(top, traitLabels);

  // The bottom detail section swaps when you click a runner-up.
  function renderDetail() {
    const entry = ranked.find((r) => r.major.id === selId) || top;
    const isTop = entry.major.id === top.major.id;
    document.getElementById("detailTitle").innerHTML =
      `Get started with ${isTop ? "your match" : "this major"} <span class="st-line"></span>`;
    document.getElementById("detailContainer").innerHTML = detailHTML(entry, isTop);
    document.querySelectorAll(".runner").forEach((b) =>
      b.classList.toggle("active", b.dataset.id === selId)
    );
    const back = document.getElementById("backToTop");
    if (back) back.onclick = (e) => { e.preventDefault(); selId = top.major.id; renderDetail(); };
  }
  renderDetail();

  document.querySelectorAll(".runner").forEach((b) => {
    b.onclick = () => { selId = b.dataset.id; renderDetail(); };
  });
  document.getElementById("retakeBtn").onclick = () => {
    answers = {};
    quizIndex = 0;
    renderWelcome();
    window.scrollTo({ top: 0 });
  };
  document.getElementById("printBtn").onclick = () => window.print();

  setTimeout(fireConfetti, 350);
}

// The "Get started with..." detail block: careers, resources, role models.
function detailHTML(entry, isTop) {
  const m = entry.major;
  return `
    <div class="swap">
      <div class="detail-head">
        ${badgeHTML(m, true)}
        <div>
          <div class="dh-name">${m.name}</div>
          <div class="dh-sub">${entry.pct}% match${isTop ? "" : ` · <a href="#" id="backToTop" style="color:var(--accent-ink);font-weight:700;text-decoration:none">back to your top match</a>`}</div>
        </div>
      </div>

      <div class="detail-cols" style="margin-top:16px">
        <div class="info-card">
          <div style="font-family:var(--font-display);font-weight:700;font-size:16px;margin-bottom:6px">Careers you could pursue</div>
          ${m.careers.map((c) => `
            <div class="career-row">
              <span class="c-title">${c.title}</span>
              <span class="c-pay">${c.pay === "varies" ? "varies" : c.pay + "/yr"}</span>
            </div>`).join("")}
          <div style="font-size:11.5px;color:var(--ink-faint);margin-top:10px">Approx. U.S. median pay — for context, not a promise.</div>
        </div>

        <div class="info-card">
          <div style="font-family:var(--font-display);font-weight:700;font-size:16px;margin-bottom:6px">Free ways to start now</div>
          ${m.resources.map((r) => `
            <a class="res-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
              <span class="rl-ico">${r.org[0]}</span>
              <span>
                <div class="rl-name">${r.name}</div>
                <div class="rl-org">${r.org}</div>
              </span>
              <span class="rl-arrow">↗</span>
            </a>`).join("")}
        </div>
      </div>

      <div class="info-card" style="margin-top:16px">
        <div style="font-family:var(--font-display);font-weight:700;font-size:16px;margin-bottom:4px">Prominent figures</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px">
          ${m.roleModels.map((p) => `
            <div class="person">
              <span class="p-av">${monogram(p.name)}</span>
              <span>
                <div class="p-name">${p.name}</div>
                <div class="p-note">${p.note}</div>
              </span>
            </div>`).join("")}
        </div>
      </div>
    </div>`;
}

/* ---- AI advisor: ask our backend for a personalized note ---- */
async function loadAdvisor(top, traitLabels) {
  const box = document.getElementById("aiAdvisor");
  if (!box) return;
  try {
    const resp = await fetch("/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ major: top.major.name, traits: traitLabels }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Request failed");
    box.textContent = data.text; // textContent is safe: no HTML injection
  } catch (err) {
    box.textContent =
      "AI advisor unavailable: " + (err.message || err) +
      "\n\nTip: the AI only works when you run the app with  node dev-server.js  " +
      "(not by opening the file directly), and after you've added your key to .env.";
  }
}

/* ---- match ring: an SVG circle whose arc + number count up to pct ---- */
function ringHTML(pct) {
  const r = 50;
  const c = 2 * Math.PI * r;
  return `
    <div class="match-ring">
      <div class="ring">
        <svg width="116" height="116" viewBox="0 0 116 116">
          <circle cx="58" cy="58" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="11" />
          <circle id="ringArc" cx="58" cy="58" r="${r}" fill="none" stroke="var(--accent)" stroke-width="11"
                  stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"
                  style="transition:stroke-dashoffset .1s linear" />
        </svg>
        <div class="pct"><span class="num" id="ringNum">0%</span><small>match</small></div>
      </div>
    </div>`;
}

function animateRing(pct) {
  const arc = document.getElementById("ringArc");
  const num = document.getElementById("ringNum");
  const r = 50;
  const c = 2 * Math.PI * r;
  const dur = 900;
  const start = performance.now();

  function tick(t) {
    const k = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - k, 3); // ease-out
    const shown = Math.round(eased * pct);
    num.textContent = shown + "%";
    arc.style.strokeDashoffset = c - (shown / 100) * c;
    if (k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // safety net: land on the exact value even if the tab was backgrounded
  setTimeout(() => {
    num.textContent = pct + "%";
    arc.style.strokeDashoffset = c - (pct / 100) * c;
  }, dur + 80);
}

/* ---- lightweight confetti burst (warm palette) ---- */
function fireConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const W = window.innerWidth, H = window.innerHeight;
  const colors = ["#c2613e", "#d99a3f", "#7a9a6b", "#b8714f", "#e0c074"];
  const parts = Array.from({ length: 130 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 120,
    y: H * 0.32,
    vx: (Math.random() - 0.5) * 13,
    vy: Math.random() * -13 - 4,
    g: 0.32 + Math.random() * 0.16,
    s: 6 + Math.random() * 7,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[(Math.random() * colors.length) | 0],
    life: 0,
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    parts.forEach((p) => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life += 1;
      if (p.y < H + 30) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / 130);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  }
  requestAnimationFrame(draw);
}

/* ---- start the app ---- */
renderWelcome();
