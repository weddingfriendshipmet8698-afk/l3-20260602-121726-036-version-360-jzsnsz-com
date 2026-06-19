(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMobileNavigation() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.textContent = open ? "×" : "☰";
        });
    }

    function setupHeroCarousel() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = selectAll("[data-hero-slide]", slider);
        var dots = selectAll("[data-hero-dot]", slider);
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(target) {
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        restart();
    }

    function setupListingFilters() {
        selectAll(".listing-zone").forEach(function (zone) {
            var input = zone.querySelector("#site-search-input");
            var chips = selectAll(".filter-chip", zone);
            var cards = selectAll(".movie-card", zone).concat(selectAll(".ranking-item", zone));
            var empty = zone.querySelector("[data-empty-state]");
            var state = { key: "all", value: "all", query: "" };

            function readCard(card) {
                return [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].join(" ");
            }

            function apply() {
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize(readCard(card));
                    var queryMatch = !state.query || haystack.indexOf(state.query) !== -1;
                    var filterMatch = state.key === "all" || normalize(card.getAttribute("data-" + state.key)).indexOf(normalize(state.value)) !== -1;
                    var show = queryMatch && filterMatch;
                    card.hidden = !show;
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            chips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    chips.forEach(function (item) {
                        item.classList.remove("is-active");
                    });
                    chip.classList.add("is-active");
                    state.key = chip.getAttribute("data-filter-key") || "all";
                    state.value = chip.getAttribute("data-filter-value") || "all";
                    apply();
                });
            });

            if (input) {
                var params = new URLSearchParams(window.location.search);
                var initialQuery = params.get("q") || "";
                input.value = initialQuery;
                state.query = normalize(initialQuery);
                input.addEventListener("input", function () {
                    state.query = normalize(input.value);
                    apply();
                });
            }
            apply();
        });
    }

    window.setupMoviePlayer = function (videoId, coverId, source) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        if (!video || !source) {
            return;
        }
        var playButton = cover ? cover.querySelector("button") : null;
        var hlsInstance = null;
        var attached = false;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = source;
        }

        function start() {
            attach();
            video.setAttribute("controls", "controls");
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", start);
        }
        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.stopPropagation();
                start();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupMobileNavigation();
        setupHeroCarousel();
        setupListingFilters();
    });
})();
