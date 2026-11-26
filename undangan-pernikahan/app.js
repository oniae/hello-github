(function () {
  "use strict";

  const cfg = window.WEDDING_CONFIG;
  if (!cfg) return;

  const STORAGE_KEY = "wedding_rsvp_wishes_v1";

  // Helper: Resolve dotted path like "couple.bride.fullName"
  function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  // Helper: Show Toast
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  }

  // Helper: Copy text to clipboard with fallback
  async function copyText(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast(successMsg);
    } catch {
      showToast("Gagal menyalin. Silakan salin secara manual.");
    }
  }

  // 1. Hydrate data-bind elements from config.js
  function hydrateBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const value = getByPath(cfg, el.getAttribute("data-bind"));
      if (typeof value === "string") {
        el.textContent = value;
      }
    });

    document.title = `Undangan Pernikahan — ${cfg.couple.shortNames}`;

    // Guest name from URL ?to=Nama+Tamu
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to");
    const guestEl = document.getElementById("guestName");
    const rsvpNameInput = document.getElementById("rsvpName");
    if (toParam && toParam.trim()) {
      const cleanName = toParam.trim();
      if (guestEl) guestEl.textContent = cleanName;
      if (rsvpNameInput) rsvpNameInput.value = cleanName;
    } else if (guestEl) {
      guestEl.textContent = cfg.guest.defaultName;
    }

    // Photos & Links
    const heroPhoto = document.getElementById("heroPhoto");
    const groomPhoto = document.getElementById("groomPhoto");
    const bridePhoto = document.getElementById("bridePhoto");
    if (heroPhoto && cfg.gallery[0]) heroPhoto.src = cfg.gallery[0].src;
    if (groomPhoto) groomPhoto.src = cfg.couple.groom.photo;
    if (bridePhoto) bridePhoto.src = cfg.couple.bride.photo;

    const akadMapsLink = document.getElementById("akadMapsLink");
    const resepsiMapsLink = document.getElementById("resepsiMapsLink");
    if (akadMapsLink) akadMapsLink.href = cfg.event.akad.mapsUrl;
    if (resepsiMapsLink) resepsiMapsLink.href = cfg.event.resepsi.mapsUrl;

    // QRIS
    const qrisImg = document.getElementById("qrisImage");
    const qrisMerchant = document.getElementById("qrisMerchant");
    const qrisNmid = document.getElementById("qrisNmid");
    const downloadQrisBtn = document.getElementById("downloadQrisBtn");
    if (qrisImg) qrisImg.src = cfg.gifts.qris.image;
    if (qrisMerchant) qrisMerchant.textContent = cfg.gifts.qris.merchantName;
    if (qrisNmid) qrisNmid.textContent = `NMID: ${cfg.gifts.qris.nmid}`;
    if (downloadQrisBtn) downloadQrisBtn.href = cfg.gifts.qris.image;
  }

  // 2. Cover Open Logic
  function initCover() {
    const cover = document.getElementById("coverOverlay");
    const openBtn = document.getElementById("openInvitationBtn");
    if (!cover || !openBtn) return;

    openBtn.addEventListener("click", () => {
      cover.classList.add("is-opened");
      document.body.classList.remove("cover-locked");
      setTimeout(() => {
        cover.setAttribute("aria-hidden", "true");
      }, 900);
    });
  }

  // 3. Mobile Navigation Drawer
  function initMobileNav() {
    const btn = document.getElementById("mobileMenuBtn");
    const drawer = document.getElementById("mobileDrawer");
    if (!btn || !drawer) return;

    btn.addEventListener("click", () => {
      const isHidden = drawer.hidden;
      drawer.hidden = !isHidden;
      btn.setAttribute("aria-expanded", String(isHidden));
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 4. Live Countdown & Calendar Integration
  function initCountdownAndCalendar() {
    const target = new Date(cfg.event.targetDateISO).getTime();
    const dEl = document.getElementById("cdDays");
    const hEl = document.getElementById("cdHours");
    const mEl = document.getElementById("cdMinutes");
    const sEl = document.getElementById("cdSeconds");

    function pad(n) {
      return String(Math.max(0, n)).padStart(2, "0");
    }

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        dEl.textContent = "00";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(mins);
      sEl.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);

    // Google Calendar Link
    const cal = cfg.event.calendar;
    const gcalUrl = new URL("https://calendar.google.com/calendar/render");
    gcalUrl.searchParams.set("action", "TEMPLATE");
    gcalUrl.searchParams.set("text", cal.title);
    gcalUrl.searchParams.set("dates", `${cal.startUTC}/${cal.endUTC}`);
    gcalUrl.searchParams.set("details", cal.description);
    gcalUrl.searchParams.set("location", cal.location);

    const gcalLink = document.getElementById("gcalLink");
    if (gcalLink) gcalLink.href = gcalUrl.toString();

    // .ICS Download
    const icsBtn = document.getElementById("downloadIcsBtn");
    if (icsBtn) {
      icsBtn.addEventListener("click", () => {
        const icsContent = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Undangan Pernikahan//ID",
          "BEGIN:VEVENT",
          `DTSTART:${cal.startUTC}`,
          `DTEND:${cal.endUTC}`,
          `SUMMARY:${cal.title}`,
          `DESCRIPTION:${cal.description}`,
          `LOCATION:${cal.location}`,
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "undangan-pernikahan.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("File kalender (.ics) berhasil diunduh.");
      });
    }
  }

  // 5. Render Story Timeline
  function renderStory() {
    const grid = document.getElementById("storyGrid");
    if (!grid || !Array.isArray(cfg.story)) return;

    grid.innerHTML = cfg.story
      .map(
        (item) => `
      <article class="story-item">
        <div class="story-year">${item.year}</div>
        <h3 class="story-chapter">${item.chapter}</h3>
        <p class="story-desc">${item.description}</p>
      </article>
    `
      )
      .join("");
  }

  // 6. Gallery & Lightbox
  let currentPhotoIndex = 0;
  let lightboxMode = "gallery"; // "gallery" | "qris"

  function openLightbox(index) {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    const counter = document.getElementById("lightboxCounter");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    if (!modal || !img) return;

    lightboxMode = "gallery";
    currentPhotoIndex = (index + cfg.gallery.length) % cfg.gallery.length;
    const item = cfg.gallery[currentPhotoIndex];

    img.src = item.src;
    img.alt = item.caption;
    caption.textContent = `${item.caption} — ${item.location}`;
    counter.textContent = `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(cfg.gallery.length).padStart(2, "0")}`;
    prevBtn.style.display = "grid";
    nextBtn.style.display = "grid";
    modal.hidden = false;
  }

  function openQrisZoom() {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    const counter = document.getElementById("lightboxCounter");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    if (!modal || !img) return;

    lightboxMode = "qris";
    img.src = cfg.gifts.qris.image;
    img.alt = cfg.gifts.qris.label;
    caption.textContent = cfg.gifts.qris.label;
    counter.textContent = `NMID: ${cfg.gifts.qris.nmid}`;
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    modal.hidden = false;
  }

  function initGalleryAndLightbox() {
    const grid = document.getElementById("galleryGrid");
    if (grid && Array.isArray(cfg.gallery)) {
      grid.innerHTML = cfg.gallery
        .map(
          (photo, idx) => `
        <figure class="gallery-card span-${photo.span || "square"}" tabindex="0" role="button" aria-label="Buka foto ${photo.caption}" data-gallery-idx="${idx}">
          <div class="gallery-thumb">
            <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
          </div>
          <figcaption class="gallery-meta">
            <span>${photo.caption}</span>
            <span>${photo.location}</span>
          </figcaption>
        </figure>
      `
        )
        .join("");

      grid.querySelectorAll("[data-gallery-idx]").forEach((card) => {
        const idx = Number(card.getAttribute("data-gallery-idx"));
        card.addEventListener("click", () => openLightbox(idx));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(idx);
          }
        });
      });
    }

    const modal = document.getElementById("lightboxModal");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");

    if (closeBtn) closeBtn.addEventListener("click", () => (modal.hidden = true));
    if (prevBtn) prevBtn.addEventListener("click", () => openLightbox(currentPhotoIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => openLightbox(currentPhotoIndex + 1));

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.hidden = true;
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!modal || modal.hidden) return;
      if (e.key === "Escape") modal.hidden = true;
      if (lightboxMode === "gallery") {
        if (e.key === "ArrowLeft") openLightbox(currentPhotoIndex - 1);
        if (e.key === "ArrowRight") openLightbox(currentPhotoIndex + 1);
      }
    });
  }

  // 7. Amplop Digital (Bank Cards, Tabs, QRIS Zoom, Physical Address Copy)
  function initDigitalEnvelope() {
    const bankGrid = document.getElementById("bankCardsGrid");
    if (bankGrid && Array.isArray(cfg.gifts.banks)) {
      bankGrid.innerHTML = cfg.gifts.banks
        .map(
          (bank, idx) => `
        <article class="bank-card">
          <div class="bank-card-header">
            <span class="bank-name">${bank.bankName}</span>
            <span class="bank-badge">${bank.bankCode}</span>
          </div>
          <div>
            <div class="detail-label">Nomor Rekening</div>
            <div class="bank-number">${bank.accountNumber}</div>
            <div class="bank-holder">a.n. <strong>${bank.accountHolder}</strong></div>
          </div>
          <button type="button" class="btn-primary btn-full copy-bank-btn" data-bank-idx="${idx}">
            Salin Nomor Rekening
          </button>
        </article>
      `
        )
        .join("");

      bankGrid.querySelectorAll(".copy-bank-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const bank = cfg.gifts.banks[Number(btn.getAttribute("data-bank-idx"))];
          if (!bank) return;
          copyText(bank.accountNumber, `Nomor rekening ${bank.bankCode} berhasil disalin.`);
          const original = btn.textContent;
          btn.textContent = "Tersalin ✓";
          setTimeout(() => {
            btn.textContent = original;
          }, 1800);
        });
      });
    }

    // Tabs
    const tabs = document.querySelectorAll("[data-gift-tab]");
    const panels = {
      bank: document.getElementById("giftPanelBank"),
      qris: document.getElementById("giftPanelQris"),
      kado: document.getElementById("giftPanelKado")
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetKey = tab.getAttribute("data-gift-tab");
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        Object.entries(panels).forEach(([key, panel]) => {
          if (!panel) return;
          const isActive = key === targetKey;
          panel.hidden = !isActive;
          panel.classList.toggle("is-active", isActive);
        });
      });
    });

    const zoomQrisBtn = document.getElementById("zoomQrisBtn");
    if (zoomQrisBtn) zoomQrisBtn.addEventListener("click", openQrisZoom);

    const copyAddressBtn = document.getElementById("copyAddressBtn");
    if (copyAddressBtn) {
      copyAddressBtn.addEventListener("click", () => {
        const g = cfg.gifts.physicalGift;
        copyText(`${g.recipient} (${g.phone}) — ${g.address}`, "Alamat pengiriman kado berhasil disalin.");
      });
    }
  }

  // 8. RSVP & Guestbook (localStorage)
  function initRSVP() {
    const form = document.getElementById("rsvpForm");
    const listEl = document.getElementById("wishesList");
    const guestCountField = document.getElementById("guestCountField");
    const statHadir = document.getElementById("statHadir");
    const statAbsent = document.getElementById("statAbsent");
    const statTotal = document.getElementById("statTotal");

    function loadWishes() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore storage errors
      }
      return [...cfg.initialWishes];
    }

    function saveWishes(items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore storage errors
      }
    }

    function escapeHTML(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function renderWishes(items) {
      const hadirCount = items.filter((w) => w.attendance === "Hadir").length;
      const absentCount = items.filter((w) => w.attendance !== "Hadir").length;
      if (statHadir) statHadir.textContent = hadirCount;
      if (statAbsent) statAbsent.textContent = absentCount;
      if (statTotal) statTotal.textContent = items.length;

      if (!listEl) return;
      listEl.innerHTML = items
        .map(
          (w) => `
        <article class="wish-card">
          <div class="wish-head">
            <span class="wish-author">${escapeHTML(w.name)}</span>
            <span class="wish-badge ${w.attendance === "Hadir" ? "is-hadir" : ""}">
              ${escapeHTML(w.attendance)}${w.guests && w.attendance === "Hadir" ? ` &bull; ${escapeHTML(w.guests)}` : ""}
            </span>
          </div>
          <p class="wish-body">${escapeHTML(w.message)}</p>
          <span class="wish-time">${escapeHTML(w.createdAt || "Baru saja")}</span>
        </article>
      `
        )
        .join("");
    }

    let wishes = loadWishes();
    renderWishes(wishes);

    if (form) {
      form.querySelectorAll('input[name="attendance"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          if (guestCountField) {
            guestCountField.style.display = radio.value === "Hadir" && radio.checked ? "grid" : "none";
          }
        });
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const attendance = String(formData.get("attendance") || "Hadir");
        const guests = String(formData.get("guests") || "1 Orang");
        const message = String(formData.get("message") || "").trim();

        if (!name || !message) {
          showToast("Mohon lengkapi nama dan ucapan Anda.");
          return;
        }

        const newEntry = {
          name,
          attendance,
          guests: attendance === "Hadir" ? guests : "",
          message,
          createdAt: "Baru saja"
        };

        wishes = [newEntry, ...wishes];
        saveWishes(wishes);
        renderWishes(wishes);
        form.reset();
        if (guestCountField) guestCountField.style.display = "grid";
        showToast("Terima kasih! Konfirmasi & ucapan Anda telah tersimpan.");
      });
    }
  }

  // 9. Scroll Reveal Observer
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
  }

  // Initialize Everything
  hydrateBindings();
  initCover();
  initMobileNav();
  initCountdownAndCalendar();
  renderStory();
  initGalleryAndLightbox();
  initDigitalEnvelope();
  initRSVP();
  initScrollReveal();
})();
