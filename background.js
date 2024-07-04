chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async () => {
        let probNameElement, probName, probNum, solution, formattedSolution,
          fileEx, runtimeText, memoryText, queryRuntimeText, commitMsg,
          fileName, solutionsId, repoUrlInput
        const BASE_URL = `https://api.github.com/repos`
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
        }
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
        }
        const dbs = ['MySQL', 'Oracle', 'PostgreSQL', 'MS SQL Server', 'Pandas']
        /** Select problem name *************************************/
        probNameElement = document.querySelector(`div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a`)
        probNum = probNameElement.innerText.split('.')[0]
        probName = probNameElement.innerText
          .replace('.', '')
          .replaceAll(' ', '-')
        /** If the user submit an asnwer ****************************/
        if (window.location.href.includes('submissions')) {
          /** Select solution language ******************************/
          const solutionLangText = document.querySelector('div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary').lastChild.nodeValue
          /** Search solution In localStorage ***********************/
          solutionsId = localStorage.key(0).split('_')[1]
          solution = localStorage.getItem(`${probNum}_${solutionsId}_${localStorageExs[solutionLangText]}`)
          await checkSolInLocalStorage(solution)
          /** Generate the file name ********************************/
          if (solutionLangText) fileEx = fileExs[solutionLangText]
          fileName = `${probName}${fileEx}`
          await sessionStorage.setItem('fileName', fileName)
          /** Select the mem&runtime ********************************/
          let runtime, memory, queryRuntime
          if (dbs.includes(solutionLangText)) {
            queryRuntime = document.querySelectorAll('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(2) > span.font-semibold')[1]
            if (queryRuntime) queryRuntimeText = queryRuntime.innerText
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - LeetPush`
            await sessionStorage.setItem('commitMsg', commitMsg)
          } else {
            [timeMS, runtime, memoryMB, memory] = document.querySelectorAll('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(2) > span.font-semibold')
            if (runtime && memory) {
              runtimeText = runtime.innerText
              memoryText = memory.innerText
            }
            /** Generate a commit message *****************************/
            commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - LeetPush`
            await sessionStorage.setItem('commitMsg', commitMsg)
          }
        }

        /**
         * Helper function to create and append buttons
         **/
        function createButtonWithContainer(containerId, buttonId, buttonText, onClickFunction) {
          const buttonDiv = document.createElement('div')
          const button = document.createElement('button')
          const buttonStyle = document.createElement('style')
          buttonDiv.id = containerId
          button.id = buttonId
          button.textContent = buttonText
          button.addEventListener('click', onClickFunction)
          buttonDiv.appendChild(button)
          document.head.appendChild(buttonStyle)
          return buttonDiv
        }

        /** Check shared conditions */
        const submissionsPage = window.location.href.includes('submissions')
        const accepted = document.querySelector('div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span')
        /** Get different parent divs for each layout */
        const parentDiv = document.querySelector('div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)')
        const parentDivCodeEditor = document.querySelector('#ide-top-btns > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div:last-child')

        /** Function to append buttons if conditions are met */
        function appendButtonsIfApplicable(parentDiv, buttonDivEdit, buttonDivPush) {
          if (submissionsPage && accepted && parentDiv) {
            if (!document.querySelector(`#${buttonDivEdit.id}`)) {
              parentDiv.appendChild(buttonDivEdit)
            }
            if (!document.querySelector(`#${buttonDivPush.id}`)) {
              parentDiv.appendChild(buttonDivPush)
            }
          }
        }

        /** Creating buttons for the first layout */
        const buttonDivEditToolBar = createButtonWithContainer('leetpush-div-edit', 'leetpush-btn-edit', 'Edit', () => {
          localStorage.removeItem('branch')
          pushOnClick()
        })
        const buttonDivPushToolBar = createButtonWithContainer('leetpush-div', 'leetpush-btn', 'Push', pushOnClick)
        /** Creating buttons for the CodeEditor layout */
        const buttonDivEditCodeEditor = createButtonWithContainer('leetpush-div-edit-CodeEditor', 'leetpush-btn-edit-CodeEditor', 'Edit', () => {
          localStorage.removeItem('branch')
          pushOnClick()
        })
        const buttonDivPushCodeEditor = createButtonWithContainer('leetpush-div-CodeEditor', 'leetpush-btn-CodeEditor', 'Push', pushOnClick)
        /** Append buttons to respective layouts */
        appendButtonsIfApplicable(parentDiv, buttonDivEditToolBar, buttonDivPushToolBar)
        appendButtonsIfApplicable(parentDivCodeEditor, buttonDivEditCodeEditor, buttonDivPushCodeEditor)

        /*************************************************************/
        const createRadioOption = (id, value, name, labelText) => {
          const radioDiv = document.createElement('div')
          radioDiv.className = 'radio-div'
          const radio = document.createElement('input')
          radio.type = 'radio'
          radio.id = id
          radio.name = name
          radio.value = value
          const label = document.createElement('label')
          label.textContent = labelText
          label.setAttribute('for', id)
          radioDiv.appendChild(radio)
          radioDiv.appendChild(label)
          return radioDiv
        }
        /** Create LeetPush Modal ***********************************/
        const modalDiv = document.createElement('div')
        modalDiv.id = 'lp-modal'
        const containerDiv = document.createElement('div')
        containerDiv.id = 'lp-container'
        const colseBtnDiv = document.createElement('div')
        colseBtnDiv.id = 'lp-close-btn'
        const closeBtn = document.createElement('button')
        closeBtn.textContent = 'X'
        colseBtnDiv.appendChild(closeBtn)
        closeBtn.addEventListener('click', () => document.body.removeChild(modalDiv))
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') document.body.removeChild(modalDiv)
        })
        const h3 = document.createElement('h3')
        h3.textContent = 'Leet'
        const span = document.createElement('span')
        span.textContent = 'Push'
        h3.appendChild(span)

        const form = document.createElement('form')
        form.id = 'lp-form'

        const repoNameDiv = document.createElement('div')
        repoNameDiv.className = 'lp-div'
        const repoNameLabel = document.createElement('label')
        repoNameLabel.textContent = 'Repository URL:'
        const repoNameInput = document.createElement('input')
        repoNameInput.type = 'text'
        repoNameInput.id = 'repo-url'
        repoNameInput.name = 'repo-url'
        repoNameInput.required = true
        repoNameDiv.appendChild(repoNameLabel)
        repoNameDiv.appendChild(repoNameInput)

        const tokenDiv = document.createElement('div')
        tokenDiv.className = 'lp-div'
        const tokenLabel = document.createElement('label')
        const howToCreateToken = document.createElement('a')
        howToCreateToken.textContent = 'Generate Token?'
        howToCreateToken.href = 'https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig'
        howToCreateToken.setAttribute('target', '_blank')
        tokenLabel.textContent = 'Token:'
        tokenLabel.appendChild(howToCreateToken)
        tokenDiv.appendChild(tokenLabel)
        const tokenInput = document.createElement('input')
        tokenInput.type = 'text'
        tokenInput.id = 'token'
        tokenInput.name = 'token'
        tokenInput.required = true
        tokenDiv.appendChild(tokenLabel)
        tokenDiv.appendChild(tokenInput)
        const radioDivMaster = document.createElement('div')
        const radioDivMain = document.createElement('div')
        radioDivMaster.className = 'radio-div'
        radioDivMain.className = 'radio-div'

        const dailyChallengeDiv = document.createElement('div')
        dailyChallengeDiv.className = 'lp-daily-challenge'
        const pushDailyProblemsLabel = document.createElement('label')
        pushDailyProblemsLabel.textContent = 'Daily problems on a separate folder:'
        dailyChallengeDiv.appendChild(pushDailyProblemsLabel)
        const dailyChallengeRadios = document.createElement('div')
        dailyChallengeRadios.id = 'lp-radios'
        const yesRadioDiv = createRadioOption('separate-folder-yes', 'yes', 'daily-challenge', 'yes')
        const noRadioDiv = createRadioOption('separate-folder-no', 'no', 'daily-challenge', 'no')
        dailyChallengeRadios.appendChild(yesRadioDiv)
        dailyChallengeRadios.appendChild(noRadioDiv)
        dailyChallengeDiv.appendChild(dailyChallengeRadios)

        const customDirDiv = document.createElement('div')
        customDirDiv.className = 'lp-div'
        const customDirLabel = document.createElement('label')
        customDirLabel.textContent = 'Target directory push:'
        const customDirInput = document.createElement('input')
        customDirInput.type = 'text'
        customDirInput.id = 'custom-dir'
        customDirInput.name = 'custom-dir'
        customDirInput.placeholder = 'Leave empty to push to the root.'
        customDirDiv.appendChild(customDirLabel)
        customDirDiv.appendChild(customDirInput)

        const branchDiv = document.createElement('div')
        const branchLabel = document.createElement('label')
        branchLabel.textContent = 'Repository branch:'
        const branchsDiv = document.createElement('div')
        branchsDiv.id = 'lp-radios'
        const masterRadioDiv = createRadioOption('branch-master', 'master', 'branch-name', 'master')
        const mainRadioDiv = createRadioOption('branch-main', 'main', 'branch-name', 'main')
        branchsDiv.appendChild(masterRadioDiv)
        branchsDiv.appendChild(mainRadioDiv)
        branchDiv.appendChild(branchLabel)
        branchDiv.appendChild(branchsDiv)

        const submitBtn = document.createElement('button')
        submitBtn.id = 'lp-submit-btn'
        submitBtn.type = 'submit'
        submitBtn.textContent = 'Submit'

        form.appendChild(repoNameDiv)
        form.appendChild(tokenDiv)
        form.appendChild(customDirDiv)
        form.appendChild(dailyChallengeDiv)
        form.appendChild(branchDiv)
        form.appendChild(submitBtn)
        containerDiv.appendChild(colseBtnDiv)
        containerDiv.appendChild(h3)
        containerDiv.appendChild(form)
        modalDiv.appendChild(containerDiv)
        /** LeetPush Modal button Functionality *********************/
        submitBtn.addEventListener('click', async (event) => {
          event.preventDefault()
          repoUrlInput = document.querySelector('#repo-url').value
          const repoUrl = repoUrlInput.endsWith('.git') ? repoUrlInput.slice(0, -4) : repoUrlInput
          const token = document.querySelector('#token').value
          const branch = document.querySelector('input[name="branch-name"]:checked').value
          const separateFolder = document.querySelector('input[name="daily-challenge"]:checked').value
          const customDir = document.querySelector('#custom-dir').value

          localStorage.setItem('repo', repoUrl)
          localStorage.setItem('token', token)
          localStorage.setItem('branch', branch)
          localStorage.setItem('separate-folder', separateFolder)
          localStorage.setItem('custom-dir', customDir)
          document.body.removeChild(modalDiv)
          await changeReadmeAndDescription(token, repoUrl, branch)
        })

        let pushBtn = null
        if (document.querySelector('#leetpush-btn')) {
          pushBtn = document.querySelector('#leetpush-btn')
        } else if (document.querySelector('#leetpush-btn-CodeEditor')) {
          pushBtn = document.querySelector('#leetpush-btn-CodeEditor')
        }

        async function pushOnClick() {
          const token = localStorage.getItem('token')
          const repo = localStorage.getItem('repo')
          const branch = localStorage.getItem('branch')
          const separateFolder = localStorage.getItem('separate-folder')
          const customDir = localStorage.getItem('custom-dir')
          if (!token || !repo || !branch || !separateFolder) {
            document.body.appendChild(modalDiv)
            if (token) document.querySelector('#token').value = token
            if (repo) document.querySelector('#repo-url').value = repo
            if (branch) document.querySelector(`input[name="branch-name"]:checked`).checked = true
            if (separateFolder) document.querySelector(`input[name="daily-challenge"]:checked`).checked = true
            if (customDirDiv) document.querySelector('#custom-dir').value = customDir
            return
          }
          const [repoName, userName] = repo.split('/').slice(3, 5)
          const res = await pushToGithub(
            pushBtn,
            repoName,
            userName,
            branch,
            sessionStorage.getItem('fileName'),
            sessionStorage.getItem('solution'),
            sessionStorage.getItem('commitMsg'),
            token,
            separateFolder,
            customDir,
          )

          if (res) {
            pushBtn.textContent = 'Done'
            await sleep(2000)
            pushBtn.disabled = false
            pushBtn.textContent = 'Push'
          }
        }

        async function pushToGithub(
          pushBtn,
          userName,
          repoName,
          branch,
          fileName,
          content,
          commitMsg,
          token,
          separateFolder,
          customDir,
        ) {
          pushBtn.disabled = true
          pushBtn.textContent = 'Loading...'
          await sleep(2000)

          const apiUrl = `${BASE_URL}/${userName}/${repoName}/contents/${fileName}`

          const repoExistsResponse = await fetch(`${BASE_URL}/${userName}/${repoName}`)
          if (!repoExistsResponse.ok) {
            alert('# LeetPush \nRepository not found, please check the repository URL')
            pushBtn.textContent = 'Failed'
            await sleep(2000)
            pushBtn.disabled = false
            pushBtn.textContent = 'Push'
            return false
          }

          const fileExistsResponse = await fetch(`${BASE_URL}/${userName}/${repoName}/contents/${fileName}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!fileExistsResponse.ok && fileExistsResponse.status === 401) {
            alert('# LeetPush \nInvalid Token, please check the token')
            pushBtn.textContent = 'Failed'
            await sleep(2000)
            pushBtn.disabled = false
            pushBtn.textContent = 'Push'
            return false
          }

          if (customDir) {
            return await pushFileToRepo(userName, repoName, `${customDir}/${fileName}`, branch, content, commitMsg, token)
          }

          const [date, dailyProblemNum] = await getDailyChallenge()
          if (separateFolder === 'yes' && dailyProblemNum === probNum) {
            const splitDate = date.split('-')
            const dailyFolder = `DCP-${splitDate[1]}-${splitDate[0].slice(2)}`
            return await pushFileToRepo(userName, repoName, `${dailyFolder}/${fileName}`, branch, content, commitMsg, token)
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
            })
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
            })
          }

          return true
        }

        async function changeReadmeAndDescription(token, repo, branch) {
          const [userName, repoName] = repo.split('/').slice(3, 5)
          const description = 'This repository is managed by LeetPush extension: https://github.com/husamahmud/LeetPush'
          const readmeContent = '# LeetCode\n\nThis repository contains my solutions to LeetCode problems.\n\nCreated with :heart: by [LeetPush](https://github.com/husamahmud/LeetPush)\n\n ## Made by \n - Tut: [GitHub](https://github.com/TutTrue) - [LinkedIn](https://www.linkedin.com/in/mahmoud-hamdy-8b6825245/)\n - Hüsam: [GitHub](https://github.com/husamahmud) - [LinkedIn](https://www.linkedin.com/in/husamahmud/)\n\n Happy coding! 🚀'
          const readmeApiUrl = `${BASE_URL}/${userName}/${repoName}/contents/README.md`
          const encodedReadmeContent = btoa(unescape(encodeURIComponent(readmeContent)))

          const readmeExistsResponse = await fetch(`${readmeApiUrl}?ref=${branch}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const sha = (await readmeExistsResponse.json()).sha
          await fetch(readmeApiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message: 'Update README file',
              content: encodedReadmeContent,
              sha: sha,
            }),
          })

          await fetch(`${BASE_URL}/${userName}/${repoName}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ description }),
          })
        }

        async function checkSolInLocalStorage(sol) {
          if (sol) {
            formattedSolution = sol
              .replace(/\\n/g, '\n')
              .replace(/  /g, '  ')
              .replace(/"/g, '')
            await sessionStorage.setItem('solution', formattedSolution)
          } else {
            const code = document.querySelector('div.px-4.py-3 > div > pre > code').innerText
            await sessionStorage.setItem('solution', code)
          }
        }

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms))
        }

        async function getDailyChallenge() {
          const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `{
                activeDailyCodingChallengeQuestion {
                  date
                  question {
                    frontendQuestionId: questionFrontendId
                  }
                }
              }`,
            }),
          })
          const data = await response.json()
          return [data.data.activeDailyCodingChallengeQuestion['date'], data.data.activeDailyCodingChallengeQuestion['question']['frontendQuestionId']]
        }

        async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
          const apiUrl = `${BASE_URL}/${userName}/${repoName}/contents/${filePath}`
          const fileExistsRes = await fetch(`${apiUrl}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const requestBody = {
            message: commitMsg,
            content: btoa(content),
          }

          if (fileExistsRes.ok) {
            const existingFileData = await fileExistsRes.json()
            requestBody.sha = existingFileData.sha
          } else {
            requestBody.branch = branch
          }

          const res = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          })

          return res.ok
        }
      },
    })
  }
})
