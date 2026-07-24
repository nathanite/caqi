const AQI_CATEGORIES = [
  { max: 50,  name: "Good",                           bg: "var(--aqi-good-bg)",           fg: "#ffffff" },
  { max: 100, name: "Moderate",                        bg: "var(--aqi-moderate-bg)",        fg: "#ffffff" },
  { max: 150, name: "Unhealthy for Sensitive Groups",  bg: "var(--aqi-usg-bg)",             fg: "#ffffff" },
  { max: 200, name: "Unhealthy",                       bg: "var(--aqi-unhealthy-bg)",       fg: "#ffffff" },
  { max: 300, name: "Very Unhealthy",                  bg: "var(--aqi-very-unhealthy-bg)",  fg: "#ffffff" },
  { max: Infinity, name: "Hazardous",                  bg: "var(--aqi-hazardous-bg)",       fg: "#ffffff" },
];

function aqiCategory(aqi) {
  return AQI_CATEGORIES.find((c) => aqi <= c.max) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

function resolveCssVar(varString) {
  const match = /var\((--[a-z0-9-]+)\)/.exec(varString);
  if (!match) return varString;
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
}

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function minutesAgo(iso) {
  return Math.round((Date.now() - new Date(iso).getTime()) / 60000);
}
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
  }
  updateThemeToggleIcon();
}
function updateThemeToggleIcon() {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = isDark ? "☀️" : "🌙";
  btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

document.addEventListener("DOMContentLoaded", updateThemeToggleIcon);

function trendVsYesterday(history, key, currentValue, maxWindowHours = 3) {
  if (!history || !history.length) return null;
  const targetTime = Date.now() - 24 * 3600 * 1000;
  let best = null;
  let bestDiffMs = Infinity;
  for (const row of history) {
    const t = new Date(row.created_at).getTime();
    const diff = Math.abs(t - targetTime);
    if (diff < bestDiffMs) {
      bestDiffMs = diff;
      best = row;
    }
  }
  if (!best || bestDiffMs > maxWindowHours * 3600 * 1000) return null;

  const pastValue = best[key];
  const delta = currentValue - pastValue;
  return { delta, pastValue };
}
function trendHtml(delta, unit, polarity, flatThreshold) {
  if (delta === null || delta === undefined || Number.isNaN(delta)) return "";

  const rounded = Math.round(Math.abs(delta) * 10) / 10;
  let arrow, cls;

  if (Math.abs(delta) < flatThreshold) {
    arrow = "→";
    cls = "flat";
  } else if (delta > 0) {
    arrow = "↑";
    cls = polarity === "bad-up" ? "up" : "neutral-up";
  } else {
    arrow = "↓";
    cls = polarity === "bad-up" ? "down" : "neutral-down";
  }

  const sign = delta > 0 ? "+" : delta < 0 ? "\u2212" : "\u00B1";
  const magnitude = Math.abs(delta) < flatThreshold ? "0" : rounded;

  return `<span class="trend ${cls}"><span class="arrow">${arrow}</span>${sign}${magnitude}${unit} <span class="vs-label">vs 24h ago</span></span>`;
}
