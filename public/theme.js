// theme.js — lock site colors to the CalmNest logo blue

(function () {
  // Exact background blue from your logo
  const BASE_HEX = "#A7EBF8";

  const root = document.documentElement;

  function hexToRgb(hex) {
    const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 167, g: 235, b: 248 }; // fallback to #A7EBF8
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = 0; s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
  function hslToHex(h, s, l) {
    function f(n) {
      const k = (n + h * 12) % 12;
      const a = s * Math.min(l, 1 - l);
      const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
      return Math.round(255 * c).toString(16).padStart(2, "0");
    }
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const { r, g, b } = hexToRgb(BASE_HEX);
  const { h, s, l } = rgbToHsl(r, g, b);

  // Derived shades:
  const skyBase  = BASE_HEX;                                              // background base
  const skyLight = hslToHex(h, Math.min(0.45, s * 0.6), Math.min(0.95, l * 1.05)); // gradient blend
  const brand    = hslToHex(h, Math.min(0.9,  s * 1.15), Math.max(0.40, l * 0.65)); // primary button
  const brandInk = hslToHex(h, Math.min(0.9,  s * 1.15), Math.max(0.24, l * 0.42)); // dark text on brand

  root.style.setProperty("--sky-base", skyBase);
  root.style.setProperty("--sky", skyLight);
  root.style.setProperty("--brand", brand);
  root.style.setProperty("--brand-ink", brandInk);
})();
