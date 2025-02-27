(function() {
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

  // Platform detection
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  // Default keyboard shortcuts based on platform
  const DEFAULT_SHORTCUT = isMac ? { key: 'p', modifier: 'meta' } : {
    key: 'p',
    modifier: 'ctrl',
  }

  // Shortcut display text
  const getShortcutDisplayText = (shortcut) => {
    const modifierSymbol = shortcut.modifier === 'meta' ? '⌘' :
      shortcut.modifier === 'alt' ? '⌥' :
        shortcut.modifier === 'shift' ? '⇧' :
          shortcut.modifier === 'ctrl' ? 'Ctrl+' : ''
    return `${modifierSymbol}${shortcut.key.toUpperCase()}`
  }

  // Get keyboard shortcut from localStorage or use default
  const getKeyboardShortcut = () => {
    const savedShortcut = localStorage.getItem('keyboard-shortcut')
    if (savedShortcut) {
      try {
        return JSON.parse(savedShortcut)
      } catch (e) {
        console.error('Error parsing saved shortcut:', e)
        return DEFAULT_SHORTCUT
      }
    }
    return DEFAULT_SHORTCUT
  }

  let KEYBOARD_SHORTCUT = getKeyboardShortcut()
  let SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT)

  // DOM Selectors
  const SELECTORS = {
    problemName: 'div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a',
    solutionLanguage:
      'div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.justify-between.pb-2 > div',
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
      registerKeyboardShortcut()
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

// Register keyboard shortcut
  function registerKeyboardShortcut() {
    document.addEventListener('keydown', (event) => {
      // Check if the shortcut matches the configured one
      if ((KEYBOARD_SHORTCUT.modifier === 'meta' && event.metaKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'alt' && event.altKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'shift' && event.shiftKey) ||
        (KEYBOARD_SHORTCUT.modifier === 'ctrl' && event.ctrlKey)) {
        if (event.key.toLowerCase() === KEYBOARD_SHORTCUT.key.toLowerCase()) {
          event.preventDefault()
          handlePushClick()
        }
      }
    })
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
        `Push (${SHORTCUT_DISPLAY})`,
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
        `Push (${SHORTCUT_DISPLAY})`,
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
      if (!probNameElement) {
        console.error('Problem name element not found')
        return null
      }

      const probNameText = probNameElement.textContent?.trim() || ''
      if (!probNameText) {
        console.error('Problem name is empty')
        return null
      }

      const probNum = probNameText.split('.')[0]?.trim() || ''
      const probName = probNameText.replace(/^\d+\./, '').trim().replaceAll(' ', '-') || ''

      if (!probNum || !probName) {
        console.error('Invalid problem number or name:', { probNum, probName })
        return null
      }

      // Get solution language
      const langElement = document.querySelector(SELECTORS.solutionLanguage).childNodes[2]
      if (!langElement) {
        console.error('Language element not found')
        return null
      }

      const solutionLangText = langElement.textContent?.trim() || ''
      if (!solutionLangText || !FILE_EXTENSIONS[solutionLangText]) {
        console.error('Invalid solution language:', solutionLangText)
        return null
      }

      const fileExt = FILE_EXTENSIONS[solutionLangText]
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

      if (!solution) {
        console.error('Solution not found')
        return null
      }

      // Store in sessionStorage with proper values
      sessionStorage.setItem('fileName', fileName)
      sessionStorage.setItem('solution', solution)

      // Get performance metrics and create commit message
      let commitMsg = ''
      if (DATABASE_LANGUAGES.includes(solutionLangText)) {
        const metrics = document.querySelectorAll(SELECTORS.performanceMetrics)
        const queryRuntimeText = metrics[1]?.textContent || 'N/A'
        commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - LeetPush`
      } else {
        const metrics = document.querySelectorAll(SELECTORS.performanceMetrics)
        const runtimeText = metrics[1]?.textContent || 'N/A'
        const memoryText = metrics[3]?.textContent || 'N/A'
        commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - LeetPush`
      }

      sessionStorage.setItem('commitMsg', commitMsg)

      // Log successful extraction
      console.log('Problem info extracted successfully:', {
        probNum,
        probName,
        fileName,
        solution: solution.substring(0, 50) + '...',
        commitMsg,
        language: solutionLangText,
      })

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
        <div class="lp-keyboard-shortcut">
          <label>Keyboard shortcut:</label>
          <div class="shortcut-config">
            <select id="shortcut-modifier">
              <option value="meta">${isMac ? '⌘ Command' : '⊞ Windows'}</option>
              <option value="ctrl">Ctrl</option>
              <option value="alt">${isMac ? '⌥ Option' : 'Alt'}</option>
              <option value="shift">⇧ Shift</option>
            </select>
            <span>+</span>
            <input type="text" id="shortcut-key" maxlength="1" placeholder="Key">
          </div>
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
    <style>
      .shortcut-config {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #shortcut-key {
        width: 40px;
        text-align: center;
        text-transform: uppercase;
      }
      #shortcut-modifier {
        min-width: 120px;
      }
    </style>
  `

    // Add event listeners
    modal.querySelector('#lp-close-btn button')?.addEventListener('click', () => {
      document.body.removeChild(modal)
    })

    // Close modal when clicking outside the modal container
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal)
      }
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
    const shortcutModifierInput = modal.querySelector('#shortcut-modifier')
    const shortcutKeyInput = modal.querySelector('#shortcut-key')

    if (!repoUrlInput || !tokenInput || !branchInput || !separateFolderInput) return

    const repoUrl = repoUrlInput.value.endsWith('.git') ? repoUrlInput.value.slice(0, -4) : repoUrlInput.value
    const token = tokenInput.value
    const branch = branchInput.value
    const separateFolder = separateFolderInput.value
    const customDir = customDirInput?.value || ''

    // Save shortcut if provided
    if (shortcutModifierInput && shortcutKeyInput && shortcutKeyInput.value) {
      const shortcutKey = shortcutKeyInput.value.toLowerCase()
      const shortcutModifier = shortcutModifierInput.value

      KEYBOARD_SHORTCUT = { key: shortcutKey, modifier: shortcutModifier }
      SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT)

      localStorage.setItem('keyboard-shortcut', JSON.stringify(KEYBOARD_SHORTCUT))

      // Update button labels with new shortcut
      updateButtonLabels()
    }

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

  function updateButtonLabels() {
    const buttons = [
      document.querySelector('#leetpush-btn'),
      document.querySelector('#leetpush-btn-CodeEditor'),
    ]

    buttons.forEach(button => {
      if (button) {
        button.textContent = `Push (${SHORTCUT_DISPLAY})`
      }
    })
  }

  function showConfigModal() {
    const modal = createConfigModal()

    // Pre-fill with existing values if available
    const token = localStorage.getItem('token')
    const repo = localStorage.getItem('repo')
    const branch = localStorage.getItem('branch')
    const separateFolder = localStorage.getItem('separate-folder')
    const customDir = localStorage.getItem('custom-dir')

    // Pre-fill shortcut values
    const shortcutModifierInput = modal.querySelector('#shortcut-modifier')
    const shortcutKeyInput = modal.querySelector('#shortcut-key')

    if (shortcutModifierInput) {
      shortcutModifierInput.value = KEYBOARD_SHORTCUT.modifier
    }

    if (shortcutKeyInput) {
      shortcutKeyInput.value = KEYBOARD_SHORTCUT.key.toUpperCase()
    }

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
    if (!pushBtn) {
      console.error('Push button not found')
      return
    }

    // Force a refresh of problem info
    const problemInfo = await extractProblemInfo()
    if (!problemInfo) {
      console.error('Failed to extract problem info')
      alert('Failed to extract problem information. Please try again.')
      return
    }

    const fileName = problemInfo.fileName
    const solution = problemInfo.solution
    const commitMsg = problemInfo.commitMsg

    if (!fileName || !solution || !commitMsg) {
      console.error('Missing required data:', {
        fileName,
        hasSolution: !!solution,
        hasCommitMsg: !!commitMsg,
      })
      alert('Missing required data. Please try again.')
      return
    }

    const [userName, repoName] = config.repo.split('/').slice(3, 5)
    if (!userName || !repoName) {
      console.error('Invalid repository URL:', config.repo)
      alert('Invalid repository URL. Please check your settings.')
      return
    }

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
      pushBtn.textContent = 'Done ✅'
      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`

      // Update statistics
      const solutionsPushed = Number.parseInt(localStorage.getItem('solutions-pushed') || '0') + 1
      localStorage.setItem('solutions-pushed', solutionsPushed.toString())

      // Check if it's a daily challenge
      const [, dailyProblemNum] = await getDailyChallenge()

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
      // Check if fileName is valid
      if (!fileName || fileName.trim() === '') {
        console.error('Invalid file name:', fileName)
        throw new Error('Invalid file name. Please try again.')
      }

      // Check if content is valid
      if (!content || content.trim() === '') {
        console.error('Invalid content:', content)
        throw new Error('No solution content found. Please try again.')
      }

      // Debug logs to track values
      console.log('Debug - fileName:', fileName)
      console.log('Debug - commitMsg:', commitMsg)
      console.log('Debug - content length:', content.length)

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

      // Ensure filePath is not empty
      if (!filePath || filePath.trim() === '') {
        console.error('Invalid file path:', filePath)
        throw new Error('Invalid file path. Please try again.')
      }

      console.log('Debug - final filePath:', filePath)

      // Push file to repo
      const pushResult = await pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token)
      if (pushResult) {
        pushBtn.textContent = 'Done'
        await sleep(2000)
        pushBtn.disabled = false
        pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
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
      pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
      return false
    }
  }

  async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
    if (!filePath || !content || !commitMsg) {
      console.error('Missing required parameters:', {
        filePath,
        hasContent: !!content,
        hasCommitMsg: !!commitMsg,
      })
      return false
    }

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

      // Prepare request body with proper content encoding
      const encodedContent = btoa(unescape(encodeURIComponent(content)))
      const requestBody = {
        message: commitMsg,
        content: encodedContent,
        branch: branch,
      }

      // Check if file exists and get the latest SHA
      const fileExistsRes = await fetch(`${apiUrl}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('File exists response:', fileExistsRes)

      if (fileExistsRes.ok) {
        const existingFileData = await fileExistsRes.json()
        if (existingFileData && existingFileData.sha) {
          requestBody.sha = existingFileData.sha
          console.log('Found existing file SHA:', existingFileData.sha)
        }
      }

      // Make the API call to push the file
      let response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })
      console.log('Response status:', response.status)

      // Handle SHA mismatch (409 conflict) error
      if (response.status === 409) {
        console.log('SHA mismatch detected, fetching updated SHA and retrying...')

        // Get the latest SHA again
        const latestShaRes = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (latestShaRes.ok) {
          const latestFileData = await latestShaRes.json()
          if (latestFileData && latestFileData.sha) {
            // Update the SHA in the request body
            requestBody.sha = latestFileData.sha

            // Retry the request with the updated SHA
            response = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            })
            console.log('Retry response status:', response.status)
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`)
      }

      const responseData = await response.json()
      console.log('File successfully pushed:', responseData.content.html_url)
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
})()
