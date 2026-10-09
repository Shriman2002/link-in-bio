// Shared renderer used by index.html (the live page) and editor.html (the preview).
(function () {
  const THEMES = {
    midnight: { bg: "linear-gradient(160deg,#0f0c29 0%,#302b63 55%,#24243e 100%)", text: "#ffffff", muted: "rgba(255,255,255,.72)", button: "rgba(255,255,255,.10)", buttonText: "#ffffff", buttonBorder: "rgba(255,255,255,.22)", accent: "#ff2d75" },
    sunset:   { bg: "linear-gradient(160deg,#ff9a8b 0%,#ff6a88 50%,#ff99ac 100%)", text: "#ffffff", muted: "rgba(255,255,255,.85)", button: "rgba(255,255,255,.22)", buttonText: "#ffffff", buttonBorder: "rgba(255,255,255,.45)", accent: "#4a1942" },
    minimal:  { bg: "#f6f5f2", text: "#141414", muted: "#5c5c5c", button: "#ffffff", buttonText: "#141414", buttonBorder: "#e2e0da", accent: "#141414" },
    neon:     { bg: "#060606", text: "#ffffff", muted: "rgba(255,255,255,.65)", button: "rgba(255,255,255,.04)", buttonText: "#ffffff", buttonBorder: "#25f4ee", accent: "#fe2c55" },
    forest:   { bg: "linear-gradient(170deg,#1d3b2a 0%,#2f5d3f 60%,#3e7a52 100%)", text: "#f3f7ef", muted: "rgba(243,247,239,.75)", button: "rgba(243,247,239,.10)", buttonText: "#f3f7ef", buttonBorder: "rgba(243,247,239,.28)", accent: "#e9c46a" }
  };
  const FONTS = ["Poppins", "Inter", "Space Grotesk", "Playfair Display", "DM Mono"];
  const RADII = { pill: "999px", rounded: "14px", square: "4px" };
  const PLATFORMS = ["tiktok", "instagram", "youtube", "x", "facebook", "snapchat", "twitch", "spotify", "applemusic", "soundcloud", "pinterest", "threads", "discord", "patreon", "github", "email", "website"];

  const svg = (d) => "url(\"data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${d}</svg>`) + "\")";
  const LOCAL_ICONS = {
    email: svg("<rect x='3' y='5' width='18' height='14' rx='2'/><path d='m3 7 9 6 9-6'/>"),
    website: svg("<circle cx='12' cy='12' r='9'/><path d='M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18'/>"),
    link: svg("<path d='M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1'/><path d='M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'/>")
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => {
    u = String(u || "").trim();
    if (/^(https?:|mailto:|tel:|sms:)/i.test(u) || /^[\w./-]+$/.test(u)) return u;
    if (/^[\w-]+(\.[\w-]+)+/.test(u)) return "https://" + u; // "example.com" -> https://example.com
    return "#";
  };

  function iconHtml(icon, cls) {
    if (!icon) return "";
    const slug = String(icon).toLowerCase().trim();
    if (LOCAL_ICONS[slug]) return `<span class="${cls}" style="--icon:${esc(LOCAL_ICONS[slug])}" aria-hidden="true"></span>`;
    if (/^[a-z0-9]+$/.test(slug)) {
      const url = `url("https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg")`;
      return `<span class="${cls}" style="--icon:${esc(url)}" aria-hidden="true"></span>`;
    }
    return `<span class="${cls} emoji" aria-hidden="true">${esc(icon)}</span>`; // emoji / text
  }

  function loadFont(font) {
    if (!FONTS.includes(font)) return;
    const id = "lt-font-" + font.replace(/\s/g, "-");
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id; l.rel = "stylesheet";
    l.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s/g, "+")}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(l);
  }

  function render(cfg, root) {
    const theme = cfg.theme || {};
    const t = Object.assign({}, THEMES[theme.preset] || THEMES.midnight, theme.overrides || {});
    const font = theme.font || "Poppins";
    loadFont(font);

    const vars = {
      "--lt-bg": t.bg, "--lt-text": t.text, "--lt-muted": t.muted, "--lt-btn": t.button,
      "--lt-btn-text": t.buttonText, "--lt-btn-border": t.buttonBorder, "--lt-accent": t.accent,
      "--lt-radius": RADII[theme.buttonShape] || RADII.pill, "--lt-font": `"${font}", system-ui, sans-serif`
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);

    const p = cfg.profile || {};
    const links = (cfg.links || []).filter((l) => l && l.title);
    const socials = (cfg.socials || []).filter((s) => s && s.url);

    root.innerHTML = `
      <main class="lt-wrap">
        <header class="lt-head">
          ${p.avatar ? `<img class="lt-avatar" src="${esc(safeUrl(p.avatar))}" alt="${esc(p.name)}">` : ""}
          <h1 class="lt-name">${esc(p.name)}</h1>
          ${p.handle ? `<p class="lt-handle">${esc(p.handle)}</p>` : ""}
          ${p.bio ? `<p class="lt-bio">${esc(p.bio)}</p>` : ""}
          ${socials.length ? `<nav class="lt-socials" aria-label="Social profiles">${socials.map((s) =>
            `<a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener" aria-label="${esc(s.platform)}">${iconHtml(s.platform, "lt-sicon")}</a>`).join("")}</nav>` : ""}
        </header>
        <ul class="lt-links">
          ${links.map((l) => `
            <li><a class="lt-link${l.highlight ? " is-hot" : ""}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">
              ${iconHtml(l.icon, "lt-icon") || '<span class="lt-icon-spacer"></span>'}
              <span class="lt-title">${esc(l.title)}</span>
              <span class="lt-icon-spacer"></span>
            </a></li>`).join("")}
        </ul>
        ${cfg.footer ? `<footer class="lt-foot">${esc(cfg.footer)}</footer>` : ""}
      </main>`;
  }

  window.LinkInBio = { render, THEMES, FONTS, PLATFORMS, RADII };
})();
