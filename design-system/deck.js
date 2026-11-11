// Homepage testimonial deck ("What others think"), the one-pager's card swipe.
// The cards sit fanned in a deck, four in view. Every 7 seconds, or on the
// next arrow, the front card slides out to the left, drops behind the others
// and settles at the back; the previous arrow brings the back card to the
// front. An arrow press restarts the 7 seconds. Visitors who ask their system
// for reduced motion get a still deck that only the arrows change.
// The 7 seconds only run while the deck is on screen: they start once
// (nearly) all of it has scrolled into view, so the first card is the first
// one a visitor reads, and they stop once more than half of it has scrolled
// away. Coming back starts a fresh 7 seconds on the same card.
// From 768px the leaving card stops at the left edge of the deck's slots, so
// it never covers the title column beside them; where that leaves too little
// room to read as a slide, it leaves by its full width.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wide = window.matchMedia && window.matchMedia("(min-width: 768px)");
  document.querySelectorAll(".ds-deck").forEach(function (deck) {
    var cards = deck.querySelectorAll(".ds-quote");
    var count = cards.length;
    var active = 0;
    var cell = deck.closest(".ds-deck-cell") || deck.parentElement;
    var timer, hold, tuck;
    var seen = !("IntersectionObserver" in window);
    var fit = function () {
      var room = deck.getBoundingClientRect().left - cell.getBoundingClientRect().left;
      var width = cards[0].offsetWidth;
      if (wide && wide.matches && room >= width / 3) deck.style.setProperty("--deck-out", -Math.min(room, width * 1.02) + "px");
      else deck.style.removeProperty("--deck-out");
    };
    var place = function (phase) {
      cards.forEach(function (card, i) {
        var pos = (i - active + count) % count;
        if (pos === count - 1 && phase !== "back") card.dataset.pos = phase;
        else card.dataset.pos = pos > 3 ? "back" : pos;
      });
    };
    var go = function (step) {
      active = (active + step + count) % count;
      clearTimeout(hold);
      clearTimeout(tuck);
      if (step < 0) return place("back");
      place("out");
      hold = setTimeout(function () { place("hold"); }, 430);
      tuck = setTimeout(function () { place("back"); }, 450);
    };
    var start = function () {
      clearInterval(timer);
      if (!reduce && seen) timer = setInterval(function () { go(1); }, 7000);
    };
    cell.querySelectorAll("[data-deck-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        go(Number(button.dataset.deckStep));
        start();
      });
    });
    window.addEventListener("resize", fit);
    fit();
    place("back");
    start();
    if (seen || reduce) return;
    // How much of the deck is showing, against how much of it could show
    // (a deck taller than the window counts as in view when it fills it).
    var steps = [];
    for (var i = 0; i <= 20; i++) steps.push(i / 20);
    new IntersectionObserver(function (entries) {
      var entry = entries[entries.length - 1];
      var height = entry.boundingClientRect.height;
      var share = height ? entry.intersectionRect.height / Math.min(height, window.innerHeight) : 0;
      if (!seen && share >= 0.9) {
        seen = true;
        start();
      } else if (seen && share < 0.5) {
        seen = false;
        clearInterval(timer);
      }
    }, { threshold: steps }).observe(deck);
  });
})();
