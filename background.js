chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    const tab = await chrome.tabs.get(tabId)

    // Only inject on LeetCode pages
    if (tab.url?.includes('leetcode.com')) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-script.js'],
      })
    }
  }
})
