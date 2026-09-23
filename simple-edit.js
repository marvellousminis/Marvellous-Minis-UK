/*
========================================================
MARVELLOUS MINIS UK — EDIT THIS FILE
========================================================
Everything you can change lives above the "DO NOT EDIT" line.
Keep the quote marks and the commas where they are.

A section with nothing in it simply doesn't appear on the site,
so it is safe to leave a part empty until you're ready.


CHANGE YOUR DETAILS
*/
const EMAIL = "marvellousminisuk@gmail.com";
const INSTAGRAM = "https://www.instagram.com/marvelous40kminis/";

/*
THE BIG HEADLINE ON THE HOMEPAGE

Put *stars* around a word to colour it gold. Keep it short — this is a
headline, not a sentence. Don't repeat "Marvellous Minis UK" here: the
logo above it already says that.
*/
const HERO_TITLE = "Professional miniature painting services";
const HERO_SUBTITLE =
  "Professional miniature painting for collectors, gamers and hobbyists. " +
  "From tabletop-ready armies to centrepiece models and massive Titans — " +
  "painted to your brief and built to stand out.";

/*
THE BIG SLIDESHOW AT THE TOP

You do not normally edit this. To change the slideshow, add or remove
photos in the assets/slideshow folder on github.com — see the README.txt
in that folder. Everything else happens by itself.

The list below is only a backup, used if that folder is ever empty.
*/
const HERO_SLIDES = [
  { image: "assets/titan-front.jpg",     alt: "Commissioned Warhammer 40,000 Titan, front view", focus: "34%" },
  { image: "assets/knight-01.webp",      alt: "Commissioned Imperial Knight in blue and gold",   focus: "38%" },
  { image: "assets/knights-pair.webp",   alt: "Pair of commissioned Imperial Knights",           focus: "42%" },
  { image: "assets/custodes-01.webp",    alt: "Commissioned gold-armoured character",            focus: "38%" },
  { image: "assets/dreadnought-02.webp", alt: "Commissioned Space Marine Dreadnought",           focus: "45%" }
];

const HERO_SECONDS_PER_SLIDE = 6;
const HERO_FOLDER = "assets/slideshow/";

/*
THE FILTER BUTTONS ABOVE THE PORTFOLIO

"tag" must match the data-tag on the photo in index.html.
Delete a line to drop that button.
*/
const GALLERY_FILTERS = [
  { tag: "all",        label: "All Work" },
  { tag: "titans",     label: "Titans" },
  { tag: "knights",    label: "Knights" },
  { tag: "characters", label: "Characters" },
  { tag: "walkers",    label: "Dreadnoughts" }
];

/*
ABOUT YOU

Leave ABOUT_TEXT empty ("") to hide the whole About section.
Each paragraph is its own line in the list.
ABOUT_PHOTO is optional — put a photo in the assets folder and name it here.
*/
const ABOUT_TITLE = "About The Painter";
const ABOUT_PHOTO = "";
const ABOUT_TEXT = [
  "Passionate miniature painting and custom work, creating tabletop pieces with care and character.",
  "Every commission is painted personally, one model at a time, to the standard agreed before any brush touches plastic."
];

/*
WHAT CLIENTS SAY

Only add real quotes from real customers. An empty list hides the
section completely, which is much better than inventing something.

Copy this line to add one:
  { quote: "What they said.", name: "Their name" },
*/
const TESTIMONIALS = [];

/*
COMMON QUESTIONS

An empty list hides the section.

IMPORTANT: check the answers below say what you actually do — especially
turnaround time and payment. Change anything that isn't right.
*/
const FAQ = [
  {
    q: "How long does a commission take?",
    a: "It depends on the model, the finish and how many jobs are ahead of yours. You'll get a realistic timescale with your quote, before you commit to anything."
  },
  {
    q: "Do I send you the models?",
    a: "Yes. Once we've agreed the commission I'll confirm where to post them and how to pack them safely."
  },
  {
    q: "Do you assemble models as well as paint them?",
    a: "Get in touch and ask. Assembly, and how it affects the quote, is agreed case by case before work starts."
  },
  {
    q: "Can you match an existing army or a specific colour scheme?",
    a: "Yes. Send reference photos of what you already have and the new models will be painted to match."
  },
  {
    q: "How does payment work?",
    a: "Payment terms are confirmed in writing with your quote, so you know the full cost before painting begins."
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Tell me. The finish is agreed up front and photographed before return, so there are no surprises — and if something isn't right, we'll sort it."
  }
];

