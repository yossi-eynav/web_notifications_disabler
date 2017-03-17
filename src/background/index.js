(() => {

    chrome.contextMenus.removeAll();
        chrome.contextMenus.create({
            title: "Allow notifications on this page",
            id: 'disable',
            contexts: ["browser_action"],
              onclick: function() {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                        chrome.tabs.sendMessage(tabs[0].id, {action: "allow_notifications"});  
                    });
      }
        });

})();