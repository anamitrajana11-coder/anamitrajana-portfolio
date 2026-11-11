// Visitor feedback ("Drop your feedback", at the bottom of the About page):
// a popover under the button, in the manner of shadcn/ui's Popover.
// The button opens and closes it; Escape or a click outside closes it too,
// and Escape hands focus back to the button. Opening puts the cursor in the
// first field.
// The form posts to Formspree (its action), which emails each note and keeps
// it in the Formspree dashboard. It's sent in the background. On success the
// rows give way to a thank-you (the next opening brings a fresh form); on
// failure a line says so and the text stays. Required fields are checked
// here: an empty one gets a small red dot in its row instead of the
// browser's bubble.
(function () {
  var popover = document.getElementById("feedback-popover");
  var trigger = document.querySelector('[aria-controls="feedback-popover"]');
  if (!popover || !trigger) return;
  var form = popover.querySelector("form");
  var done = popover.querySelector(".ds-feedback-done");
  var fail = popover.querySelector(".ds-feedback-fail");
  var button = form.querySelector('[type="submit"]');
  var required = form.querySelectorAll("[required]");
  var closing;

  var isOpen = function () {
    return trigger.getAttribute("aria-expanded") === "true";
  };
  var outside = function (event) {
    if (!popover.contains(event.target) && !trigger.contains(event.target)) close(false);
  };
  var escape = function (event) {
    if (event.key === "Escape") close(true);
  };
  var open = function () {
    clearTimeout(closing);
    popover.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      popover.classList.add("is-open");
    });
    (form.hidden ? done : form.querySelector("input, textarea")).focus({ preventScroll: true });
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
  };
  var close = function (refocus) {
    popover.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", outside);
    document.removeEventListener("keydown", escape);
    closing = setTimeout(function () {
      popover.hidden = true;
      if (form.hidden) {
        form.hidden = false;
        done.hidden = true;
      }
    }, 150);
    if (refocus) trigger.focus();
  };

  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    if (isOpen()) close(false);
    else open();
  });
  trigger.addEventListener("keydown", function (event) {
    if (event.key === " ") {
      event.preventDefault();
      trigger.click();
    }
  });

  var check = function (field) {
    var empty = !field.value.trim();
    field.setAttribute("aria-invalid", empty ? "true" : "false");
    document.getElementById(field.id + "-error").hidden = !empty;
    return !empty;
  };
  required.forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") check(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (button.disabled) return;
    var first = null;
    required.forEach(function (field) {
      if (!check(field) && !first) first = field;
    });
    if (first) {
      first.focus();
      return;
    }
    fail.hidden = true;
    button.disabled = true;
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("Formspree answered " + response.status);
        form.reset();
        form.hidden = true;
        done.hidden = false;
        done.focus();
      })
      .catch(function () {
        fail.hidden = false;
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
