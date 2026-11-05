// Homepage visitor feedback form ("Drop your feedback").
// The form posts to Formspree (its action), which emails each note and keeps
// it in the Formspree dashboard. This sends it in the background and, as
// Webflow did, swaps the fields for the form's own thank-you message, or
// shows its error message and keeps what was typed. Webflow's form script
// leaves a form with its own action alone. Without this script the form
// still reaches Formspree as an ordinary page submit.
(function () {
  document.querySelectorAll('form[action^="https://formspree.io/"]').forEach(function (form) {
    var box = form.closest(".w-form");
    var done = box && box.querySelector(":scope > .w-form-done");
    var fail = box && box.querySelector(":scope > .w-form-fail");
    var button = form.querySelector('[type="submit"]');
    var show = function (sent) {
      form.style.display = sent ? "none" : "";
      if (done) done.style.display = sent ? "block" : "none";
      if (fail) fail.style.display = sent ? "none" : "block";
      var message = sent ? done : fail;
      if (message) {
        message.tabIndex = -1;
        message.focus();
      }
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree answered " + response.status);
          form.reset();
          show(true);
        })
        .catch(function () {
          show(false);
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
})();
