import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();
if (typeof editor === 'undefined') {
  loadSpinner();
}
/*
// Registration is the initial step of the service worker lifecycle:
Because the user's first visit to a website occurs without a registered service worker, 
wait until the page is fully loaded before registering one. 
This avoids bandwidth contention if the service worker precaches anything.
Though service worker is well-supported, 
a quick check helps to avoid errors in browsers where it isn't supported.
When the page is fully loaded, and if service worker is supported, register /sw.js.
// Service workers are only available over HTTPS or localhost.
-
If a service worker's contents contain syntax errors, registration fails and the service worker is discarded.
Reminder: service workers operate within a scope. Here, the scope is the entire origin, as it was loaded from the root directory.
When registration begins, the service worker state is set to 'installing'.
*/
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/src-sw.js');

  function showUpdateNotification(workbox) {
    // a simple demonstration of UI/UX used to reload.
    let updateButton = document.createElement('button');
    updateButton.innerText = 'Update to latest version';
    updateButton.onclick = () => {
      workbox.messageSW({ type: 'SKIP_WAITING' }); // directly use the workboxSW here
    };
    document.body.appendChild(updateButton);
  }

  workboxSW.addEventListener('waiting', (event) => {
    if (event.isUpdate) { // Check if this is an update
      // This line appears to be React specific, commenting it out:
      // this.setState({ updateAvailable: true });

      // Show notification or button to the user for the update
      showUpdateNotification(workboxSW);

      // Implement a skip waiting strategy
      workboxSW.messageSW({ type: 'SKIP_WAITING' });
    }
  });
  /*
This listens for when the service worker controller changes, i.e., 
when a new service worker takes control. When this happens, 
the page is reloaded to ensure that the new service worker controls 
the assets and the new version of the app is used.
  */
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  workboxSW.register().catch((error) => {
    console.error('Service worker registration failed:', error);
  });
} else {
  console.error('Service workers are not supported in this browser.');
}