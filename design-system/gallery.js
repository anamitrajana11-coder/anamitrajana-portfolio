// The gallery near the end of each Yanta case study (.cs-gallery): as it
// crosses the window, rows ._01 drift left and row ._02 right. This sets
// --cs-gallery-progress from 0 (gallery entering at the bottom) to 1 (gone
// past the top), eased toward the scroll position a little each frame like
// the Webflow interaction on the older pages; case-study.css turns it into
// the sideways move. Visitors who ask for reduced motion get still rows.
(function () {
  var gallery = document.querySelector(".cs-gallery");
  if (!gallery) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var shown = 0;
  var frame = 0;
  function target() {
    var box = gallery.getBoundingClientRect();
    var height = window.innerHeight;
    return Math.min(1, Math.max(0, (height - box.top) / (height + box.height)));
  }
  function step() {
    var goal = target();
    shown += (goal - shown) * 0.1;
    if (Math.abs(goal - shown) < 0.0005) shown = goal;
    gallery.style.setProperty("--cs-gallery-progress", shown.toFixed(4));
    frame = shown === goal ? 0 : requestAnimationFrame(step);
  }
  function wake() {
    if (!frame) frame = requestAnimationFrame(step);
  }
  // Start where the page opens, so a reload mid-page doesn't sweep the rows.
  shown = target();
  step();
  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", wake);
})();
