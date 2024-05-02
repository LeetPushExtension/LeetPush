chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async () => {
        let probNameElement, probName, probNum, solution, formattedSolution,
          fileEx, runtimeText, memoryText, queryRuntimeText, commitMsg,
          fileName, solutionsId;
        const fileExs = {
          'C': '.c',
          'C++': '.cpp',
          'C#': '.cs',
          'Dart': '.dart',
          'Elixir': '.ex',
          'Erlang': '.erl',
          'Go': '.go',
          'Java': '.java',
          'JavaScript': '.js',
          'Kotlin': '.kt',
          'PHP': '.php',
          'Python': '.py',
          'Python3': '.py',
          'Racket': '.rkt',
          'Ruby': '.rb',
          'Rust': '.rs',
          'Scala': '.scala',
          'Swift': '.swift',
          'TypeScript': '.ts',
          'MySQL': '.sql',
          'PostgreSQL': '.sql',
          'Oracle': '.sql',
          'MS SQL Server': '.tsql',
          'Pandas': '.py',
        };
        const localStorageExs = {
          'C': 'c',
          'C++': 'cpp',
          'C#': 'csharp',
          'Dart': 'dart',
          'Elixir': 'elixir',
          'Erlang': 'erlang',
          'Go': 'golang',
          'Java': 'java',
          'JavaScript': 'javascript',
          'Kotlin': 'kotlin',
          'PHP': 'php',
          'Python': 'python',
          'Python3': 'python3',
          'Racket': 'racket',
          'Ruby': 'ruby',
          'Rust': 'rust',
          'Scala': 'scala',
          'Swift': 'swift',
          'TypeScript': 'typeScript',
          'MySQL': 'mysql',
          'Oracle': 'oraclesql',
          'PostgreSQL': 'postgresql',
          'MS SQL Server': 'mssql',
          'Pandas': 'pythondata',
        };
        const dbs = ['MySQL', 'Oracle', 'PostgreSQL', 'MS SQL Server', 'Pandas'];

        /** Select problem name *************************************/
        probNameElement = document.querySelector(`div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a`);
        probNum = probNameElement.innerText.split('.')[0];
        probName = probNameElement.innerText
        .replace('.', '')
        .replaceAll(' ', '-');

        /** If the user submit an asnwer ****************************/
        if (window.location.href.includes('submissions')) {
          /** Select solution language ******************************/
          const solutionLangText = document.querySelector('div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary').lastChild.nodeValue;
          /** Search solution In localStorage ***********************/
          solutionsId = localStorage.key(0).split('_')[1];
          solution = localStorage.getItem(`${probNum}_${solutionsId}_${localStorageExs[solutionLangText]}`);
          await checkSolInLocalStorage(solution);
          /** Generate the file name ********************************/
          if (solutionLangText) fileEx = fileExs[solutionLangText];
          fileName = `${probName}${fileEx}`;
          await sessionStorage.setItem('fileName', fileName);
          /** Select the mem&runtime ********************************/
          let runtime, memory, queryRuntime;
          if (dbs.includes(solutionLangText)) {
            queryRuntime = document.querySelector('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold');
            if (queryRuntime) queryRuntimeText = queryRuntime.innerText;
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - LeetPush`;
            await sessionStorage.setItem('commitMsg', commitMsg);
          } else {
            [runtime, memory] = document.querySelectorAll('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold');
            if (runtime && memory) {
              runtimeText = runtime.innerText;
              memoryText = memory.innerText;
            }
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - LeetPush`;
            await sessionStorage.setItem('commitMsg', commitMsg);
          }
        }

        /** Select Buttons containter *******************************/
        const parentDiv = document.querySelector('div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)');
        /** Check if the solution is accepted or not ****************/
        const accepted = document.querySelector('div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.flex.w-full.items-center.justify-between.gap-4 > div.flex.flex-1.flex-col.items-start.gap-1.overflow-hidden > div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span');
        /** Check if the user in the submissions page ***************/
        const submissionsPage = window.location.href.includes('submissions');
        /** Create LeetPush Edit Button *****************************/
        const lpEditDiv = document.createElement('div');
        const lpEditBtn = document.createElement('button');
        const lpEditDivStyle = document.createElement('style');
        lpEditDiv.id = 'leetpush-div-edit';
        lpEditBtn.id = 'leetpush-btn-edit';
        lpEditBtn.textContent = 'Edit';
        lpEditBtn.addEventListener('click', () => {
          localStorage.removeItem('branch');
          pushOnClick();
        });
        lpEditDiv.appendChild(lpEditBtn);
        document.head.appendChild(lpEditDivStyle);
        /** Append the Edit button correctly to the page ************/
        const existingEditBtn = document.querySelector('#leetpush-div-edit');
        if (submissionsPage && !existingEditBtn && accepted) {
          if (parentDiv) parentDiv.appendChild(lpEditDiv);
        }
        /** Create LeetPush Push Button *****************************/
        const lpDiv = document.createElement('div');
        const lpBtn = document.createElement('button');
        const lpDivStyle = document.createElement('style');
        lpDiv.id = 'leetpush-div';
        lpBtn.id = 'leetpush-btn';
        lpBtn.textContent = 'Push';
        lpBtn.addEventListener('click', () => pushOnClick());
        lpDiv.appendChild(lpBtn);
        document.head.appendChild(lpDivStyle);
        /** Append the Push button correctly to the page ************/
        const existingPushBtn = document.querySelector('#leetpush-div');
        if (submissionsPage && !existingPushBtn && accepted) {
          if (parentDiv) parentDiv.appendChild(lpDiv);
        }
        /** Create LeetPush Modal ***********************************/
        const modalDiv = document.createElement('div');
        modalDiv.id = 'lp-modal';
        const containerDiv = document.createElement('div');
        containerDiv.id = 'lp-container';
        const colseBtnDiv = document.createElement('div');
        colseBtnDiv.id = 'lp-close-btn';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'ⓧ';
        colseBtnDiv.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => document.body.removeChild(modalDiv));
        const h3 = document.createElement('h3');
        h3.textContent = 'Leet';
        const span = document.createElement('span');
        span.textContent = 'Push';
        h3.appendChild(span);
        const form = document.createElement('form');
        form.id = 'lp-form';
        const repoNameDiv = document.createElement('div');
        repoNameDiv.className = 'lp-div';
        const repoNameLabel = document.createElement('label');
        repoNameLabel.textContent = 'Repository URL:';
        const repoNameInput = document.createElement('input');
        repoNameInput.type = 'text';
        repoNameInput.id = 'repo-url';
        repoNameInput.name = 'repo-url';
        repoNameInput.required = true;
        repoNameDiv.appendChild(repoNameLabel);
        repoNameDiv.appendChild(repoNameInput);
        const tokenDiv = document.createElement('div');
        tokenDiv.className = 'lp-div';
        const tokenLabel = document.createElement('label');
        const howToCreateToken = document.createElement('a');
        howToCreateToken.textContent = 'Generate Token?';
        howToCreateToken.href = 'https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig';
        howToCreateToken.setAttribute('target', '_blank');
        tokenLabel.textContent = 'Token:';
        tokenLabel.appendChild(howToCreateToken);
        tokenDiv.appendChild(tokenLabel);
        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.id = 'token';
        tokenInput.name = 'token';
        tokenInput.required = true;
        tokenDiv.appendChild(tokenLabel);
        tokenDiv.appendChild(tokenInput);
        const radioDivMaster = document.createElement('div');
        const radioDivMain = document.createElement('div');
        radioDivMaster.className = 'radio-div';
        radioDivMain.className = 'radio-div';
        const branchDiv = document.createElement('div');
        branchDiv.id = 'lp-radios';
        const masterRadio = document.createElement('input');
        masterRadio.type = 'radio';
        masterRadio.id = 'branch-master';
        masterRadio.name = 'branch-name';
        masterRadio.value = 'master';
        const masterLabel = document.createElement('label');
        masterLabel.textContent = 'master';
        const mainRadio = document.createElement('input');
        mainRadio.type = 'radio';
        mainRadio.id = 'branch-main';
        mainRadio.name = 'branch-name';
        mainRadio.value = 'main';
        const mainLabel = document.createElement('label');
        mainLabel.textContent = 'main';
        branchDiv.appendChild(radioDivMain);
        branchDiv.appendChild(radioDivMaster);
        radioDivMaster.appendChild(masterRadio);
        radioDivMaster.appendChild(masterLabel);
        radioDivMain.appendChild(mainRadio);
        radioDivMain.appendChild(mainLabel);
        const submitBtn = document.createElement('button');
        submitBtn.id = 'lp-submit-btn';
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Submit';
        form.appendChild(repoNameDiv);
        form.appendChild(tokenDiv);
        form.appendChild(branchDiv);
        form.appendChild(submitBtn);
        containerDiv.appendChild(colseBtnDiv);
        containerDiv.appendChild(h3);
        containerDiv.appendChild(form);
        modalDiv.appendChild(containerDiv);
        /** LeetPush Modal button Functionality *********************/
        submitBtn.addEventListener('click', async (event) => {
          event.preventDefault();
          const repoUrl = document.querySelector('#repo-url').value;
          const token = document.querySelector('#token').value;
          const branch = document.querySelector('input[name="branch-name"]:checked').value;
          localStorage.setItem('repo', repoUrl);
          localStorage.setItem('token', token);
          localStorage.setItem('branch', branch);
          document.body.removeChild(modalDiv);
          await changeReadmeAndDescription(token, repoUrl, branch);
        });

        async function pushOnClick() {
          const token = localStorage.getItem('token');
          const repo = localStorage.getItem('repo');
          const branch = localStorage.getItem('branch');
          if (!token || !repo || !branch) {
            document.body.appendChild(modalDiv);
            if (token) document.querySelector('#token').value = token;
            if (repo) document.querySelector('#repo-url').value = repo;
            if (branch) document.querySelector(`#branch-${branch}`).checked = true;
            return;
          }
          const [repoName, userName] = repo.split('/').slice(3, 5);
          const res = await pushToGithub(
            repoName,
            userName,
            branch,
            sessionStorage.getItem('fileName'),
            sessionStorage.getItem('solution'),
            sessionStorage.getItem('commitMsg'),
            token,
          );

          if (res) {
            lpBtn.textContent = 'Done';
            await sleep(2000);
            lpBtn.disabled = false;
            lpBtn.textContent = 'Push';
          }
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
          lpBtn.disabled = true;
          lpBtn.textContent = 'Loading...';
          await sleep(2000);

          const apiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}`;

          const repoExistsResponse = await fetch(`https://api.github.com/repos/${userName}/${repoName}`);
          if (!repoExistsResponse.ok) {
            alert('# LeetPush \nRepository not found, please check the repository URL');
            lpBtn.textContent = 'Failed';
            await sleep(2000);
            lpBtn.disabled = false;
            lpBtn.textContent = 'Push';
            return false;
          }

          const fileExistsResponse = await fetch(`
          https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!fileExistsResponse.ok && fileExistsResponse.status === 401) {
            alert('# LeetPush \nInvalid Token, please check the token');
            lpBtn.textContent = 'Failed';
            await sleep(2000);
            lpBtn.disabled = false;
            lpBtn.textContent = 'Push';
            return false;
          }

          if (fileExistsResponse.ok) {
            await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                sha: (await fileExistsResponse.json()).sha,
              }),
            });
          } else {
            await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                branch: branch,
              }),
            });
          }

          return true;
        }

        async function changeReadmeAndDescription(token, repo, branch) {
          const [userName, repoName] = repo.split('/').slice(3, 5);
          const description = 'This repository is managed by LeetPush extention: https://github.com/husamahmud/LeetPush';
          const readmeContent = '# LeetCode\n\nThis repository contains my solutions to LeetCode problems.\n\nCreated with :heart: by [LeetPush](https://github.com/husamahmud/LeetPush)\n\n ## Made by \n - Tut: [GitHub](https://github.com/TutTrue) - [LinkedIn](https://www.linkedin.com/in/mahmoud-hamdy-8b6825245/)\n - Hüsam: [GitHub](https://github.com/husamahmud) - [LinkedIn](https://www.linkedin.com/in/husamahmud/)\n\n Happy coding! 🚀';
          const readmeApiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/README.md`;
          const descriptionApiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
          const readmeExistsResponse = await fetch(
            `https://api.github.com/repos/${userName}/${repoName}/contents/README.md?ref=${branch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const descriptionResponse = await fetch(descriptionApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (readmeExistsResponse.ok) {
            const updateReadmeResponse = await fetch(readmeApiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: 'Update README.md',
                content: btoa(readmeContent),
                sha: (await readmeExistsResponse.json()).sha,
              }),
            });
          } else {
            const createReadmeResponse = await fetch(readmeApiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                message: 'Create README.md',
                content: btoa(readmeContent),
                branch: branch,
              }),
            });
          }

          const descriptionData = await descriptionResponse.json();
          const updateDescriptionResponse = await fetch(descriptionApiUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
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
            .replace(/\\n/g, '\n')
            .replace(/  /g, '  ')
            .replace(/"/g, '');
            await sessionStorage.setItem('solution', formattedSolution);
          } else {
            const code = document.querySelector('div.px-4.py-3 > div > pre > code').innerText;
            await sessionStorage.setItem('solution', code);
          }
        }

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      },
    });
  }
});
