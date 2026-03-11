(function () {
  const container = document.getElementById("featured-products");
  if (!container || typeof bestSellers === "undefined") return;

  bestSellers.forEach(function (product) {
    const card = document.createElement("article");
    card.className =
      "featured-product group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100";
    card.innerHTML =
      '<a href="#" class="block relative aspect-square overflow-hidden focus:outline focus:outline-2 focus:outline-current focus:outline-offset-2">' +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">' +
      (product.badge
        ? '<span class="absolute top-3 left-3 bg-stone-800 text-white text-xs font-medium px-2 py-1 rounded">' +
          product.badge +
          "</span>"
        : "") +
      "</a>" +
      '<div class="p-4">' +
      '<h3 class="font-serif text-stone-800 font-medium mb-1">' +
      product.name +
      "</h3>" +
      '<p class="text-stone-600 font-poppins">$' +
      product.price +
      "</p>" +
      "</div>";
    container.appendChild(card);
  });
})();
