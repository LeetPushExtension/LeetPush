chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.startsWith("https://leetcode.com/problems/")) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["/scripts/leetcode.js"]
        });
    }
});
