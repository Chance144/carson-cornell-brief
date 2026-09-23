(function () {
  "use strict";

  var nav = document.getElementById("side-nav");
  var toggle = document.getElementById("nav-toggle");
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Contents";
    });

    links.forEach(function (a) {
      a.addEventListener("click", function () {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Contents";
        }
      });
    });
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var linkById = new Map(
      links.map(function (a) {
        return [a.getAttribute("href").slice(1), a];
      })
    );

    var setActive = function (id) {
      links.forEach(function (a) {
        a.classList.remove("active");
      });
      var link = linkById.get(id);
      if (link) link.classList.add("active");
    };

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (en) {
            return en.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-collapse-toggle]"), function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) panel.setAttribute("hidden", "");
      else panel.removeAttribute("hidden");
    });
  });
})();
