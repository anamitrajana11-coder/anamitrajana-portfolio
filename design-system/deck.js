// Homepage testimonial deck ("What others think"), the one-pager's card swipe.
// The cards sit fanned in a deck, four in view. Every 7 seconds, or on the
// next arrow, the front card slides out to the left, drops behind the others
// and settles at the back; the previous arrow brings the back card to the
// front. An arrow press restarts the 7 seconds. Visitors who ask their system
// for reduced motion get a still deck that only the arrows change.
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
      if (!reduce) timer = setInterval(function () { go(1); }, 7000);
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
  });
})();
