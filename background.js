chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId}, func: () => {
                let probName, solutionText, fileExtension;
                /** Problem Name */
                const problemNameElement = document.querySelector("div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a");
                if (problemNameElement) {
                    probName = problemNameElement.innerText.replace(".", "").replaceAll(" ", "-");
                    sessionStorage.setItem('probName', probName);
                }
                /** Solution */
                const solutionElement = document.querySelector("[class^=\"language-\"]");
                if (solutionElement) {
                    solutionText = solutionElement.innerText;
                    sessionStorage.setItem('solutionText', solutionText);
                }
                /** File Extension */
                const solutionLanguageText = document.querySelector("div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.bg-fill-quaternary.dark\\:bg-fill-quaternary.relative.w-full.overflow-hidden.rounded-lg > div > div.text-caption.px-4.py-2.font-medium.text-text-primary.dark\\:text-text-primary")
                const fileExtensions = {
                    "C++": ".cpp",
                    "Java": ".java",
                    "Python": ".py",
                    "Python3": ".py",
                    "C": ".c",
                    "C#": ".cs",
                    "JavaScript": ".js",
                    "TypeScript": ".ts",
                    "PHP": ".php",
                    "Swift": ".swift",
                    "Kotlin": ".kt",
                    "Dart": ".dart",
                    "Go": ".go",
                    "Ruby": ".rb",
                    "Scala": ".scala",
                    "Rust": ".rs",
                    "Racket": ".rkt",
                    "Erlang": ".erl",
                    "Elixir": ".ex",
                };
                if (solutionLanguageText) {
                    fileExtension = fileExtensions[solutionLanguageText.innerText]
                    sessionStorage.setItem('fileExtension', fileExtension);
                }
            }
        });
    }
});
chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {
            const probName = sessionStorage.getItem('probName');
            const solutionText = sessionStorage.getItem('solutionText');
            const fileExtension = sessionStorage.getItem('fileExtension');
            if (window.location.href.includes('submissions')) {
                console.log('We did it')
                console.log(`${probName}${fileExtension}`)
                console.log(solutionText)
            }
        }
    })
});
