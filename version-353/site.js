document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".menu-button");
  var panel = document.querySelector(".mobile-panel");
  if (button && panel) {
    button.addEventListener("click", function () {
      var opened = panel.hasAttribute("hidden");
      if (opened) {
        panel.removeAttribute("hidden");
        button.setAttribute("aria-expanded", "true");
        button.textContent = "×";
      } else {
        panel.setAttribute("hidden", "");
        button.setAttribute("aria-expanded", "false");
        button.textContent = "☰";
      }
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;
    var show = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-pressed", i === index ? "true" : "false");
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show((current + 1) % slides.length);
      }, 5800);
    }
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var grid = document.querySelector("[data-filter-grid]");
  var empty = document.querySelector("[data-no-results]");
  if (filterInput && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (initial) {
      filterInput.value = initial;
    }
    var applyFilter = function () {
      var query = filterInput.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var matched = !query || text.indexOf(query) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };
    filterInput.addEventListener("input", applyFilter);
    applyFilter();
  }
});
