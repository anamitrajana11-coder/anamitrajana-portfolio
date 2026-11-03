// The one-pager (hello.html).
// Testimonials: the four cards sit fanned in a deck. Every 7 seconds, or on
// the arrow buttons, the front card slides out to the left, drops behind the
// others and settles at the back; a button press restarts the 7 seconds.
// Visitors who ask their system for reduced motion get a still deck that only
// the buttons change.
// Work mosaic: once the page and its pictures have loaded, the videos load
// too, two at a time from the top, so they're ready by the time anyone
// scrolls to them. Each one plays while it's near the screen and pauses once
// it's well past. Visitors whose browser is set to save data only load a
// video as it comes near. For reduced motion they show their first frame and
// stay still.
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
  var saveData = navigator.connection && navigator.connection.saveData;
  // Starts a video loading and calls `done` once it can play to the end, or
  // fails, or 15 seconds have passed, so one slow video never holds up the rest.
  var fetchVideo = function (video, done) {
    done = done || function () {};
    if (video.readyState >= 4) return done();
    var finish = function () {
      clearTimeout(wait);
      video.removeEventListener("canplaythrough", finish);
      video.removeEventListener("error", finish);
      done();
    };
    var wait = setTimeout(finish, 15000);
    video.addEventListener("canplaythrough", finish);
    video.addEventListener("error", finish);
    if (video.preload !== "auto") {
      video.preload = "auto";
      if (video.readyState === 0 && video.paused) video.load();
    }
  };

  var nearby = window.IntersectionObserver && new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (!entry.isIntersecting) {
        if (!reduce) video.pause();
      } else if (reduce) {
        fetchVideo(video);
      } else {
        video.play().catch(function () {});
      }
    });
  }, { rootMargin: "200px 0px" });
  videos.forEach(function (video) {
    if (nearby) nearby.observe(video);
    else if (!reduce) video.play();
  });

  if (!saveData) {
    var queue = Array.prototype.slice.call(videos);
    var next = function () {
      var video = queue.shift();
      if (video) fetchVideo(video, next);
    };
    var start = function () { next(); next(); };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start);
  }
})();
