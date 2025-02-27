// Constants
const BASE_URL = 'https://api.github.com/repos'
const FILE_EXTENSIONS = {
  C: '.c',
  'C++': '.cpp',
  'C#': '.cs',
  Dart: '.dart',
  Elixir: '.ex',
  Erlang: '.erl',
  Go: '.go',
  Java: '.java',
  JavaScript: '.js',
  Kotlin: '.kt',
  PHP: '.php',
  Python: '.py',
  Python3: '.py',
  Racket: '.rkt',
  Ruby: '.rb',
  Rust: '.rs',
  Scala: '.scala',
  Swift: '.swift',
  TypeScript: '.ts',
  MySQL: '.sql',
  PostgreSQL: '.sql',
  Oracle: '.sql',
  'MS SQL Server': '.tsql',
  Pandas: '.py',
}

const LOCAL_STORAGE_KEYS = {
  C: 'c',
  'C++': 'cpp',
  'C#': 'csharp',
  Dart: 'dart',
  Elixir: 'elixir',
  Erlang: 'erlang',
  Go: 'golang',
  Java: 'java',
  JavaScript: 'javascript',
  Kotlin: 'kotlin',
  PHP: 'php',
  Python: 'python',
  Python3: 'python3',
  Racket: 'racket',
  Ruby: 'ruby',
  Rust: 'rust',
  Scala: 'scala',
  Swift: 'swift',
  TypeScript: 'typeScript',
  MySQL: 'mysql',
  Oracle: 'oraclesql',
  PostgreSQL: 'postgresql',
  'MS SQL Server': 'mssql',
  Pandas: 'pythondata',
}

const DATABASE_LANGUAGES = ['MySQL', 'Oracle', 'PostgreSQL', 'MS SQL Server', 'Pandas']

// DOM Selectors
const SELECTORS = {
  problemName: 'div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a',
  solutionLanguage:
    'div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary',
  accepted:
    'div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span',
  parentDiv:
    'div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)',
  parentDivCodeEditor:
    '#ide-top-btns > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div:last-child',
  codeBlock: 'div.px-4.py-3 > div > pre > code',
  performanceMetrics:
    'div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(2) > span.font-semibold',
}

// Main initialization
document.addEventListener('DOMContentLoaded', initLeetPush)

function initLeetPush() {
  // Only run on submission pages with accepted solutions
  if (isSubmissionPage() && hasAcceptedSolution()) {
    injectButtons()
    extractProblemInfo()
  }
}

// Helper functions
function isSubmissionPage() {
  return window.location.href.includes('submissions')
}

