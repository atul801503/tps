const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = "Switch to Light Mode";
  } else {
    darkModeToggle.textContent = "Switch to Dark Mode";
  }
});
