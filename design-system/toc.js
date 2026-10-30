// "On this page" contents (.cs-toc): highlights the link for the section
// currently in the upper part of the viewport. Used by the Yanta case studies
// and the older project pages; each link's href points at a section's id.
(function () {
  var links = document.querySelectorAll(".cs-toc a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("is-active"); });
      byId[entry.target.id].classList.add("is-active");
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  links.forEach(function (a) {
    var target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target) return;
    byId[target.id] = a;
    observer.observe(target);
  });
})();
