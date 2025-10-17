/**
 * Express server for AI Roast Master
 * - Serves TikTok-style frontend from /public
 * - Provides /api/roast mock endpoint (replace with real AI later)
 * - Health check at /healthz for Render
 */
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "8mb" }));

// ---- API ----
const FREE_ROASTS = [
  "I've seen potatoes with better angles than this selfie.",
  "Your camera keeps trying to focus on anything but your face.",
  "Face for radio, voice for silent movies—iconic combo.",
  "This pic just taught my GPU the meaning of mercy."
];

const SAVAGE_ROASTS = [
  "Assembled by someone who got the instructions in Wingdings.",
  "This selfie should come with a trigger warning for pixels.",
  "You look like autocorrect, but for faces—always the wrong guess.",
  "Mother Nature said 'let's A/B test' and shipped the draft."
];

app.post("/api/roast", (req, res) => {
  const { type = "free" } = req.body || {};
  const pool = type === "savage" ? SAVAGE_ROASTS : FREE_ROASTS;
  const roast = pool[Math.floor(Math.random() * pool.length)];
  res.json({ roast });
});

app.get("/healthz", (_req, res) => res.send("ok"));

// ---- Static frontend ----
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Roast Master listening on ${PORT}`);
});
