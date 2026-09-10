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
