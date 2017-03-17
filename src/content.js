(() => {
    if (window.location.search.match('allow_notifications')) { return; }
    if (!window.hasOwnProperty('Notification')) { return; }

    const script = document.createElement('script');
    script.innerHTML = `delete window.Notification`
    document.head.appendChild(script);
})();

(() => {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("allow_notifications", "");
        window.location.search = searchParams.toString();
    });
})()