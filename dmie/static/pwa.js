// app.js
// JavaScript code to make the to-do list PWA functional

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
      .then(function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
          console.error('Service Worker registration failed:', error);
      });
}
