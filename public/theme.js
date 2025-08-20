// Auto-theme from the logo's average color
(function () {
  const root = document.documentElement;
  const candidates = ["/logo.jpg", "/logo.jpeg", "/logo.png"];

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

  function applyTheme(r, g, b) {
    const { h, s, l } = rgbToHsl(r, g, b);
    // Soft background based on logo blue
    const skyBase = hslToHex(h, Math.min(0.55, s * 0.85), Math.min(0.92, l * 1.25));
    // Primary brand a bit darker/richer
    const brand = hslToHex(h, Math.min(0.9, s * 1.1), Math.max(0.35, l * 0.7));
    const brandInk = hslToHex(h, Math.min(0.9, s * 1.1), Math.max(0.22, l * 0.38));

    root.style.setProperty("--sky-base", skyBase);
    root.style.setProperty("--brand", brand);
    root.style.setProperty("--brand-ink", brandInk);
  }

  function sample(img) {
    try {
      const c = document.createElement("canvas");
      const w = c.width = 48, h = c.height = 48;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        const rr = data[i], gg = data[i + 1], bb = data[i + 2], a = data[i + 3];
        if (a < 16) continue;                           // ignore transparent
        const mx = Math.max(rr, gg, bb), mn = Math.min(rr, gg, bb);
        const light = (mx + mn) / 510;
        if (light > 0.95 || light < 0.06) continue;     // ignore very light/dark
        r += rr; g += gg; b += bb; n++;
      }
      if (n > 0) applyTheme(r / n, g / n, b / n);
    } catch {}
  }

  (function tryLoad() {
    const src = candidates.shift();
    if (!src) return;
    const img = new Image();
    img.onload = () => sample(img);
    img.onerror = tryLoad;
    img.src = src;
  })();
})();
