(function () {
  // build star icons from rating (1–5)
  function buildStars(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html +=
        i <= rating
          ? '<i class="fa-solid fa-star text-brand-heading text-xs"></i>'
          : '<i class="fa-regular fa-star text-brand-heading text-xs"></i>';
    }
    return html;
  }

  const badgeStyles = {
    outline: "border border-brand-badge text-brand-badge bg-white",
    filled:  "border border-brand-badge bg-brand-sale text-white",
  };
  function buildPill(text, { position = "left", variant = "outline" } = {}) {
    if (!text) return "";
    const pos = position === "right"
      ? "right-1 md:right-2"
      : "left-1 md:left-2";
    return `
    <div class="absolute top-1 ${pos} md:top-2 z-10 leading-[0]">
      <span class="inline-block font-bebas font-normal text-[8px] md:text-[10px] leading-[100%] 
                   tracking-[0.04em] md:tracking-[0.06em] uppercase text-center
                   ${badgeStyles[variant]} 
                   px-2 py-1 rounded-full whitespace-nowrap">
        ${text}
      </span>
    </div>
  `;
  }

  function buildImages(product) {
    return `
    <img
      src="${product.image}"
      alt="${product.name}"
      class="absolute inset-0 w-full h-full object-cover 
             transition-opacity duration-300 group-hover:opacity-0"
      loading="lazy"
    />
    <img
      src="${product.imageHover}"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover 
             opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  `;
  }

  function buildMeta(product) {
    return `
    <h3 class="font-bebas text-[18px] font-normal uppercase 
               leading-[100%] tracking-[0.03em] text-brand-text mb-2">
      ${product.name}
    </h3>
    <div class="flex items-center gap-1 mb-1">
      <div class="flex items-center gap-0.5"
           aria-label="${product.rating} out of 5 stars"
           role="img">
        ${buildStars(product.rating)}
      </div>
      <span class="font-normal text-[11px] md:text-xs md:leading-none text-brand-subtle">
         ${product.reviews.toLocaleString()} Reviews
      </span>
    </div>
    <p class="font-medium text-base leading-none text-brand-text">${product.price}</p>
  `;
  }

  function buildCard(product) {
    return `
    <li class="group flex-shrink-0 w-full md:w-[355px] cursor-pointer">
      <article>
        <div class="product-card__image-wrapper relative overflow-hidden 
                    rounded-lg aspect-square mb-4 bg-gray-100">
          ${(product.pills || []).map(p => buildPill(p.text, { position: p.position, variant: p.variant })).join("")}
          ${buildImages(product)}
        </div>
        <div class="product-card__info px-1">
          ${buildMeta(product)}
        </div>
      </article>
    </li>
  `;
  }

  function renderDesktop() {
    const slider = document.getElementById("product-slider");
    if (!slider) return;
    slider.innerHTML = bestSellers.map(buildCard).join("");
  }

  function renderMobile() {
    const grid = document.getElementById("product-grid-mobile");
    const extra = document.getElementById("extra-cards");
    if (!grid || !extra) return;

    grid.innerHTML = bestSellers.slice(0, 4).map(buildCard).join("");
    extra.innerHTML = bestSellers.slice(4).map(buildCard).join("");
    // Render once toggle visibility only
  }

  function initShowMore() {
    const button = document.getElementById("show-more-btn");
    const extra = document.getElementById("extra-cards");
    if (!button || !extra) return;

    let isOpen = false;
    let cachedHeight = null;

    button.addEventListener("click", function () {
      isOpen = !isOpen;

      if (isOpen) {
        if (cachedHeight == null) {
          extra.style.maxHeight = "none";
          cachedHeight = extra.scrollHeight;
          extra.style.maxHeight = "0";
          void extra.offsetHeight; 
        }
        extra.style.maxHeight = cachedHeight + "px";
        extra.setAttribute("aria-hidden", "false");
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Show Less";
      } else {
        extra.style.maxHeight = "0";
        extra.setAttribute("aria-hidden", "true");
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Show More";
      }
    });
  }

  function initCustomScrollbar() {
    const slider = document.getElementById("product-slider");
    const bar = document.getElementById("slider-scrollbar");
    if (!slider || !bar) return;

    const thumb = bar.querySelector(".custom-scrollbar__thumb");
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    function updateThumb() {
      const scrollWidth = slider.scrollWidth;
      const clientWidth = slider.clientWidth;
      if (scrollWidth <= clientWidth) {
        bar.style.display = "none";
        return;
      }
      bar.style.display = "block";
      const ratio = clientWidth / scrollWidth;
      const thumbWidth = Math.max(ratio * bar.clientWidth, 40);
      const maxThumbLeft = bar.clientWidth - thumbWidth;
      const scrollRatio = slider.scrollLeft / (scrollWidth - clientWidth);
      thumb.style.width = thumbWidth + "px";
      thumb.style.left = scrollRatio * maxThumbLeft + "px";
    }

    slider.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);

    bar.addEventListener("mousedown", function (e) {
      const rect = bar.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      if (e.clientX < thumbRect.left || e.clientX > thumbRect.right) {
        const clickRatio = (e.clientX - rect.left) / rect.width;
        slider.scrollLeft = clickRatio * (slider.scrollWidth - slider.clientWidth);
      }

      dragging = true;
      startX = e.clientX;
      startScrollLeft = slider.scrollLeft;
      bar.classList.add("dragging");
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const trackWidth = bar.clientWidth;
      const scrollableWidth = slider.scrollWidth - slider.clientWidth;
      slider.scrollLeft = startScrollLeft + (dx / trackWidth) * scrollableWidth;
    });

    document.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;
      bar.classList.remove("dragging");
    });

    bar.addEventListener("touchstart", function (e) {
      dragging = true;
      startX = e.touches[0].clientX;
      startScrollLeft = slider.scrollLeft;
      bar.classList.add("dragging");
    }, { passive: true });

    document.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      const trackWidth = bar.clientWidth;
      const scrollableWidth = slider.scrollWidth - slider.clientWidth;
      slider.scrollLeft = startScrollLeft + (dx / trackWidth) * scrollableWidth;
    });

    document.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      bar.classList.remove("dragging");
    });

    updateThumb();
    window.addEventListener("load", updateThumb);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof bestSellers === "undefined") {
      console.error("bestSellers are not defined");
      return;
    }
    renderDesktop();
    renderMobile();
    initShowMore();
    initCustomScrollbar();
  });
})();
