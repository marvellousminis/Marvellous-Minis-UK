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
