chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId}, func: () => {
                let probName, solutionText, fileEx, runtimeText, memoryText;
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
                /** Runtime & Memory */
                const [runtime, memory] = document.querySelectorAll('span.font-semibold.text-sd-green-500');
                if (runtime && memory) {
                    runtimeText = runtime.innerText;
                    memoryText = memory.innerText;
                    sessionStorage.setItem('runtimeText', runtimeText);
                    sessionStorage.setItem('memoryText', memoryText);
                }
                /** File Extension */
                const solutionLanguageText = document.querySelector("div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.bg-fill-quaternary.dark\\:bg-fill-quaternary.relative.w-full.overflow-hidden.rounded-lg > div > div.text-caption.px-4.py-2.font-medium.text-text-primary.dark\\:text-text-primary")
                const fileExs = {
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
                    fileEx = fileExs[solutionLanguageText.innerText]
                    sessionStorage.setItem('fileEx', fileEx);
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
            const fileEx = sessionStorage.getItem('fileEx');
            const runtimeText = sessionStorage.getItem('runtimeText')
            const memoryText = sessionStorage.getItem('memoryText')

            if (window.location.href.includes('submissions')) {
                console.log('We did it')
                console.log(`file name: ${probName}${fileEx}`)
                console.log(`solution \n ${solutionText}`)
                console.log(`runtime: ${runtimeText}`)
                console.log(`memory: ${memoryText}`)
            }
        }
    })
});
