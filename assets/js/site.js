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
  phone: "",          // e.g. "+12545550100"  — TODO before launch
  phoneDisplay: "",   // e.g. "(254) 555-0100"
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

function photoCard(p) {
  const fig = document.createElement("figure");
  const pic = document.createElement("picture");
  const webp = document.createElement("source");
  webp.type = "image/webp";
  webp.srcset = `${p.src}-800.webp`;
  const img = document.createElement("img");
  img.src = `${p.src}-800.jpg`;
  img.alt = p.alt || "";
  img.loading = "lazy";
  pic.append(webp, img);
  const cap = document.createElement("figcaption");
  cap.textContent = p.caption || "";
  fig.append(pic, cap);
  return fig;
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
      list.forEach((p) => grid.append(photoCard(p)));
    };

    if (withFilters) {
      const bar = Object.assign(document.createElement("div"), { className: "filters" });
      const services = ["all", ...new Set(photos.map((p) => p.service))];
      services.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = s === "all" ? "All projects" : (SERVICE_LABELS[s] || s);
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
