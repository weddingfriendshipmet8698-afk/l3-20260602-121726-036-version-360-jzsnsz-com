(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function setupNavigation() {
    var toggle = qs('[data-nav-toggle]');
    var panel = qs('[data-nav-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slider = qs('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = qsa('[data-hero-slide]', slider);
    var dots = qsa('[data-hero-dot]', slider);
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  function readQueryParam(name) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(name) || '';
    } catch (error) {
      return '';
    }
  }

  function setupFilters() {
    qsa('[data-filter-scope]').forEach(function (scope) {
      var input = qs('[data-card-search]', scope);
      var cards = qsa('.movie-card', scope);
      var hint = qs('[data-result-hint]', scope);
      var activeYear = 'all';
      var activeCategory = 'all';

      if (input) {
        var initialQuery = readQueryParam('q');
        if (initialQuery) {
          input.value = initialQuery;
        }
      }

      function textOf(card) {
        return [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-category') || ''
        ].join(' ').toLowerCase();
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var count = 0;
        cards.forEach(function (card) {
          var matchText = !query || textOf(card).indexOf(query) !== -1;
          var matchYear = activeYear === 'all' || card.getAttribute('data-year') === activeYear;
          var matchCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
          var visible = matchText && matchYear && matchCategory;
          card.style.display = visible ? '' : 'none';
          if (visible) {
            count += 1;
          }
        });
        if (hint) {
          hint.textContent = '共 ' + count + ' 部';
        }
      }

      qsa('[data-filter-year]', scope).forEach(function (button) {
        button.addEventListener('click', function () {
          activeYear = button.getAttribute('data-filter-year') || 'all';
          qsa('[data-filter-year]', scope).forEach(function (b) {
            b.classList.toggle('is-active', b === button);
          });
          apply();
        });
      });

      qsa('[data-filter-category]', scope).forEach(function (button) {
        button.addEventListener('click', function () {
          activeCategory = button.getAttribute('data-filter-category') || 'all';
          qsa('[data-filter-category]', scope).forEach(function (b) {
            b.classList.toggle('is-active', b === button);
          });
          apply();
        });
      });

      if (input) {
        input.addEventListener('input', apply);
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupFilters();
  });
})();
