// The one-pager (hello.html).
// Testimonials: the four cards sit fanned in a deck. Every 7 seconds, or on
// the arrow buttons, the front card slides out to the left, drops behind the
// others and settles at the back; a button press restarts the 7 seconds.
// Visitors who ask their system for reduced motion get a still deck that only
// the buttons change.
// Work mosaic: the videos are the case studies' full-size files (105 MB in
// all). Loading them all at once held up every other page from the site while
// this one stayed open, so each loads and plays only from a screen's height
// before it comes into view, and pauses once it's that far past. For reduced
// motion they show their first frame and stay still.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var deck = document.querySelector(".hello-deck");
  if (deck) {
    var cards = deck.querySelectorAll(".hello-quote");
    var count = cards.length;
    var active = 0;
    var timer, hold, tuck;
    var place = function (phase) {
      cards.forEach(function (card, i) {
        var pos = (i - active + count) % count;
        card.dataset.pos = pos === count - 1 && phase !== "back" ? phase : pos;
      });
    };
    var go = function (step) {
      active = (active + step + count) % count;
      clearTimeout(hold);
      clearTimeout(tuck);
      place("out");
      hold = setTimeout(function () { place("hold"); }, 430);
      tuck = setTimeout(function () { place("back"); }, 450);
    };
    var start = function () {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go(1); }, 7000);
    };
    document.querySelectorAll("[data-deck-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        go(Number(button.dataset.deckStep));
        start();
      });
    });
    place("back");
    start();
  }

  var videos = document.querySelectorAll("video.hello-tile");
  var nearby = window.IntersectionObserver && new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (reduce) {
        if (entry.isIntersecting) {
          nearby.unobserve(video);
          video.preload = "auto";
          video.load();
        }
      } else if (entry.isIntersecting) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: "100% 0px" });
  videos.forEach(function (video) {
    if (nearby) nearby.observe(video);
    else if (!reduce) video.play();
  });
})();
