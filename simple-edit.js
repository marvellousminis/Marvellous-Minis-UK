/*
========================================================
MARVELLOUS MINIS UK — EDIT THIS FILE
========================================================
You only need to edit the lines below.

CHANGE YOUR DETAILS
*/
const EMAIL = "marvellousminisuk@gmail.com";
const INSTAGRAM = "https://www.instagram.com/marvelous40kminis/";

/*
CHANGE YOUR WEBSITE WORDING HERE
*/
const HERO_TITLE = "Marvellous Minis UK";
const HERO_SUBTITLE = "Hand-painted miniatures, commissions & custom work.";

const ABOUT_TEXT =
  "Passionate miniature painting and custom work, creating tabletop pieces with care and character.";

const COMMISSION_TEXT =
  "Have a miniature you'd like painted? Get in touch and tell me what you have in mind.";

/*
THE BIG SLIDESHOW AT THE TOP

You do not normally edit this. To change the slideshow, just add or remove
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
ADD YOUR PORTFOLIO PHOTOS HERE

Put your photos in the images folder.
Then copy a line and change the filename and name.

Example:
{ image: "images/my-mini.jpg", title: "My New Mini" },
*/
const PORTFOLIO = [
  { image: "images/portfolio-1.jpg", title: "Featured Miniature 1" },
  { image: "images/portfolio-2.jpg", title: "Featured Miniature 2" },
  { image: "images/portfolio-3.jpg", title: "Featured Miniature 3" }
];

/*
========================================================
DO NOT EDIT BELOW THIS LINE
========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  setText(".hero h1", HERO_TITLE);
  setText(".hero p", HERO_SUBTITLE);
  setText(".about p", ABOUT_TEXT);
  setText(".contact p", COMMISSION_TEXT);

  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.href = `mailto:${EMAIL}?subject=Marvellous%20Minis%20UK%20Commission%20Enquiry`;
  });

  document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
    a.href = INSTAGRAM;
  });

  buildHeroCarousel();
  buildLightbox();

  const portfolioContainer =
    document.querySelector(".portfolio-grid") ||
    document.querySelector(".portfolio .grid");

  if (portfolioContainer && PORTFOLIO.length) {
    const existingCards = Array.from(portfolioContainer.children);
    PORTFOLIO.forEach((item, i) => {
      if (existingCards[i]) {
        const img = existingCards[i].querySelector("img");
        const title = existingCards[i].querySelector("h3, h2, .title");
        if (img) {
          img.src = item.image;
          img.alt = item.title;
        }
        if (title) title.textContent = item.title;
      }
    });
  }
});

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
    if (i === 0) {
      img.fetchPriority = "high";
    } else {
      img.loading = "lazy";
    }
    stage.appendChild(img);
    return img;
  });

  if (slides.length < 2) return;

  const dots = document.createElement("div");
  dots.className = "hero-dots";
  dots.setAttribute("role", "tablist");
  dots.setAttribute("aria-label", "Featured work");
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show photo ${i + 1} of ${slides.length}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => show(i, true));
    dots.appendChild(dot);
  });
  hero.appendChild(dots);

  const stillFrames = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer = null;

  function show(next, fromClick) {
    if (next === current) return;
    slides[current].classList.remove("is-active");
    slides[next].classList.add("is-active");
    dots.children[current].setAttribute("aria-current", "false");
    dots.children[next].setAttribute("aria-current", "true");
    current = next;
    if (fromClick) start();
  }

  function start() {
    stop();
    if (stillFrames) return;
    timer = setInterval(
      () => show((current + 1) % slides.length),
      Math.max(2, HERO_SECONDS_PER_SLIDE) * 1000
    );
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function step(delta) {
    show((current + delta + slides.length) % slides.length, true);
  }

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start()
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
    if (!tracking) {
      start();
      return;
    }
    tracking = false;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) >= SWIPE_MIN_PX) step(dx < 0 ? 1 : -1);
    else start();
  }, { passive: true });

  hero.addEventListener("touchcancel", () => {
    tracking = false;
    start();
  }, { passive: true });

  start();
}

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

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.hidden = true;
  box.innerHTML =
    '<div class="lightbox-stage"><img alt=""></div>' +
    '<button class="lightbox-btn lightbox-close" type="button" aria-label="Close">×</button>' +
    '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo">‹</button>' +
    '<button class="lightbox-btn lightbox-next" type="button" aria-label="Next photo">›</button>' +
    '<div class="lightbox-bar">' +
      '<span class="lightbox-caption"></span>' +
      '<span class="lightbox-count"></span>' +
      '<span class="lightbox-hint"></span>' +
    '</div>';
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

  function load(next) {
    index = (next + photos.length) % photos.length;
    const photo = photos[index];
    img.onerror = () => { img.onerror = null; img.src = photo.thumb; };
    img.src = photo.full;
    img.alt = photo.alt;
    caption.textContent = photo.caption;
    counter.textContent = index + 1 + " / " + photos.length;
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
  box.querySelector(".lightbox-prev").addEventListener("click", () => load(index - 1));
  box.querySelector(".lightbox-next").addEventListener("click", () => load(index + 1));

  // Clicking the dark area around the photo closes; clicking the photo zooms.
  stage.addEventListener("click", event => {
    if (event.target !== img) { close(); return; }
    if (moved) return;
    zoomTo(scale > 1.01 ? 1 : STEP_SCALE, event.clientX, event.clientY);
  });

  document.addEventListener("keydown", event => {
    if (box.hidden) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") load(index - 1);
    else if (event.key === "ArrowRight") load(index + 1);
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
      load(index + (dx < 0 ? 1 : -1));
    }
    swiping = false;
  }, { passive: true });

  window.addEventListener("resize", () => { if (!box.hidden) reset(); });
}
