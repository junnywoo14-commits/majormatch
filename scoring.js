/* Major Match — scoring engine
 * answers: { [questionId]: value } where value is 1..5 (1=strongly disagree, 5=strongly agree)
 * Produces a ranked list of majors with normalized match percentages.
 *
 * This is the "machine learning" core: we turn the student into a vector of
 * trait scores, turn each major into a vector, and rank majors by how closely
 * the two vectors point in the same direction (cosine similarity).
 */

const AGREE_CENTER = 3; // neutral

// Build the user's trait profile from answers.
// Each answer (1..5) becomes a signed value (-2..+2) and adds to the traits
// that question measures, scaled by that question's weight.
function buildProfile(answers) {
  const profile = {};
  Object.keys(TRAITS).forEach((k) => (profile[k] = 0));
  QUESTIONS.forEach((q) => {
    const v = answers[q.id];
    if (v == null) return;
    const signed = v - AGREE_CENTER; // -2..+2
    Object.entries(q.w).forEach(([trait, weight]) => {
      profile[trait] += signed * weight;
    });
  });
  return profile;
}

// Cosine similarity between user profile and a major's vector,
// but we floor profile traits at 0 so "disagree" doesn't actively
// count against unrelated majors as much — keeps results encouraging.
function cosine(profile, vec) {
  let dot = 0,
    pMag = 0,
    vMag = 0;
  Object.keys(vec).forEach((trait) => {
    const p = Math.max(0, profile[trait] || 0);
    const v = vec[trait];
    dot += p * v;
    vMag += v * v;
  });
  Object.keys(TRAITS).forEach((trait) => {
    const p = Math.max(0, profile[trait] || 0);
    pMag += p * p;
  });
  if (pMag === 0 || vMag === 0) return 0;
  return dot / (Math.sqrt(pMag) * Math.sqrt(vMag));
}

function topTraits(profile, n = 3) {
  return Object.entries(profile)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

// Returns { ranked: [{major, score, pct}], profile, topTraits }
function scoreMajors(answers) {
  const profile = buildProfile(answers);
  const scored = MAJORS.map((m) => ({
    major: m,
    score: cosine(profile, m.vec),
  })).sort((a, b) => b.score - a.score);

  // Normalize to a friendly 60–98% range so even the top feels earned, not perfect.
  const max = scored[0]?.score || 1;
  const ranked = scored.map((s) => {
    const rel = max > 0 ? s.score / max : 0;
    const pct = Math.round(60 + rel * 38);
    return { ...s, pct: Math.min(98, Math.max(40, pct)) };
  });

  return { ranked, profile, topTraits: topTraits(profile) };
}
