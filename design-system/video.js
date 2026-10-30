// Case-study videos (.cs-hero-video, and .cs-figure-video in the body) loop on
// their own, muted; a click — or Enter / Space when focused — pauses or
// resumes them. The hero autoplays; body videos start as they scroll near.
// Visitors who ask their system for reduced motion get them paused at the
// start. The wrapper gets .is-paused so the "Paused · click to play" tag shows.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nearby = window.IntersectionObserver && new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      nearby.unobserve(entry.target);
      entry.target.play();
    });
  }, { rootMargin: "200px 0px" });
  document.querySelectorAll(".cs-hero-video, .cs-figure-video").forEach(function (video) {
    var box = video.parentElement;
    function sync() { box.classList.toggle("is-paused", video.paused); }
    function toggle() {
      if (video.paused) video.play();
      else video.pause();
    }
    if (reduce) video.pause();
    else if (!video.autoplay) nearby ? nearby.observe(video) : video.play();
    video.addEventListener("click", toggle);
    video.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    sync();
  });
})();
