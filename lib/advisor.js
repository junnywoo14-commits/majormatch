/* The AI brain. This runs on the SERVER, so it's allowed to use the secret
 * API key. Given the student's strongest traits and best-fit major, it asks
 * Gemini for a short, personalized note + 3 first steps.
 *
 * Used by both dev-server.js (local) and api/advisor.js (Vercel).
 */

// Free Gemini model. The key comes from an environment variable — never
// hard-coded, never sent to the browser.
const MODEL = "gemini-2.5-flash";

async function getAdvice({ major, traits }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("No GEMINI_API_KEY set. Add it to your .env file.");
  }

  const traitList = (traits && traits.length) ? traits.join(", ") : "a mix of interests";

  const prompt =
`You are a warm, encouraging college and career advisor for a high school student.
They just took an interests quiz. Their strongest interest traits are: ${traitList}.
Their best-fit college major is: ${major}.

Write a short personalized note (about 120-160 words) that:
1. Explains in 2-3 sentences WHY this major fits someone with those traits.
2. Gives exactly 3 concrete "first steps" they can take this month to explore it for free (a class, a small project, a video, a club).

Address the reader directly as "you". Do NOT use a name, a greeting placeholder like
[Student's Name], or pretend you've met them before — just start with the substance.
Be specific and supportive. Do not invent statistics or fake links. Plain text only, no markdown headings.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // Disable the model's "thinking" step — faster + cheaper for this short task.
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${detail.slice(0, 200)}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");

  return text.trim();
}

module.exports = { getAdvice };
