(function () {
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

    // Create divider elements
    const divider1 = document.createElement('div')
    divider1.style.backgroundColor = '#0f0f0f'
    divider1.style.width = '1px'
    divider1.style.height = '100%'
    divider1.style.flexShrink = '0'

    const divider2 = document.createElement('div')
    divider2.style.backgroundColor = '#0f0f0f'
    divider2.style.width = '1px'
    divider2.style.height = '100%'
    divider2.style.flexShrink = '0'

    const pushButton = createButton(pushContainerId, pushButtonId, pushText, handlePushClick)

    parent.appendChild(divider1)
    parent.appendChild(editButton)
    parent.appendChild(divider2)
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
          <input type="text" id="repo-url" name="repo-url" placeholder="https://github.com/username/repository" required>
        </div>
        <div class="lp-div">
          <label>Token: <a href="https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig" target="_blank">Generate Token?</a></label>
          <input type="text" id="token" name="token" placeholder="github_pat_..." required>
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

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/
    if (!githubUrlPattern.test(repoUrlInput.value)) {
      alert('Please enter a valid GitHub repository URL (https://github.com/username/repository).')
      return
    }

    // Validate GitHub token (basic format check)
    if (!tokenInput.value.startsWith('ghp_') && !tokenInput.value.startsWith('github_pat_')) {
      alert('Please enter a valid GitHub token. It should start with "ghp_" or "github_pat_".')
      return
    }

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
    try {
      await updateRepoDescription(token, repoUrl, branch)
    } catch (error) {
      console.error('Error setting up repository metadata:', error)
      showError('Initial repository setup failed. You may need to check your repository permissions.')
    }
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

  // Function to show error messages to the user
  function showError(message) {
    alert(`LeetPush Error: ${message}`)
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
      showError('Interface error: Push button not found. Please refresh the page and try again.')
      return
    }

    // Force a refresh of problem info
    const problemInfo = await extractProblemInfo()
    if (!problemInfo) {
      console.error('Failed to extract problem info')
      showError('Failed to extract problem information. This may happen if the page structure has changed or if you\'re not on a solution page.')
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

      if (!fileName) {
        showError('Failed to generate a valid file name for your solution.')
      } else if (!solution) {
        showError('Failed to extract your solution code. Please try again.')
      } else {
        showError('Failed to generate commit message. Please try again.')
      }
      return
    }

    const [userName, repoName] = config.repo.split('/').slice(3, 5)
    if (!userName || !repoName) {
      console.error('Invalid repository URL:', config.repo)
      showError('Invalid repository URL format. Please check your settings and provide a valid GitHub repository URL (e.g., https://github.com/username/repository).')
      showConfigModal()
      return
    }

    pushBtn.disabled = true
    pushBtn.textContent = 'Loading...'
    pushBtn.classList.add('loading')

    try {
      const result = await pushToGithub(
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

      pushBtn.classList.remove('loading')
      pushBtn.classList.add('success')
      pushBtn.textContent = 'Done'
      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.classList.remove('success')
      pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`

      // Update statistics
      const solutionsPushed = Number.parseInt(localStorage.getItem('solutions-pushed') || '0') + 1
      localStorage.setItem('solutions-pushed', solutionsPushed.toString())

      // Check if it's a daily challenge
      try {
        const [, dailyProblemNum] = await getDailyChallenge()

        if (problemInfo && dailyProblemNum === problemInfo.probNum) {
          const dailyChallenges = Number.parseInt(localStorage.getItem('daily-challenges') || '0') + 1
          localStorage.setItem('daily-challenges', dailyChallenges.toString())
        }
      } catch (error) {
        console.error('Error checking daily challenge:', error)
        // Non-critical error, don't show to user
      }
    } catch (error) {
      console.error('Failed to push solution:', error)
      showError(error.message || 'Unknown error occurred while pushing solution')

      pushBtn.classList.remove('loading')
      pushBtn.classList.add('error')
      pushBtn.textContent = 'Error'
      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.classList.remove('error')
      pushBtn.textContent = `Push (${SHORTCUT_DISPLAY})`
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
    try {
      // Check if fileName is valid
      if (!fileName || fileName.trim() === '') {
        console.error('Invalid file name:', fileName)
        throw new Error('Invalid file name. Please try again with a different solution.')
      }

      // Check if content is valid
      if (!content || content.trim() === '') {
        console.error('Invalid content:', content)
        throw new Error('No solution content found. Please make sure your solution is visible on the page.')
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
        try {
          const [date, dailyProblemNum] = await getDailyChallenge()
          const problemInfo = await extractProblemInfo()

          if (problemInfo && dailyProblemNum === problemInfo.probNum) {
            const splitDate = date.split('-')
            const dailyFolder = `DCP-${splitDate[1]}-${splitDate[0].slice(2)}`
            filePath = `${dailyFolder}/${fileName}`
          }
        } catch (error) {
          console.error('Error processing daily challenge folder:', error)
          // Continue without separate folder if there's an error
        }
      }

      // Ensure filePath is not empty
      if (!filePath || filePath.trim() === '') {
        console.error('Invalid file path:', filePath)
        throw new Error('Failed to generate a valid file path. Please check your target directory settings.')
      }

      console.log('Debug - final filePath:', filePath)

      // Push file to repo
      return await pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token)
    } catch (error) {
      console.error('Error in pushToGithub:', error)
      throw error; // Propagate the error to be handled by the caller
    }
  }

  async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
    if (!filePath || !content || !commitMsg) {
      console.error('Missing required parameters:', {
        filePath,
        hasContent: !!content,
        hasCommitMsg: !!commitMsg,
      })
      throw new Error('Missing required file information. Please try again.')
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
        const errorData = await repoCheckResponse.json()
        console.error('Repository check error:', errorData)

        // Handle different error cases with specific messages
        if (repoCheckResponse.status === 404) {
          throw new Error(`Repository not found: ${userName}/${repoName}. Please check if the repository exists and your token has access to it.`)
        } else if (repoCheckResponse.status === 401) {
          throw new Error('Authentication failed. Your GitHub token may be invalid or expired. Please generate a new token.')
        } else if (repoCheckResponse.status === 403) {
          throw new Error('Access forbidden. Your token may not have sufficient permissions to access this repository.')
        } else {
          throw new Error(`Repository access error: ${errorData.message || 'Unknown error'}`)
        }
      }

      // Prepare request body with proper content encoding
      const encodedContent = btoa(unescape(encodeURIComponent(content)))
      const requestBody = {
        message: commitMsg,
        content: encodedContent,
        branch: branch,
      }

      // Check if file exists and get the latest SHA
      let fileExistsRes
      try {
        fileExistsRes = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('File exists response:', fileExistsRes)
      } catch (error) {
        console.error('Error checking if file exists:', error)
        throw new Error('Network error while checking if file already exists in repository.')
      }

      if (fileExistsRes.ok) {
        try {
          const existingFileData = await fileExistsRes.json()
          if (existingFileData && existingFileData.sha) {
            requestBody.sha = existingFileData.sha
            console.log('Found existing file SHA:', existingFileData.sha)
          }
        } catch (error) {
          console.error('Error parsing existing file data:', error)
          throw new Error('Error processing existing file data from GitHub.')
        }
      } else if (fileExistsRes.status !== 404) {
        // 404 is expected if file doesn't exist yet
        const errorData = await fileExistsRes.json()
        console.error('Error checking file existence:', errorData)

        if (fileExistsRes.status === 403) {
          throw new Error('Permission denied. Make sure your token has "contents: write" permission on this repository.')
        } else if (fileExistsRes.status === 401) {
          throw new Error('Authentication failed. Your GitHub token may be invalid or expired.')
        } else {
          throw new Error(`Error checking file: ${errorData.message || 'Unknown error'}`)
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

      // Handle SHA mismatch (409 conflict) error - retry up to 3 times
      let retryCount = 0;
      const maxRetries = 3;

      while (response.status === 409 && retryCount < maxRetries) {
        console.log(`SHA mismatch detected (attempt ${retryCount + 1}/${maxRetries}), fetching updated SHA and retrying...`)
        retryCount++;

        try {
          // Get the latest SHA again
          const latestShaRes = await fetch(`${apiUrl}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!latestShaRes.ok) {
            console.error(`Failed to get latest SHA on retry ${retryCount}, status: ${latestShaRes.status}`)
            continue; // Skip to next retry attempt
          }

          const latestFileData = await latestShaRes.json()
          if (latestFileData && latestFileData.sha) {
            // Update the SHA in the request body
            requestBody.sha = latestFileData.sha
            console.log(`Using updated SHA on retry ${retryCount}: ${latestFileData.sha}`)

            // Retry the request with the updated SHA
            response = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            })
            console.log(`Retry ${retryCount} response status:`, response.status)

            if (response.ok) {
              break; // Success, exit the retry loop
            }
          } else {
            console.error('Failed to get valid SHA from response:', latestFileData)
            break;
          }
        } catch (retryError) {
          console.error(`Error during retry ${retryCount}:`, retryError)
          break; // Exit retry loop on error
        }

        // Small delay between retries to avoid rate limiting
        await sleep(500);
      }

      if (!response.ok) {
        let errorMessage = `GitHub API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || 'Unknown error'}`;
          console.error('GitHub API error details:', errorData);
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json()
      console.log('File successfully pushed:', responseData.content.html_url)
      return true
    } catch (error) {
      console.error('Error pushing file to repo:', error)
      // Don't show alert here, just propagate the error to be handled by the caller
      throw error;
    }
  }

  async function updateRepoDescription(token, repo, branch) {
    const [userName, repoName] = repo.split('/').slice(3, 5)
    const description = 'This repository is managed by LeetPush extension: https://github.com/husamahmud/LeetPush'

    try {
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