/*
THE CONTACT FORM

Paste the web address of your contact Worker between the quotes to switch
the form on. See worker/README.txt for how to set one up.

Left empty, the form is hidden and visitors get the email link instead —
so the site always works either way.
*/
const CONTACT_ENDPOINT = "";

/*
VISITOR STATISTICS

Set this to false to hide the cookie bar and leave statistics switched off
for everyone. Leave it true for normal use.

Google Analytics is switched on at the top of index.html, because Google's
own installation check has to be able to see the tag there. It records
nothing until a visitor presses Accept on the cookie bar.
*/
const ANALYTICS_ENABLED = true;

/*
========================================================
DO NOT EDIT BELOW THIS LINE
========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  applyWording();
  stickyHeader();
  buildMobileMenu();
  buildHeroCarousel();
  buildGalleryFilters();
  buildLightbox();
  buildAbout();
  buildTestimonials();
  buildFaq();
  buildContactForm();
  revealOnScroll();
  buildCookieChoice();
});

/* ---------- visitor statistics, only once someone agrees ---------- */

function buildCookieChoice() {
  const link = document.querySelector(".cookie-link");
  if (!ANALYTICS_ENABLED || typeof window.gtag !== "function") {
    if (link) link.closest("div").textContent = "Commissioned miniature painting • UK";
    return;
  }

  const KEY = "mmuk-analytics-consent";

  // The tag is already loaded with everything denied; this is the switch that
  // lets it actually remember anything.
  function setConsent(granted) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied"
    });
  }

  const bar = document.createElement("section");
  bar.className = "consent";
  bar.setAttribute("aria-label", "Cookie choice");
  bar.innerHTML =
    '<div class="container consent-inner">' +
      "<div>" +
        "<h3>Counting visits</h3>" +
        "<p>I'd like to count visits with Google Analytics, to see which work gets looked at. " +
        "Nothing is recorded unless you agree — and you can change that any time in the footer.</p>" +
      "</div>" +
      '<div class="choices">' +
        '<button class="btn js-accept" type="button">Accept</button>' +
        '<button class="btn outline js-decline" type="button">No thanks</button>' +
      "</div>" +
    "</div>";
  document.body.appendChild(bar);

  const show = () => requestAnimationFrame(() => bar.classList.add("show"));
  const hide = () => bar.classList.remove("show");

  function decide(answer) {
    try { localStorage.setItem(KEY, answer); } catch (err) { /* private mode */ }
    hide();
    setConsent(answer === "yes");
  }

  bar.querySelector(".js-accept").addEventListener("click", () => decide("yes"));
  bar.querySelector(".js-decline").addEventListener("click", () => decide("no"));

  if (link) {
    link.addEventListener("click", () => {
      show();
      bar.querySelector(".js-accept").focus();
    });
  }

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (err) { /* private mode */ }

  // Declining is remembered too, so nobody gets asked twice.
  if (saved === "yes") setConsent(true);
  else if (saved !== "no") setTimeout(show, 900);
}

/* ---------- text and links ---------- */

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])
  );
}

