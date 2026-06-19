document.addEventListener('DOMContentLoaded', function () {
  setupMobileMenu();
  setupHeroCarousel();
  setupCardFilters();
  setupSearchPageQuery();
  setupPlayer();
});

function setupMobileMenu() {
  var button = document.querySelector('[data-mobile-menu-button]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (!button || !menu) {
    return;
  }

  button.addEventListener('click', function () {
    menu.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

  if (!slides.length) {
    return;
  }

  var activeIndex = 0;
  var timer = null;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  function startTimer() {
    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      window.clearInterval(timer);
      showSlide(Number(dot.dataset.heroDot || 0));
      startTimer();
    });
  });

  showSlide(0);
  startTimer();
}

function setupCardFilters() {
  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

  scopes.forEach(function (scope) {
    var searchInput = scope.querySelector('[data-card-search]');
    var regionSelect = scope.querySelector('[data-region-filter]');
    var typeSelect = scope.querySelector('[data-type-filter]');
    var section = scope.closest('section') || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
    var resultCount = section.querySelector('[data-result-count]');

    function applyFilter() {
      var query = normalizeText(searchInput ? searchInput.value : '');
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalizeText([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.tags,
          card.dataset.category
        ].join(' '));
        var regionMatch = !region || card.dataset.region === region;
        var typeMatch = !type || card.dataset.type === type;
        var queryMatch = !query || haystack.indexOf(query) !== -1;
        var visible = regionMatch && typeMatch && queryMatch;

        card.classList.toggle('is-filtered-out', !visible);

        if (visible) {
          visibleCount += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = '当前显示 ' + visibleCount + ' 部影片';
      }
    }

    [searchInput, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  });
}

function setupSearchPageQuery() {
  var searchPage = document.querySelector('[data-search-page]');

  if (!searchPage) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var keyword = params.get('q') || '';
  var input = searchPage.querySelector('[data-card-search]');

  if (input && keyword) {
    input.value = keyword;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function setupPlayer() {
  var video = document.querySelector('#videoPlayer');
  var button = document.querySelector('[data-play-button]');

  if (!video || !button) {
    return;
  }

  function playVideo() {
    var src = video.dataset.src || video.currentSrc || video.src;

    if (!src) {
      return;
    }

    button.classList.add('is-hidden');

    if (window.Hls && window.Hls.isSupported()) {
      attachHls(video, src);
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.play().catch(function () {});
      return;
    }

    loadHlsScript(function () {
      if (window.Hls && window.Hls.isSupported()) {
        attachHls(video, src);
      } else {
        video.src = src;
        video.play().catch(function () {});
      }
    });
  }

  button.addEventListener('click', playVideo);
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
}

function attachHls(video, src) {
  var hls = new window.Hls({
    enableWorker: true,
    lowLatencyMode: true
  });

  hls.loadSource(src);
  hls.attachMedia(video);
  hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
    video.play().catch(function () {});
  });
}

function loadHlsScript(callback) {
  var existing = document.querySelector('script[data-hls-loader]');

  if (existing) {
    existing.addEventListener('load', callback, { once: true });
    return;
  }

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
  script.defer = true;
  script.dataset.hlsLoader = 'true';
  script.onload = callback;
  document.head.appendChild(script);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
