/* Setup the SW  */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          // Check if successful
          console.log('SW registration successsful with scope: ',
              registration.scope);
        }, function(err) {
          // It failed
          console.log('SW registration failed: ', err);
        });
  });
}
