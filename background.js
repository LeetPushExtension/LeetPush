chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId}, func: () => {
                let probName, probNum, solutionText, fileEx, runtimeText,
                    memoryText;

                /** Problem Name */
                const problemNameElement = document.querySelector("div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a");
                if (problemNameElement) {
                    probNum = problemNameElement.innerText.split('.')[0];
                    probName = problemNameElement.innerText.replace(".", "").replaceAll(" ", "-");
                    sessionStorage.setItem('probName', probName);
                    sessionStorage.setItem('probNum', probNum);
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId}, func: () => {
                /** Extract data from session storage */
                const probName = sessionStorage.getItem('probName');
                const probNum = sessionStorage.getItem('probNum');
                const solutionText = sessionStorage.getItem('solutionText');
                const fileEx = sessionStorage.getItem('fileEx');
                const runtimeText = sessionStorage.getItem('runtimeText');
                const memoryText = sessionStorage.getItem('memoryText');
                const commitMsg = `[${probNum}] [Runtime Beats ${runtimeText}] [Memory Beats ${memoryText}]`

                /** Push button, lp -> leetpush */
                const lpDiv = document.createElement('div')
                const lpBtn = document.createElement('button')
                const lpDivStyle = document.createElement('style');
                lpDiv.id = 'leetpush-div'
                lpBtn.id = 'leetpush-btn'
                lpBtn.textContent = 'Push'
                lpDiv.appendChild(lpBtn)

                /** Prevent appending the btn multiple times */
                const existingLPDiv = document.querySelector('#leetpush-div');
                /** Append the btn only on the accepted submission */
                const accepted = document.querySelector("div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.flex.w-full.items-center.justify-between.gap-4 > div.flex.flex-1.flex-col.items-start.gap-1.overflow-hidden > div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span")

                document.head.appendChild(lpDivStyle);
                if (window.location.href.includes('submissions') && !existingLPDiv && accepted) {
                    const btnParent = document.querySelector("#editor > div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)")
                    if (btnParent) btnParent.appendChild(lpDiv)
                    console.log(`file name: ${probName}${fileEx}`)
                    console.log(`solution \n ${solutionText}`)
                    console.log(commitMsg)
                }
            }
        })
    }
})
