(function() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function() {
      mobileNav.classList.toggle("is-open");
    });
  }

  const slider = document.getElementById("heroSlider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dotsWrap = slider.querySelector("[data-hero-dots]");
    let current = 0;
    const dots = slides.map(function(_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "切换推荐 " + (index + 1));
      dot.addEventListener("click", function() {
        showSlide(index);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    function showSlide(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }
    if (slides.length > 0) {
      dots[0].classList.add("active");
      window.setInterval(function() {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  const pageFilter = document.querySelector("[data-page-filter]");
  const filterGrid = document.querySelector("[data-filter-grid]");
  if (pageFilter && filterGrid) {
    const cards = Array.from(filterGrid.querySelectorAll(".movie-card"));
    pageFilter.addEventListener("input", function() {
      const keyword = pageFilter.value.trim().toLowerCase();
      cards.forEach(function(card) {
        const content = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.textContent
        ].join(" ").toLowerCase();
        card.classList.toggle("is-hidden-by-filter", keyword && !content.includes(keyword));
      });
    });
  }

  const searchResults = document.getElementById("searchResults");
  const searchInput = document.getElementById("searchInput");
  const searchCount = document.getElementById("searchCount");
  if (searchResults && searchInput && typeof siteMovieData !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") || "";
    searchInput.value = initial;
    function clean(value) {
      return String(value || "").replace(/[&<>"]/g, function(match) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;"
        }[match];
      });
    }
    function render(items, keyword) {
      searchResults.innerHTML = items.slice(0, 120).map(function(item) {
        const tags = item.tags.slice(0, 3).map(function(tag) {
          return "<span>" + clean(tag) + "</span>";
        }).join("");
        return "<article class=\"movie-card\">" +
          "<a class=\"poster-link\" href=\"./" + clean(item.file) + "\">" +
          "<img src=\"./" + clean(item.cover) + ".jpg\" alt=\"" + clean(item.title) + "\" loading=\"lazy\">" +
          "<span class=\"type-badge\">" + clean(item.type) + "</span>" +
          "<span class=\"poster-play\">▶</span>" +
          "</a>" +
          "<div class=\"movie-card-body\">" +
          "<h3><a href=\"./" + clean(item.file) + "\">" + clean(item.title) + "</a></h3>" +
          "<p>" + clean(item.oneLine) + "</p>" +
          "<div class=\"movie-meta\"><span>" + clean(item.region) + "</span><span>" + clean(item.year) + "</span></div>" +
          "<div class=\"tag-row\">" + tags + "</div>" +
          "</div>" +
          "</article>";
      }).join("");
      if (!keyword) {
        searchCount.textContent = "显示推荐影片 " + items.length + " 部";
      } else {
        searchCount.textContent = "找到 " + items.length + " 部相关影片";
      }
      if (items.length === 0) {
        searchResults.innerHTML = "<div class=\"text-card\"><h2>没有找到匹配影片</h2><p>可以尝试使用片名、地区、年份或类型重新搜索。</p></div>";
      }
    }
    function doSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        render(siteMovieData.slice(0, 60), "");
        return;
      }
      const items = siteMovieData.filter(function(item) {
        return [item.title, item.region, item.type, item.year, item.genre, item.oneLine, item.tags.join(" ")].join(" ").toLowerCase().includes(keyword);
      });
      render(items, keyword);
    }
    searchInput.addEventListener("input", doSearch);
    doSearch();
  }
}());