function hasAcceptedSolution() {
  return !!document.querySelector(SELECTORS.accepted)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Button injection
function injectButtons() {
  const parentDiv = document.querySelector(SELECTORS.parentDiv)
  const parentDivCodeEditor = document.querySelector(SELECTORS.parentDivCodeEditor)

  if (parentDiv) {
    injectButtonsToParent(
      parentDiv,
      'leetpush-div-edit',
      'leetpush-btn-edit',
      'Edit',
      'leetpush-div',
      'leetpush-btn',
      'Push',
    )
  }

  if (parentDivCodeEditor) {
    injectButtonsToParent(
      parentDivCodeEditor,
      'leetpush-div-edit-CodeEditor',
      'leetpush-btn-edit-CodeEditor',
      'Edit',
      'leetpush-div-CodeEditor',
      'leetpush-btn-CodeEditor',
      'Push',
    )
  }
}

function injectButtonsToParent(
  parent,
  editContainerId,
  editButtonId,
  editText,
  pushContainerId,
  pushButtonId,
  pushText,
) {
  // Don't inject if already present
  if (document.getElementById(editContainerId) || document.getElementById(pushContainerId)) {
    return
  }

  const editButton = createButton(editContainerId, editButtonId, editText, () => {
    localStorage.removeItem('branch')
    handlePushClick()
  })

  const pushButton = createButton(pushContainerId, pushButtonId, pushText, handlePushClick)

  parent.appendChild(editButton)
  parent.appendChild(pushButton)
}

function createButton(containerId, buttonId, text, clickHandler) {
  const container = document.createElement('div')
  container.id = containerId

  const button = document.createElement('button')
  button.id = buttonId
  button.textContent = text
  button.addEventListener('click', clickHandler)

  container.appendChild(button)
  return container
}

// Problem info extraction
async function extractProblemInfo() {
  try {
    const probNameElement = document.querySelector(SELECTORS.problemName)
    if (!probNameElement) return null

    const probNum = probNameElement.textContent?.split('.')[0] || ''
    const probName = probNameElement.textContent?.replace('.', '').replaceAll(' ', '-') || ''

    // Get solution language
    const langElement = document.querySelector(SELECTORS.solutionLanguage)
    if (!langElement) return null

    const solutionLangText = langElement.lastChild?.nodeValue || ''
    const fileExt = FILE_EXTENSIONS[solutionLangText] || '.txt'
    const fileName = `${probName}${fileExt}`

    // Get solution from localStorage or DOM
    const solutionsId = localStorage.key(0)?.split('_')[1] || ''
    let solution = localStorage.getItem(`${probNum}_${solutionsId}_${LOCAL_STORAGE_KEYS[solutionLangText]}`)

    if (!solution) {
      const codeElement = document.querySelector(SELECTORS.codeBlock)
      solution = codeElement?.textContent || ''
    } else {
      solution = solution.replace(/\\n/g, '\n').replace(/ {2}/g, '  ').replace(/"/g, '')
    }

    // Store in sessionStorage
    sessionStorage.setItem('fileName', fileName)
    sessionStorage.setItem('solution', solution)

    // Get performance metrics and create commit message
    let commitMsg = ''
    if (DATABASE_LANGUAGES.includes(solutionLangText)) {
      const metrics = document.querySelectorAll(SELECTORS.performanceMetrics)
      const queryRuntimeText = metrics[1]?.textContent || ''
      commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - LeetPush`
    } else {
      const metrics = document.querySelectorAll(SELECTORS.performanceMetrics)
      const runtimeText = metrics[1]?.textContent || ''
      const memoryText = metrics[3]?.textContent || ''
      commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - LeetPush`
    }

    sessionStorage.setItem('commitMsg', commitMsg)

    return {
      probNum,
      probName,
      fileName,
      solution,
      commitMsg,
      language: solutionLangText,
    }
  } catch (error) {
    console.error('Error extracting problem info:', error)
    return null
  }
}

// Modal creation and handling
function createConfigModal() {
  const modal = document.createElement('div')
  modal.id = 'lp-modal'
  modal.innerHTML = `
    <div id="lp-container">
      <div id="lp-close-btn"><button>X</button></div>
      <h3>Leet<span>Push</span></h3>
      <form id="lp-form">
        <div class="lp-div">
          <label>Repository URL:</label>
          <input type="text" id="repo-url" name="repo-url" required>
        </div>
        <div class="lp-div">
          <label>Token: <a href="https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig" target="_blank">Generate Token?</a></label>
          <input type="text" id="token" name="token" required>
        </div>
        <div class="lp-div">
          <label>Target directory push:</label>
          <input type="text" id="custom-dir" name="custom-dir" placeholder="Leave empty to push to the root.">
        </div>
        <div class="lp-daily-challenge">
          <label>Daily problems on a separate folder:</label>
          <div id="lp-radios">
            <div class="radio-div">
              <input type="radio" id="separate-folder-yes" name="daily-challenge" value="yes">
              <label for="separate-folder-yes">yes</label>
            </div>
            <div class="radio-div">
              <input type="radio" id="separate-folder-no" name="daily-challenge" value="no" checked>
              <label for="separate-folder-no">no</label>
            </div>
          </div>
        </div>
        <div>
          <label>Repository branch:</label>
          <div id="lp-radios">
            <div class="radio-div">
              <input type="radio" id="branch-master" name="branch-name" value="master" checked>
              <label for="branch-master">master</label>
            </div>
            <div class="radio-div">
              <input type="radio" id="branch-main" name="branch-name" value="main">
              <label for="branch-main">main</label>
            </div>
          </div>
        </div>
        <button id="lp-submit-btn" type="submit">Submit</button>
      </form>
    </div>
  `

  // Add event listeners
  modal.querySelector('#lp-close-btn button')?.addEventListener('click', () => {
    document.body.removeChild(modal)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.contains(modal)) {
      document.body.removeChild(modal)
    }
  })

  modal.querySelector('#lp-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    await saveConfig(modal)
  })

  return modal
}

