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
