/* Potts Deck and Patio — site behavior
   Interface: CONFIG below is the single edit point for contact details.
   Elements opt in via data attributes:
     [data-phone-link]  -> href="tel:", text = display phone
     [data-email-link]  -> href="mailto:", text = email
     [data-gallery]     -> gallery rendered from content/photos.json
                           (optional data-limit and data-filters attrs)
   Everything degrades gracefully: if photos.json is unreachable the page
   still renders; contact spans show a TBD marker until CONFIG is filled. */

const CONFIG = {
  phone: "+12542563752",
  phoneDisplay: "(254) 256-3752",
  email: "",          // e.g. "info@example.com"
};

const SERVICE_LABELS = {
  "custom-decks": "Custom Decks",
  "composite-decks": "Composite Decks",
  "pergolas": "Pergolas",
  "covered-patios": "Covered Patios",
  "screened-porches": "Screened Porches",
  "outdoor-structures": "Outdoor Structures",
};

function fillContacts() {
  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    if (CONFIG.phone) {
      el.href = "tel:" + CONFIG.phone;
      el.textContent = CONFIG.phoneDisplay || CONFIG.phone;
    } else {
      el.removeAttribute("href");
      el.textContent = "[phone TBD]";
    }
  });
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    if (CONFIG.email) {
      el.href = "mailto:" + CONFIG.email;
      el.textContent = CONFIG.email;
    } else {
      el.removeAttribute("href");
      el.textContent = "[email TBD]";
    }
  });
}

function photoCard(p, index, list) {
  const fig = document.createElement("figure");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "photo-open";
  btn.setAttribute("aria-label", "View larger: " + (p.caption || p.alt || "project photo"));
  const pic = document.createElement("picture");
  const webp = document.createElement("source");
  webp.type = "image/webp";
  webp.srcset = `${p.src}-800.webp`;
  const img = document.createElement("img");
  img.src = `${p.src}-800.jpg`;
  img.alt = p.alt || "";
  img.loading = "lazy";
  pic.append(webp, img);
  const tag = document.createElement("span");
  tag.className = "photo-tag";
  tag.textContent = SERVICE_LABELS[p.service] || p.service;
  btn.append(pic, tag);
  btn.addEventListener("click", () => openLightbox(list, index));
  const cap = document.createElement("figcaption");
  cap.textContent = p.caption || "";
  fig.append(btn, cap);
  return fig;
}

/* Lightbox — one overlay per page, built on demand. Esc / backdrop click
   closes; arrows and swipe-free prev/next buttons navigate. */
let lb = null;
function buildLightbox() {
  lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.innerHTML =
    '<div class="lb-backdrop"></div>' +
    '<figure class="lb-stage" role="dialog" aria-modal="true" aria-label="Photo viewer">' +
    '  <img alt="">' +
    '  <figcaption></figcaption>' +
    '</figure>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.append(lb);
  lb.querySelector(".lb-backdrop").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => stepLightbox(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => stepLightbox(1));
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}
let lbList = [], lbIndex = 0, lbReturnFocus = null;
function showLightboxPhoto() {
  const p = lbList[lbIndex];
  const img = lb.querySelector(".lb-stage img");
  img.src = `${p.src}-1600.jpg`;
  img.alt = p.alt || "";
  lb.querySelector(".lb-stage figcaption").textContent =
    `${p.caption || ""}  ·  ${lbIndex + 1} / ${lbList.length}`;
}
function openLightbox(list, index) {
  if (!lb) buildLightbox();
  lbList = list; lbIndex = index;
  lbReturnFocus = document.activeElement;
  showLightboxPhoto();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  lb.querySelector(".lb-close").focus();
}
function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
  showLightboxPhoto();
}
function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
  if (lbReturnFocus) lbReturnFocus.focus();
}

async function renderGalleries() {
  const mounts = document.querySelectorAll("[data-gallery]");
  if (!mounts.length) return;
  let photos = [];
  try {
    const res = await fetch("content/photos.json");
    photos = (await res.json()).photos || [];
  } catch (err) {
    mounts.forEach((m) => {
      m.innerHTML = '<p class="gallery-empty">Project photos are on their way — check back soon.</p>';
    });
    return;
  }

  mounts.forEach((mount) => {
    const limit = parseInt(mount.dataset.limit || "0", 10);
    const withFilters = "filters" in mount.dataset;

    const draw = (filter) => {
      const grid = mount.querySelector(".gallery") || mount.appendChild(
        Object.assign(document.createElement("div"), { className: "gallery" }));
      grid.textContent = "";
      let list = filter && filter !== "all" ? photos.filter((p) => p.service === filter) : photos.slice();
      if (limit) list = list.slice(0, limit);
      list.forEach((p, i) => grid.append(photoCard(p, i, list)));
    };

    if (withFilters) {
      const bar = Object.assign(document.createElement("div"), { className: "filters" });
      const services = ["all", ...new Set(photos.map((p) => p.service))];
      services.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        const n = s === "all" ? photos.length : photos.filter((p) => p.service === s).length;
        b.textContent = (s === "all" ? "All projects" : (SERVICE_LABELS[s] || s)) + ` (${n})`;
        b.setAttribute("aria-pressed", s === "all" ? "true" : "false");
        b.addEventListener("click", () => {
          bar.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true");
          draw(s);
        });
        bar.append(b);
      });
      mount.prepend(bar);
    }
    draw("all");
  });
}

fillContacts();
renderGalleries();
