//
//   what to do:
//   1. star rating
//   2. Build the single product
//   3. Render cards into desktop slider and mobile grids
//   4. Handle show more button
//   5. Image hover
//

(function () {

  // build star icons from rating (1–5)
  function buildStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<i class="fa-solid fa-star text-brand-heading text-xs"></i>'
        : '<i class="fa-regular fa-star text-brand-heading text-xs"></i>';
    }
    return html;
  }

  function buildCard(product) {
    return `
      <li class="group flex-shrink-0 w-[158px] h-[159px] md:w-[355px] md:h-auto md:min-h-[355px] cursor-pointer">
        <article>
          <div class="product-card__image-wrapper relative overflow-hidden rounded-lg aspect-square mb-3 bg-gray-100">

            ${product.badge ? `
              <div class="absolute top-3 left-3 z-10">
                <span class="border border-brand-badge text-brand-badge bg-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                  ${product.badge}
                </span>
              </div>
            ` : ''}
            <img
              src="${product.image}"
              alt="${product.name}"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-350 group-hover:opacity-0"
              loading="lazy"
            />
            <img
              src="${product.imageHover}"
              alt=""
              aria-hidden="true"
              class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-350 group-hover:opacity-100"
            />

          </div>
          <div class="product-card__info px-1">

            <h3 class="text-[11px] font-semibold uppercase tracking-wide leading-snug text-brand-text mb-1">
              ${product.name}
            </h3>

            <div class="flex items-center gap-1 mb-1">
              <div
                class="flex items-center gap-0.5"
                aria-label="${product.rating} out of 5 stars"
                role="img"
              >
                ${buildStars(product.rating)}
              </div>
              <span class="text-[11px] text-brand-subtle">
                ${product.reviews.toLocaleString()} Reviews
              </span>
            </div>
            <p class="text-sm font-bold text-brand-text">${product.price}</p>

          </div>
        </article>
      </li>
    `;
  }

  function renderDesktop() {
    const slider = document.getElementById('product-slider');
    if (!slider) return;
    slider.innerHTML = bestSellers.map(buildCard).join('');
  }

  function renderMobile() {
    const grid  = document.getElementById('product-grid-mobile');
    const extra = document.getElementById('extra-cards');
    if (!grid || !extra) return;

    // show first 4 cards
    grid.innerHTML  = bestSellers.slice(0, 4).map(buildCard).join('');
    extra.innerHTML = bestSellers.slice(4).map(buildCard).join('');
  }

  function initShowMore() {
    const button   = document.getElementById('show-more-btn');
    const extra = document.getElementById('extra-cards');
    if (!button || !extra) return;

    let isOpen = false;

    button.addEventListener('click', function () {
      isOpen = !isOpen;

      if (isOpen) {
        extra.style.maxHeight  = extra.scrollHeight + 'px';
        extra.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        button.textContent = 'Show Less';
      } else {
        extra.style.maxHeight  = '0';
        extra.setAttribute('aria-hidden', 'true');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Show More';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof bestSellers === 'undefined') {
      console.error('bestSellers are not defined');
      return;
    }
    renderDesktop();
    renderMobile();
    initShowMore();
  });

})();
