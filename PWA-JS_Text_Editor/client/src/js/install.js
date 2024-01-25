const butInstall = document.getElementById('buttonInstall');
let deferredPrompt;  // This will be used to save the beforeinstallprompt event
/*
Handling the beforeinstallprompt event: This event is fired before the user is prompted to "install" the PWA. 
We typically want to save this event so that we can show our own UI (like a button) at an appropriate time. 
By default, browsers might show their own installation prompt, 
but to give developers more control, this default prompt can be prevented, and a custom prompt can be shown instead.
*/
// Logic for installing the PWA

// Handle the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('👍', 'beforeinstallprompt', event);

    // Prevent Chrome <= 67 from automatically showing the prompt
    event.preventDefault();

    // Save the event so it can be triggered later.
    deferredPrompt = event;

    // Update UI notify the user they can install the PWA
    butInstall.removeAttribute('hidden');
});
  
  // Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    console.log('👍', 'butInstall-clicked');
    // Hide our user interface that shows the install button.
    butInstall.setAttribute('hidden', true);

    // Show the install prompt.
    if (deferredPrompt) {
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        deferredPrompt = null;
    }
});
  
// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    console.log('👍', 'appinstalled', event);

    // Display the modal
    const installModal = document.getElementById('installModal');
    installModal.style.display = "block";

    // Add a click event to the "OK" button to close the modal
    const modalCloseButton = document.getElementById('modalCloseButton');
    modalCloseButton.addEventListener('click', () => {
        installModal.style.display = "none";
    });
    deferredPrompt = null;
});
  