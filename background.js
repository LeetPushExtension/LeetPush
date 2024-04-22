chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async () => {
        let probNameElement, probName, probNum, solution, formattedSolution,
          fileEx, runtimeText, memoryText, queryRuntimeText, commitMsg,
          fileName, solutionsId;
        const fileExs = {
          "C": ".c",
          "C++": ".cpp",
          "C#": ".cs",
          "Dart": ".dart",
          "Elixir": ".ex",
          "Erlang": ".erl",
          "Go": ".go",
          "Java": ".java",
          "JavaScript": ".js",
          "Kotlin": ".kt",
          "PHP": ".php",
          "Python": ".py",
          "Python3": ".py",
          "Racket": ".rkt",
          "Ruby": ".rb",
          "Rust": ".rs",
          "Scala": ".scala",
          "Swift": ".swift",
          "TypeScript": ".ts",
          "MySQL": ".sql",
          "PostgreSQL": ".sql",
          "Oracle": ".sql",
          "MS SQL Server": ".tsql",
          "Pandas": ".py",
        };
        const localStorageExs = {
          "C": "c",
          "C++": "cpp",
          "C#": "csharp",
          "Dart": "dart",
          "Elixir": "elixir",
          "Erlang": "erlang",
          "Go": "golang",
          "Java": "java",
          "JavaScript": "javascript",
          "Kotlin": "kotlin",
          "PHP": "php",
          "Python": "python",
          "Python3": "python3",
          "Racket": "racket",
          "Ruby": "ruby",
          "Rust": "rust",
          "Scala": "scala",
          "Swift": "swift",
          "TypeScript": "typeScript",
          "MySQL": "mysql",
          "Oracle": "oraclesql",
          "PostgreSQL": "postgresql",
          "MS SQL Server": "mssql",
          "Pandas": "pythondata",
        };
        const dbs = ["MySQL", "Oracle", "PostgreSQL", "MS SQL Server", "Pandas"];

        /** Select problem name *************************************/
        probNameElement = document.querySelector(`div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a`);
        probNum = probNameElement.innerText.split(".")[0];
        probName = probNameElement.innerText
        .replace(".", "")
        .replaceAll(" ", "-");

        /** If the user submit an asnwer ****************************/
        if (window.location.href.includes("submissions")) {
          /** Select solution language ******************************/
          const solutionLangText = document.querySelector("div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary").lastChild.nodeValue;
          /** Search solution In localStorage ***********************/
          solutionsId = localStorage.key(0).split("_")[1];
          solution = localStorage.getItem(`${probNum}_${solutionsId}_${localStorageExs[solutionLangText]}`);
          await checkSolInLocalStorage(solution);
          /** Generate the file name ********************************/
          if (solutionLangText) fileEx = fileExs[solutionLangText];
          fileName = `${probName}${fileEx}`;
          await sessionStorage.setItem("fileName", fileName);
          /** Select the mem&runtime ********************************/
          let runtime, memory, queryRuntime;
          if (dbs.includes(solutionLangText)) {
            queryRuntime = document.querySelector("div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold");
            if (queryRuntime) queryRuntimeText = queryRuntime.innerText;
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - LeetPush`;
            await sessionStorage.setItem("commitMsg", commitMsg);
          } else {
            [runtime, memory] = document.querySelectorAll("div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold");
            if (runtime && memory) {
              runtimeText = runtime.innerText;
              memoryText = memory.innerText;
            }
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - LeetPush`;
            await sessionStorage.setItem("commitMsg", commitMsg);
          }
        }

        /** Select Buttons containter *******************************/
        const parentDiv = document.querySelector("div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)");
        /** Check if the solution is accepted or not ****************/
        const accepted = document.querySelector("div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.flex.w-full.items-center.justify-between.gap-4 > div.flex.flex-1.flex-col.items-start.gap-1.overflow-hidden > div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span");
        /** Check if the user in the submissions page ***************/
        const submissionsPage = window.location.href.includes("submissions");
        /** Create LeetPush Push & Edit Buttons *****************************/
        const lpDiv = `<div id="leetpush-div-edit"><button id="leetpush-btn-edit">Edit</button></div><div id="leetpush-div-push"><button id="leetpush-btn">Push</button></div>`
        /** Append the Push & Edit Buttons correctly to the page ************/
        const existingBtns = document.getElementById("leetpush-div-edit");
        if (submissionsPage && !existingBtns && accepted) {
          if (parentDiv) {
            parentDiv.innerHTML += lpDiv;

            const editButton = document.getElementById("leetpush-div-edit");
            const pushButton = document.getElementById("leetpush-div-push");

            editButton.addEventListener("click", () => {
              localStorage.removeItem('branch');
              pushOnClick();
            });

            pushButton.addEventListener("click", () => pushOnClick());
          }
        }
        /** Create LeetPush Modal ***********************************/
        const modalDivContent = `
        <div id="lp-container">
          <div id="lp-close-btn">
            <button>ⓧ</button>
          </div>
          <h3>Leet<span>Push</span></h3>
          <form id="lp-form">
            <div class="lp-div">
              <label>Repository URL:</label>
              <input type="text" id="repo-url" name="repo-url" required="">
            </div>
            <div class="lp-div">
              <label>Token:<a href="https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig" target="_blank">Generate Token?</a></label>
              <input type="text" id="token" name="token" required="">
            </div>
            <div id="lp-radios">
              <div class="radio-div">
                <input type="radio" id="branch-main" name="branch-name" value="main">
                <label>main</label>
              </div>
              <div class="radio-div">
                <input type="radio" id="branch-master" name="branch-name" value="master">
                <label>master</label>
              </div>
            </div>
            <button id="lp-submit-btn" type="submit">Submit</button>
          </form>
        </div>`
        const modalDiv = document.createElement("div");
        modalDiv.id = "lp-modal";
        modalDiv.innerHTML = modalDivContent;

        function appendModal() {
          const modal = document.getElementById("lp-modal");
          if (!modal) {
            document.body.appendChild(modalDiv);
            
            const closebtn = document.getElementById("lp-close-btn")
            const submit = document.querySelector("#lp-submit-btn")
            
            closebtn.addEventListener("click", () => {
              const modalDiv = document.getElementById("lp-modal");
              document.body.removeChild(modalDiv);
              submit.removeEventListener("click", handleSubmit);
            }, { once: true });

            submit.addEventListener("click", handleSubmit);

            async function handleSubmit(e) {
                e.preventDefault();
                const repoUrl = document.querySelector("#repo-url").value;
                const token = document.querySelector("#token").value;
                const branch = document.querySelector("input[name=\"branch-name\"]:checked").value;
                localStorage.setItem("repo", repoUrl);
                localStorage.setItem("token", token);
                localStorage.setItem("branch", branch);
                submit.disabled = true;
                await changeReadmeAndDescription(token, repoUrl, branch);
                submit.disabled = false;
                closebtn.click();
              }
            }

        }

        async function pushOnClick() {
          const token = localStorage.getItem("token");
          const repo = localStorage.getItem("repo");
          const branch = localStorage.getItem("branch");
          if (!token || !repo || !branch) {
            appendModal();
            if (token) document.getElementById("token").value = token;
            if (repo) document.getElementById("repo-url").value = repo;
            if (branch) document.getElementById(`branch-${branch}`).checked = true;
            return;
          }
          const [repoName, userName] = repo.split("/").slice(3, 5);
          lpBtn.disabled = true;
          lpBtn.textContent = "Loading...";
          await pushToGithub(
            repoName,
            userName,
            branch,
            sessionStorage.getItem("fileName"),
            sessionStorage.getItem("solution"),
            sessionStorage.getItem("commitMsg"),
            token,
          );
          await sleep(2000);
          lpBtn.textContent = "Done";
          await sleep(2000);
          lpBtn.disabled = false;
          lpBtn.textContent = "Push";
        }

        async function pushToGithub(
          userName,
          repoName,
          branch,
          fileName,
          content,
          commitMsg,
          token,
        ) {
          const apiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}`;
          const fileExistsResponse = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (fileExistsResponse.ok) {
            const updateResponse = await fetch(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                sha: (await fileExistsResponse.json()).sha,
              }),
            });
          } else {
            const createResponse = await fetch(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                branch: branch,
              }),
            });
          }
        }

        async function changeReadmeAndDescription(token, repo, branch) {
          const [userName, repoName] = repo.split("/").slice(3, 5);
          const description = 'This repository is managed by LeetPush extention: https://github.com/husamahmud/LeetPush';
          const readmeContent = '# LeetCode\n\nThis repository contains my solutions to LeetCode problems.\n\nCreated with :heart: by [LeetPush](https://github.com/husamahmud/LeetPush)\n\nMade by [Mahmoud Hamdy](https://github.com/TutTrue) - [Husam](https://github.com/husamahmud)\n\n';
          const readmeApiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/README.md`;
          const descriptionApiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
          const readmeExistsResponse = await fetch(
            `https://api.github.com/repos/${userName}/${repoName}/contents/README.md?ref=${branch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const descriptionResponse = await fetch(descriptionApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (readmeExistsResponse.ok) {
            const updateReadmeResponse = await fetch(readmeApiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: "Update README.md",
                content: btoa(readmeContent),
                sha: (await readmeExistsResponse.json()).sha,
              }),
            });
          } else {
            const createReadmeResponse = await fetch(readmeApiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: "Create README.md",
                content: btoa(readmeContent),
                branch: branch,
              }),
            });
          }

          const descriptionData = await descriptionResponse.json();
          const updateDescriptionResponse = await fetch(descriptionApiUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              description: description,
            }),
          });
        }

        async function checkSolInLocalStorage(sol) {
          if (sol) {
            formattedSolution = sol
            .replace(/\\n/g, "\n")
            .replace(/  /g, "  ")
            .replace(/"/g, "");
            await sessionStorage.setItem("solution", formattedSolution);
          } else {
            const code = document.querySelector("div.px-4.py-3 > div > pre > code").innerText;
            await sessionStorage.setItem("solution", code);
          }
        }

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      },
    });
  }
});