function applyWording() {
  // *Starred* words become gold. The text is escaped first, so whatever is
  // typed at the top of this file stays plain text and can never break the page.
  const heading = document.querySelector(".hero h1");
  if (heading) {
    heading.innerHTML = escapeHtml(HERO_TITLE).replace(/\*([^*]+)\*/g, "<span>$1</span>");
  }

  const sub = document.querySelector(".hero p");
  if (sub) sub.textContent = HERO_SUBTITLE;

  const mailto = `mailto:${EMAIL}?subject=Marvellous%20Minis%20UK%20Commission%20Enquiry`;
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = mailto; });

  const emailLink = document.querySelector(".contact-email");
  if (emailLink) {
    emailLink.href = mailto;
    emailLink.textContent = EMAIL;
  }

  document.querySelectorAll('a[href*="instagram.com"]').forEach(a => { a.href = INSTAGRAM; });

  const year = document.querySelector(".year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- header condenses once you scroll ---------- */

function stickyHeader() {
  const bar = document.querySelector("header");
  if (!bar) return;
  let queued = false;

  const update = () => {
    queued = false;
    bar.classList.toggle("stuck", window.scrollY > 60);
  };

  // Reading scrollY straight from the scroll event causes jank on long pages;
  // one read per frame is plenty for a class toggle.
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* ---------- mobile menu ---------- */

function buildMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  if (!toggle || !nav) return;

  const setOpen = open => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () =>
    setOpen(toggle.getAttribute("aria-expanded") !== "true")
  );
  nav.addEventListener("click", event => {
    if (event.target.tagName === "A") setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setOpen(false);
  });
}

/* ---------- hero slideshow ---------- */

// Reads the photos sitting in assets/slideshow. Falls back to HERO_SLIDES
// if that folder is empty or the list has not been generated yet.
async function chooseHeroSlides() {
  try {
    const res = await fetch(HERO_FOLDER + "manifest.json", { cache: "no-cache" });
    if (!res.ok) return HERO_SLIDES;
    const files = await res.json();
    if (!Array.isArray(files) || !files.length) return HERO_SLIDES;
    return files.map(file => ({
      image: HERO_FOLDER + file,
      alt: "Commissioned miniature painting by Marvellous Minis UK",
      focus: "36%"
    }));
  } catch (err) {
    return HERO_SLIDES;
  }
}

async function buildHeroCarousel() {
  const hero = document.querySelector(".hero");
  const stage = document.querySelector(".hero-slides");
  if (!hero || !stage) return;

  const chosen = await chooseHeroSlides();
  if (!chosen.length) return;

  const slides = chosen.map((item, i) => {
    const img = document.createElement("img");
    img.className = "hero-slide" + (i === 0 ? " is-active" : "");
    img.src = item.image;
    img.alt = "";
    if (item.focus) img.style.objectPosition = "center " + item.focus;
    if (i === 0) img.fetchPriority = "high";
    else img.loading = "lazy";
    stage.appendChild(img);
    return img;
  });

  if (slides.length < 2) return;

  const arrow = d =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${d}"/></svg>`;

  const ui = document.createElement("div");
  ui.className = "hero-ui";
  ui.innerHTML =
    '<div class="hero-dots" role="tablist" aria-label="Featured work"></div>' +
    '<div class="hero-arrows">' +
      '<button class="icon-btn js-prev" type="button" aria-label="Previous photo">' + arrow("M15 5l-7 7 7 7") + "</button>" +
      '<button class="icon-btn js-pause" type="button" aria-label="Pause the slideshow"></button>' +
      '<button class="icon-btn js-next" type="button" aria-label="Next photo">' + arrow("M9 5l7 7-7 7") + "</button>" +
    "</div>";
  stage.appendChild(ui);

  const dots = ui.querySelector(".hero-dots");
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show photo ${i + 1} of ${slides.length}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => show(i, true));
    dots.appendChild(dot);
  });

  const pauseBtn = ui.querySelector(".js-pause");
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.4" height="14"/><rect x="13.6" y="5" width="3.4" height="14"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>';

  const stillFrames = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer = null;
  // Someone who pressed pause meant it — hovering away must not restart it.
  let paused = stillFrames;

  function show(next, fromUser) {
    if (next === current) return;
    slides[current].classList.remove("is-active");
    slides[next].classList.add("is-active");
    dots.children[current].setAttribute("aria-current", "false");
    dots.children[next].setAttribute("aria-current", "true");
    current = next;
    if (fromUser && !paused) start();
  }

  function step(delta) {
    show((current + delta + slides.length) % slides.length, true);
  }

  function start() {
    stop();
    if (paused) return;
    timer = setInterval(() => show((current + 1) % slides.length),
      Math.max(2, HERO_SECONDS_PER_SLIDE) * 1000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function setPaused(value) {
    paused = value;
    pauseBtn.innerHTML = paused ? ICON_PLAY : ICON_PAUSE;
    pauseBtn.setAttribute("aria-label", paused ? "Play the slideshow" : "Pause the slideshow");
    if (paused) stop();
    else start();
  }

  pauseBtn.addEventListener("click", () => setPaused(!paused));
  ui.querySelector(".js-prev").addEventListener("click", () => step(-1));
  ui.querySelector(".js-next").addEventListener("click", () => step(1));

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", () => { if (!paused) start(); });
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", () => { if (!paused) start(); });
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : (paused ? null : start())
  );

  dots.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else return;
    event.preventDefault();
    dots.children[current].focus();
  });

  // Swipe on phones and tablets. Listeners stay passive so vertical
  // scrolling through the page is never blocked.
  const SWIPE_MIN_PX = 40;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  hero.addEventListener("touchstart", event => {
    if (event.touches.length !== 1) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    tracking = true;
    stop();
  }, { passive: true });

  hero.addEventListener("touchmove", event => {
    if (!tracking) return;
    const dx = event.touches[0].clientX - startX;
    const dy = event.touches[0].clientY - startY;
    // Once the finger is clearly going up or down, it is a scroll, not a swipe.
    if (Math.abs(dy) > Math.abs(dx)) tracking = false;
  }, { passive: true });

  hero.addEventListener("touchend", event => {
    if (!tracking) { if (!paused) start(); return; }
    tracking = false;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) >= SWIPE_MIN_PX) step(dx < 0 ? 1 : -1);
    else if (!paused) start();
  }, { passive: true });

  hero.addEventListener("touchcancel", () => {
    tracking = false;
    if (!paused) start();
  }, { passive: true });

  setPaused(paused);
}

