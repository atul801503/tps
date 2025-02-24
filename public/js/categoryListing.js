const filters = document.querySelectorAll('.filter');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const category = filter.querySelector('p')?.textContent.trim(); // Trim whitespace
        console.log("Clicked category:", category); // Debugging
        if (category) {
            window.location.href = `/listings/category?filter=${encodeURIComponent(category)}`;
        } else {
            console.error("Category not found");
        }
    });
});
