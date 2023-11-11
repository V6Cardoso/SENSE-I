// Toggle navigation menu
function toggleNav() {
    var navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("open");
    console.log('a')
}


// Close navigation menu when clicking outside of it
document.addEventListener('click', function(event) {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu.classList.contains('open')) {
      return;
    }
    
    if (!navMenu.contains(event.target) && (!event.target.classList.contains('open-button') && !event.target.classList.contains('close-button'))) {
      toggleNav();
    }
});