document.addEventListener("DOMContentLoaded", () => {
    let categorySelect = document.getElementById("category-filter");

    if (categorySelect) {
        categorySelect.addEventListener("change", (event) => {
            let selectedCategory = event.target.value;
            let listings = document.querySelectorAll(".listing-card");

            listings.forEach(listing => {
                let category = listing.getAttribute("data-category");
                listing.style.display = category === selectedCategory || selectedCategory === "all" ? "block" : "none";
            });
        });
    }
});
