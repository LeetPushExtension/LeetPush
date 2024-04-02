import PropTypes from 'prop-types'
import useLocalStorage from './useLocalStorage.jsx'

FormUpdate.propTypes = {
  setLeetCodeID: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
};

export default function FormUpdate({setLeetCodeID, setInput}) {
  function handleSubmit(e) {
    e.preventDefault();
    setLeetCodeID(input)
  }

  return (
    <div className="mb-3">
      <form onSubmit={e => handleSubmit(e)}
            className="w-full flex justify-evenly">
        <input placeholder="LeetCode username"
               name="username"
               value={input}
               onChange={e => setInput(e.target.value)}
               className="px-3 py-1 text-sm focus:input-focus focus:outline-lp-grey rounded-lg"/>
        <button className="bg-lp-green-bg text-sm font-semibold px-3 py-1 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
}


// export default function FormUpdate({ updateForm, setUpdateForm }) {
//   const [leetCodeID, setLeetCodeID] = useLocalStorage(null, 'lpLeetCodeID')
//   const [repoUrl, setRepoUrl] = useLocalStorage(null, 'lpRepoUrl')
//   const [token, setToken] = useLocalStorage(null, 'lpToken')
//   const [branch, setBranch] = useLocalStorage(null, 'lpBranch', (value) => {
//     return value ? value.toLowerCase() : null
//   })
//
//   function handleSubmit(e) {
//     e.preventDefault()
//     setUpdateForm(!updateForm)
//
//     const data = { leetCodeID }
//
//     window.postMessage({ action: 'updateStorage', data }, '*')
//     console.log('lpLeetCodeID', leetCodeID)
//   }
//
//   // useEffect(() => {
//   //   const updataBtn = document.getElementById('update') // Access element after render
//   //
//   //   updataBtn.addEventListener('click', () => {
//   //     const data = { leetCodeID }
//   //     chrome.runtime.sendMessage({ action: 'updateStorage', data })
//   //     console.log('message work')
//   //   })
//   // }, [leetCodeID])
//
//   return (
//     <div className="mb-3">
//       <form onSubmit={e => handleSubmit(e)}
//             className="w-full flex flex-col justify-center gap-4">
//         <input value={leetCodeID || ''}
//                onChange={e => setLeetCodeID(e.target.value)}
//                placeholder="LeetCode username"
//                name="username"
//                id="leetCodeID"
//                className="px-3 py-1 w-5/6 mx-auto text-sm focus:input-focus focus:outline-lp-grey rounded-lg" />
//         <input value={repoUrl || ''}
//                onChange={e => setRepoUrl(e.target.value)}
//                placeholder="Repository URL"
//                name="repourl"
//                className="px-3 py-1 w-5/6 mx-auto text-sm focus:input-focus focus:outline-lp-grey rounded-lg" />
//         <input value={token || ''}
//                onChange={e => setToken(e.target.value)}
//                placeholder="Token"
//                name="token"
//                className="px-3 py-1 w-5/6 mx-auto text-sm focus:input-focus focus:outline-lp-grey rounded-lg" />
//
//         <div className="flex justify-evenly">
//           <div>
//             <input checked={branch === 'master'}
//                    onChange={() => setBranch('master')}
//                    type="radio"
//                    className="mr-2" />
//             <label>Master</label>
//           </div>
//           <div>
//             <input checked={branch === 'main'}
//                    onChange={() => setBranch('main')}
//                    type="radio"
//                    className="mr-2" />
//             <label>Main</label>
//           </div>
//         </div>
//
//         <button className="bg-lp-green-bg hover:bg-opacity-80 transition w-5/6 mx-auto text-sm font-semibold px-3 py-1 rounded-lg"
//                 id="update">
//           Submit
//         </button>
//       </form>
//     </div>
//   )
// }