async function saveConfig(modal) {
  const repoUrlInput = modal.querySelector('#repo-url')
  const tokenInput = modal.querySelector('#token')
  const branchInput = modal.querySelector('input[name="branch-name"]:checked')
  const separateFolderInput = modal.querySelector('input[name="daily-challenge"]:checked')
  const customDirInput = modal.querySelector('#custom-dir')

  if (!repoUrlInput || !tokenInput || !branchInput || !separateFolderInput) return

  const repoUrl = repoUrlInput.value.endsWith('.git') ? repoUrlInput.value.slice(0, -4) : repoUrlInput.value
  const token = tokenInput.value
  const branch = branchInput.value
  const separateFolder = separateFolderInput.value
  const customDir = customDirInput?.value || ''

  // Save to localStorage
  localStorage.setItem('repo', repoUrl)
  localStorage.setItem('token', token)
  localStorage.setItem('branch', branch)
  localStorage.setItem('separate-folder', separateFolder)
  localStorage.setItem('custom-dir', customDir)

  document.body.removeChild(modal)

  // Update README and description
  await updateRepoMetadata(token, repoUrl, branch)
}

function showConfigModal() {
  const modal = createConfigModal()

  // Pre-fill with existing values if available
  const token = localStorage.getItem('token')
  const repo = localStorage.getItem('repo')
  const branch = localStorage.getItem('branch')
  const separateFolder = localStorage.getItem('separate-folder')
  const customDir = localStorage.getItem('custom-dir')

  if (token) modal.querySelector('#token').value = token
  if (repo) modal.querySelector('#repo-url').value = repo
  if (branch) modal.querySelector(`#branch-${branch}`).checked = true
  if (separateFolder) modal.querySelector(`#separate-folder-${separateFolder}`).checked = true
  if (customDir) modal.querySelector('#custom-dir').value = customDir

  document.body.appendChild(modal)
}

// GitHub API interactions
async function handlePushClick() {
  const config = getGithubConfig()

  if (!isConfigComplete(config)) {
    showConfigModal()
    return
  }

  const pushBtn = getPushButton()
  if (!pushBtn) return

  const fileName = sessionStorage.getItem('fileName') || ''
  const solution = sessionStorage.getItem('solution') || ''
  const commitMsg = sessionStorage.getItem('commitMsg') || ''

  const [userName, repoName] = config.repo.split('/').slice(3, 5)

  const success = await pushToGithub(
    pushBtn,
    userName,
    repoName,
    config.branch,
    fileName,
    solution,
    commitMsg,
    config.token,
    config.separateFolder,
    config.customDir,
  )

  if (success) {
    pushBtn.textContent = 'Done'
    await sleep(2000)
    pushBtn.disabled = false
    pushBtn.textContent = 'Push'

    // Update statistics
    const solutionsPushed = Number.parseInt(localStorage.getItem('solutions-pushed') || '0') + 1
    localStorage.setItem('solutions-pushed', solutionsPushed.toString())

    // Check if it's a daily challenge
    const [, dailyProblemNum] = await getDailyChallenge()
    const problemInfo = await extractProblemInfo()

    if (problemInfo && dailyProblemNum === problemInfo.probNum) {
      const dailyChallenges = Number.parseInt(localStorage.getItem('daily-challenges') || '0') + 1
      localStorage.setItem('daily-challenges', dailyChallenges.toString())
    }
  }
}

function getGithubConfig() {
  return {
    token: localStorage.getItem('token') || '',
    repo: localStorage.getItem('repo') || '',
    branch: localStorage.getItem('branch') || '',
    separateFolder: localStorage.getItem('separate-folder') || '',
    customDir: localStorage.getItem('custom-dir') || '',
  }
}

function isConfigComplete(config) {
  return !!(config.token && config.repo && config.branch && config.separateFolder !== null)
}

function getPushButton() {
  return document.querySelector('#leetpush-btn') || document.querySelector('#leetpush-btn-CodeEditor')
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
  await sleep(1000)

  try {
    console.log('Push to GitHub started')
    console.log('User:', userName)
    console.log('Repo:', repoName)
    console.log('Branch:', branch)
    console.log('File name:', fileName)
    console.log('Separate folder:', separateFolder)
    console.log('Custom dir:', customDir)

    // Determine file path
    let filePath = fileName

    if (customDir) {
      filePath = `${customDir}/${fileName}`
    } else if (separateFolder === 'yes') {
      const [date, dailyProblemNum] = await getDailyChallenge()
      const problemInfo = await extractProblemInfo()

      if (problemInfo && dailyProblemNum === problemInfo.probNum) {
        const splitDate = date.split('-')
        const dailyFolder = `DCP-${splitDate[1]}-${splitDate[0].slice(2)}`
        filePath = `${dailyFolder}/${fileName}`
      }
    }

    console.log('Final file path:', filePath)

    // Push file to repo
    const pushResult = await pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token)
    if (pushResult) {
      console.log('File pushed successfully')
      pushBtn.textContent = 'Done'
      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.textContent = 'Push'
      return true
    } else {
      throw new Error('Failed to push file to repository')
    }
  } catch (error) {
    console.error('Error pushing to GitHub:', error)
    alert(`Error pushing to GitHub: ${error.message}`)
    pushBtn.textContent = 'Error'
    await sleep(2000)
    pushBtn.disabled = false
    pushBtn.textContent = 'Push'
    return false
  }
}