/* ---------- portfolio filters ---------- */

function buildGalleryFilters() {
  const bar = document.querySelector(".filters");
  const items = [...document.querySelectorAll(".gallery-item")];
  const empty = document.querySelector(".gallery-empty");
  if (!bar || !items.length) return;

  // Only offer a filter that actually has photos behind it.
  const present = new Set(items.map(el => el.dataset.tag));
  const usable = GALLERY_FILTERS.filter(f => f.tag === "all" || present.has(f.tag));
  if (usable.length < 3) return;

  usable.forEach((filter, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = filter.label;
    button.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    button.addEventListener("click", () => {
      [...bar.children].forEach(b => b.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      let shown = 0;
      items.forEach(item => {
        const match = filter.tag === "all" || item.dataset.tag === filter.tag;
        item.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
    bar.appendChild(button);
  });
}

/* ---------- about, testimonials, questions ---------- */

function buildAbout() {
  const section = document.querySelector("#about");
  if (!section) return;
  const paragraphs = ABOUT_TEXT.filter(line => line && line.trim());
  if (!paragraphs.length) return;

  section.querySelector(".about-title").textContent = ABOUT_TITLE;
  const body = section.querySelector(".about-body");
  paragraphs.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line;
    body.appendChild(p);
  });

  if (ABOUT_PHOTO) {
    const frame = section.querySelector(".about-photo");
    const img = document.createElement("img");
    img.src = ABOUT_PHOTO;
    img.alt = "The painter at work";
    img.loading = "lazy";
    // Only clear the stand-in once the real photo has actually arrived.
    img.addEventListener("load", () => {
      frame.querySelectorAll(".ph,.ph-art").forEach(el => el.remove());
    });
    frame.appendChild(img);
  }
  section.hidden = false;
}

function buildTestimonials() {
  const section = document.querySelector("#testimonials");
  if (!section || !TESTIMONIALS.length) return;
  const wrap = section.querySelector(".quotes");
  TESTIMONIALS.forEach(item => {
    if (!item.quote) return;
    const block = document.createElement("blockquote");
    block.className = "quote reveal";
    block.innerHTML =
      "<p>" + escapeHtml(item.quote) + "</p>" +
      (item.name ? "<cite>" + escapeHtml(item.name) + "</cite>" : "");
    wrap.appendChild(block);
  });
  if (wrap.children.length) section.hidden = false;
}

function buildFaq() {
  const section = document.querySelector("#faq");
  if (!section || !FAQ.length) return;
  const wrap = section.querySelector(".faq");
  FAQ.forEach(item => {
    if (!item.q || !item.a) return;
    const details = document.createElement("details");
    details.innerHTML =
      "<summary>" + escapeHtml(item.q) + "</summary>" +
      '<div class="answer">' + escapeHtml(item.a) + "</div>";
    wrap.appendChild(details);
  });
  if (wrap.children.length) section.hidden = false;
}

/* ---------- contact form ---------- */

function buildContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  // No endpoint configured yet: leave the form hidden and let the email
  // link carry the enquiry, rather than showing a button that does nothing.
  if (!CONTACT_ENDPOINT) {
    const wrap = document.querySelector(".contact-wrap");
    const aside = document.querySelector(".contact-aside");
    if (wrap) wrap.classList.add("no-form");
    if (aside) {
      const button = document.createElement("a");
      button.className = "btn";
      button.href = `mailto:${EMAIL}?subject=Marvellous%20Minis%20UK%20Commission%20Enquiry`;
      button.textContent = "Email for a Quote";
      aside.insertBefore(button, aside.firstChild);
    }
    return;
  }
  form.hidden = false;

  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');

  const fieldOf = input => input.closest(".field");
  const isValid = input => {
    if (!input.value.trim()) return false;
    if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    return true;
  };

  const inputs = [...form.querySelectorAll("input[required],textarea[required]")];
  inputs.forEach(input => {
    // Validate once they've left the field, then live — never while first typing.
    input.addEventListener("blur", () => fieldOf(input).classList.toggle("invalid", !isValid(input)));
    input.addEventListener("input", () => {
      if (fieldOf(input).classList.contains("invalid")) {
        fieldOf(input).classList.toggle("invalid", !isValid(input));
      }
    });
  });

  const say = (message, kind) => {
    status.textContent = message;
    status.className = "form-status show " + kind;
  };

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const bad = inputs.filter(input => !isValid(input));
    bad.forEach(input => fieldOf(input).classList.add("invalid"));
    if (bad.length) {
      say("Please check the highlighted fields.", "bad");
      bad[0].focus();
      return;
    }

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = "Sending…";
    say("Sending your enquiry…", "");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      if (!res.ok) throw new Error("status " + res.status);
      form.reset();
      say("Thank you — your enquiry is on its way. I'll reply by email.", "ok");
    } catch (err) {
      say("Sorry, that didn't send. Please email " + EMAIL + " instead.", "bad");
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
}

/* ---------- gentle reveal as sections scroll in ---------- */

function revealOnScroll() {
  const targets = [...document.querySelectorAll(".reveal")];
  if (!targets.length) return;

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach(el => el.classList.add("shown"));
    return;
  }

  const watcher = new IntersectionObserver((entries, self) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // A short stagger reads as one movement rather than six separate ones.
      setTimeout(() => entry.target.classList.add("shown"), i * 70);
      self.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  targets.forEach(el => watcher.observe(el));
}

/* ---------- full screen photo viewer ---------- */

// Click a gallery photo to open it full screen, then zoom in on the detail.
// Mouse: click or scroll to zoom, drag to move around.
// Touch: double-tap or pinch to zoom, drag to move, swipe to change photo.
function buildLightbox() {
  const items = [...document.querySelectorAll(".gallery-item")].filter(el => el.querySelector("img"));
  if (!items.length) return;

  // The grid shows a small photo; assets/full holds a much larger copy for
  // zooming. If a large copy is missing we simply stay on the small one.
  const photos = items.map(item => {
    const img = item.querySelector("img");
    const label = item.querySelector("div");
    const file = img.getAttribute("src").split("/").pop().replace(/\.[^.]+$/, ".webp");
    return {
      thumb: img.getAttribute("src"),
      full: "assets/full/" + file,
      caption: label ? label.textContent.trim() : "",
      alt: img.alt || ""
    };
  });

  const icon = d =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${d}"/></svg>`;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.hidden = true;
  box.innerHTML =
    '<div class="lightbox-stage"><img alt=""></div>' +
    '<button class="lightbox-btn lightbox-close" type="button" aria-label="Close">' + icon("M6 6l12 12M18 6L6 18") + "</button>" +
    '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo">' + icon("M15 5l-7 7 7 7") + "</button>" +
    '<button class="lightbox-btn lightbox-next" type="button" aria-label="Next photo">' + icon("M9 5l7 7-7 7") + "</button>" +
    '<div class="lightbox-bar">' +
      '<span class="lightbox-caption"></span>' +
      '<span class="lightbox-count"></span>' +
      '<span class="lightbox-hint"></span>' +
    "</div>";
  document.body.appendChild(box);

  const stage = box.querySelector(".lightbox-stage");
  const img = box.querySelector(".lightbox-stage img");
  const caption = box.querySelector(".lightbox-caption");
  const counter = box.querySelector(".lightbox-count");

  const touchDevice = window.matchMedia("(hover: none)").matches;
  box.querySelector(".lightbox-hint").textContent = touchDevice
    ? "Pinch or double-tap to zoom · swipe to change photo"
    : "Click or scroll to zoom · arrow keys to change photo";

  const MAX_SCALE = 4;
  const STEP_SCALE = 2.5;
  let index = 0;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let lastFocus = null;

  function draw() {
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    box.classList.toggle("is-zoomed", scale > 1.01);
  }

  // Keep the photo from being dragged off the screen.
  function clamp() {
    const w = img.clientWidth * scale;
    const h = img.clientHeight * scale;
    const limitX = Math.max(0, (w - stage.clientWidth) / 2);
    const limitY = Math.max(0, (h - stage.clientHeight) / 2);
    tx = Math.min(limitX, Math.max(-limitX, tx));
    ty = Math.min(limitY, Math.max(-limitY, ty));
  }

  function reset() {
    scale = 1;
    tx = 0;
    ty = 0;
    img.style.transition = "none";
    draw();
    requestAnimationFrame(() => { img.style.transition = ""; });
  }

  // Zoom while keeping whatever sits under the finger or cursor in place.
  function zoomTo(next, pointX, pointY) {
    next = Math.min(MAX_SCALE, Math.max(1, next));
    const rect = stage.getBoundingClientRect();
    const dx = pointX - rect.left - rect.width / 2;
    const dy = pointY - rect.top - rect.height / 2;
    const ux = (dx - tx) / scale;
    const uy = (dy - ty) / scale;
    scale = next;
    tx = dx - ux * scale;
    ty = dy - uy * scale;
    if (scale === 1) { tx = 0; ty = 0; }
    clamp();
    draw();
  }

  // Skip over anything a portfolio filter is currently hiding.
  function visibleOrder() {
    return photos.map((_, i) => i).filter(i => !items[i].hidden);
  }

  function go(delta) {
    const order = visibleOrder();
    if (!order.length) return;
    const at = order.indexOf(index);
    load(order[(at + delta + order.length) % order.length]);
  }

  function load(next) {
    index = next;
    const photo = photos[index];
    const order = visibleOrder();
    img.onerror = () => { img.onerror = null; img.src = photo.thumb; };
    img.src = photo.full;
    img.alt = photo.alt;
    caption.textContent = photo.caption;
    counter.textContent = (order.indexOf(index) + 1) + " / " + order.length;
    reset();
  }

  function open(next, opener) {
    lastFocus = opener || null;
    load(next);
    box.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => box.classList.add("is-open"));
    box.querySelector(".lightbox-close").focus();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { box.hidden = true; img.removeAttribute("src"); }, 200);
    if (lastFocus) lastFocus.focus();
  }

  items.forEach((item, i) => {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Enlarge: " + photos[i].caption);
    item.addEventListener("click", () => open(i, item));
    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(i, item);
      }
    });
  });

  box.querySelector(".lightbox-close").addEventListener("click", close);
  box.querySelector(".lightbox-prev").addEventListener("click", () => go(-1));
  box.querySelector(".lightbox-next").addEventListener("click", () => go(1));

  // Clicking the dark area around the photo closes; clicking the photo zooms.
  stage.addEventListener("click", event => {
    if (event.target !== img) { close(); return; }
    if (moved) return;
    zoomTo(scale > 1.01 ? 1 : STEP_SCALE, event.clientX, event.clientY);
  });

  document.addEventListener("keydown", event => {
    if (box.hidden) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "ArrowRight") go(1);
    else if (event.key === "Tab") { event.preventDefault(); return; }
    else return;
    event.preventDefault();
  });

  box.addEventListener("wheel", event => {
    event.preventDefault();
    zoomTo(scale * (event.deltaY < 0 ? 1.18 : 1 / 1.18), event.clientX, event.clientY);
  }, { passive: false });

  // Mouse dragging while zoomed in.
  let dragging = false;
  let moved = false;
  let originX = 0;
  let originY = 0;

  img.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch" || scale <= 1.01) return;
    dragging = true;
    moved = false;
    originX = event.clientX - tx;
    originY = event.clientY - ty;
    box.classList.add("is-panning");
    img.setPointerCapture(event.pointerId);
  });

  img.addEventListener("pointermove", event => {
    if (!dragging) return;
    tx = event.clientX - originX;
    ty = event.clientY - originY;
    moved = true;
    clamp();
    draw();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    box.classList.remove("is-panning");
    setTimeout(() => { moved = false; }, 0);
  };
  img.addEventListener("pointerup", endDrag);
  img.addEventListener("pointercancel", endDrag);

  // Touch: pinch to zoom, one finger to pan when zoomed or swipe when not.
  let touchStartX = 0;
  let touchStartY = 0;
  let panStartX = 0;
  let panStartY = 0;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let lastTapAt = 0;
  let swiping = false;

  const distance = touches => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
  const midpoint = touches => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  });

  box.addEventListener("touchstart", event => {
    if (event.touches.length === 2) {
      pinchStartDistance = distance(event.touches);
      pinchStartScale = scale;
      swiping = false;
      return;
    }
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    panStartX = touchStartX - tx;
    panStartY = touchStartY - ty;
    swiping = scale <= 1.01;
  }, { passive: true });

  box.addEventListener("touchmove", event => {
    if (event.touches.length === 2 && pinchStartDistance) {
      event.preventDefault();
      const centre = midpoint(event.touches);
      zoomTo(pinchStartScale * (distance(event.touches) / pinchStartDistance), centre.x, centre.y);
      return;
    }
    if (event.touches.length !== 1) return;
    if (scale > 1.01) {
      event.preventDefault();
      tx = event.touches[0].clientX - panStartX;
      ty = event.touches[0].clientY - panStartY;
      clamp();
      draw();
    }
  }, { passive: false });

  box.addEventListener("touchend", event => {
    if (pinchStartDistance && event.touches.length < 2) {
      pinchStartDistance = 0;
      if (scale <= 1.01) reset();
      return;
    }
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const isTap = Math.abs(dx) < 10 && Math.abs(dy) < 10;

    if (isTap) {
      const now = Date.now();
      if (now - lastTapAt < 300) {
        zoomTo(scale > 1.01 ? 1 : STEP_SCALE, touch.clientX, touch.clientY);
        lastTapAt = 0;
      } else {
        lastTapAt = now;
      }
      return;
    }

    if (swiping && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
    swiping = false;
  }, { passive: true });

  window.addEventListener("resize", () => { if (!box.hidden) reset(); });
}
