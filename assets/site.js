(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var filterScope = document.querySelector('[data-filter-scope]');
    var cardList = document.querySelector('[data-card-list]');

    if (filterScope && cardList) {
        var textInput = filterScope.querySelector('[data-filter-text]');
        var yearInput = filterScope.querySelector('[data-filter-year]');
        var typeInput = filterScope.querySelector('[data-filter-type]');
        var categoryInput = filterScope.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);

        if (textInput && params.get('q')) {
            textInput.value = params.get('q');
        }

        function normalize(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(textInput ? textInput.value : '');
            var year = yearInput ? yearInput.value : '';
            var type = typeInput ? typeInput.value : '';
            var category = categoryInput ? categoryInput.value : '';

            cards.forEach(function (card) {
                var haystack = normalize(card.innerText + ' ' + card.dataset.title + ' ' + card.dataset.year + ' ' + card.dataset.type + ' ' + card.dataset.category);
                var passQuery = !query || haystack.indexOf(query) !== -1;
                var passYear = !year || card.dataset.year === year;
                var passType = !type || card.dataset.type === type;
                var passCategory = !category || card.dataset.category === category;
                card.style.display = passQuery && passYear && passType && passCategory ? '' : 'none';
            });
        }

        [textInput, yearInput, typeInput, categoryInput].forEach(function (input) {
            if (input) {
                input.addEventListener('input', applyFilter);
                input.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }
})();