async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
  const apiUrl = `${BASE_URL}/${userName}/${repoName}/contents/${filePath}`
  console.log('API URL:', apiUrl)

  try {
    // Check if repo exists
    const repoCheckResponse = await fetch(`${BASE_URL}/${userName}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Repo check response:', repoCheckResponse)

    if (!repoCheckResponse.ok) {
      throw new Error(`Repository not found: ${userName}/${repoName}`)
    }

    // Check if file exists
    const fileExistsRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('File exists response:', fileExistsRes)

    const requestBody = {
      message: commitMsg,
      content: btoa(unescape(encodeURIComponent(content))), // Handle UTF-8 characters properly
      branch: branch,
    }
    console.log('Request body:', requestBody)

    if (fileExistsRes.ok) {
      const existingFileData = await fileExistsRes.json()
      requestBody.sha = existingFileData.sha
    }
    console.log('Request body with SHA:', requestBody)

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
    console.log('Response:', response)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error data:', errorData)
      throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`)
    }

    const responseData = await response.json()
    console.log('Response data:', responseData)

    return true
  } catch (error) {
    console.error('Error pushing file to repo:', error)
    alert(`Failed to push file: ${error.message}`)
    return false
  }
}

async function updateRepoMetadata(token, repo, branch) {
  const [userName, repoName] = repo.split('/').slice(3, 5)

  const description = 'This repository is managed by LeetPush extension: https://github.com/husamahmud/LeetPush'
  const readmeContent =
    '# LeetCode\n\nThis repository contains my solutions to LeetCode problems.\n\nCreated with :heart: by [LeetPush](https://github.com/husamahmud/LeetPush)\n\n ## Made by \n - Tut: [GitHub](https://github.com/TutTrue) - [LinkedIn](https://www.linkedin.com/in/mahmoud-hamdy-8b6825245/)\n - Hüsam: [GitHub](https://github.com/husamahmud) - [LinkedIn](https://www.linkedin.com/in/husamahmud/)\n\n Happy coding! 🚀'

  try {
    // Update README
    const readmeApiUrl = `${BASE_URL}/${userName}/${repoName}/contents/README.md`
    const encodedReadmeContent = btoa(unescape(encodeURIComponent(readmeContent)))

    const readmeExistsResponse = await fetch(`${readmeApiUrl}?ref=${branch}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (readmeExistsResponse.ok) {
      const existingReadme = await readmeExistsResponse.json()

      await fetch(readmeApiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: 'Update README file',
          content: encodedReadmeContent,
          sha: existingReadme.sha,
          branch: branch,
        }),
      })
    } else {
      await fetch(readmeApiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: 'Create README file',
          content: encodedReadmeContent,
          branch: branch,
        }),
      })
    }

    // Update repo description
    await fetch(`${BASE_URL}/${userName}/${repoName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    })
  } catch (error) {
    console.error('Error updating repo metadata:', error)
  }
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
  return [
    data.data.activeDailyCodingChallengeQuestion.date,
    data.data.activeDailyCodingChallengeQuestion.question.frontendQuestionId,
  ]
}

// Initialize on page load
initLeetPush()

// Re-initialize on DOM changes (for single-page apps)
const observer = new MutationObserver((mutations) => {
  if (isSubmissionPage() && hasAcceptedSolution()) {
    const hasButtons = document.getElementById('leetpush-btn') || document.getElementById('leetpush-btn-CodeEditor')
    if (!hasButtons) {
      initLeetPush()
    }
  }
})

observer.observe(document.body, { childList: true, subtree: true })

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showSettings') {
    showConfigModal()
  }
  sendResponse({ status: 'success' })
  return true
})
