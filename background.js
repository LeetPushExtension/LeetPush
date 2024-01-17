chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId}, func: () => {
                let probName, probNum, solutionText, fileEx, runtimeText,
                    memoryText, commitMsg;
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
                /** Extract data from session storage */
                probName = sessionStorage.getItem('probName');
                probNum = sessionStorage.getItem('probNum');
                solutionText = sessionStorage.getItem('solutionText');
                fileEx = sessionStorage.getItem('fileEx');
                runtimeText = sessionStorage.getItem('runtimeText');
                memoryText = sessionStorage.getItem('memoryText');
                commitMsg = `[${probNum}] [Runtime Beats ${runtimeText}] [Memory Beats ${memoryText}]` // TODO: bug

                /** Push button, lp -> leetpush */
                const lpDiv = document.createElement('div')
                const lpBtn = document.createElement('button')
                const lpDivStyle = document.createElement('style');
                lpDiv.id = 'leetpush-div'
                lpDiv.appendChild(lpBtn)
                lpBtn.textContent = 'Push'
                lpDivStyle.textContent = `
                    #leetpush-div {
                        padding-inline: 1rem;
                        padding-block: 1rem;
                        display: flex;
                        text-align: center;
                        height: 32px;
                        align-items: center;
                        background-color: #e7a41e;
                        color: #070706;
                        border-radius: 0.5rem;
                        margin-left: 0.5rem;
                        font-weight: 600;
                    }
                `
                document.head.appendChild(lpDivStyle)
                const existingLPDiv = document.querySelector('#leetpush-div') /* prevent appending the same element multiple times */
                if (window.location.href.includes('submissions') && !existingLPDiv) {
                    const btnParent = document.querySelector("#editor > div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)")
                    if (btnParent) btnParent.appendChild(lpDiv)
                    console.log('We did it')
                    console.log(`file name: ${probName}${fileEx}`)
                    console.log(`solution \n ${solutionText}`)
                    console.log(commitMsg)
                }
            }
        });
    }
});
