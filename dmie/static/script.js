// Toggle navigation menu
function toggleNav() {
    var navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("open");
}


// Close navigation menu when clicking outside of it
document.addEventListener('click', function(event) {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu.classList.contains('open')) {
      return;
    }
    var openButton = document.querySelector('.open-button');
    if (event.target !== navMenu && event.target !== openButton) {
      navMenu.classList.remove('open');
    }
});