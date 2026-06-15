/* Vercel serverless function. This is the "door" Vercel uses when your app
 * is deployed live. It reuses the exact same brain as local dev (lib/advisor.js).
 * Vercel automatically parses the JSON body into req.body for us.
 */

const { getAdvice } = require("../lib/advisor.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }
  try {
    const text = await getAdvice(req.body || {});
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
};
