import { useState } from 'react'

import Daily from './Daily.tsx'
import FetchUserStats from './Stats.tsx'
import Welcome from './Welcome.tsx'
import Form from './Form.tsx'
import { LeetCodePropsI } from '../utils/types.ts'

const LeetCode = ({ leetCodeUsername, setLeetCodeUsername }: LeetCodePropsI) => {
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  return (
    <>
      {editMode ? (
        <Form
          setLeetCodeUsername={(newUsername: string) => {
            setLeetCodeUsername(newUsername)
            toggleEditMode()
          }}
        />
      ) : (
        <>
          <Welcome leetCodeUsername={leetCodeUsername} />
          <FetchUserStats leetCodeUsername={leetCodeUsername} />
          <Daily />

          <div className="w-full flex justify-end">
            <button
              className="bg-[#ffffff1a] hover:bg-opacity-80 transition-all text-sm font-semibold px-3 py-1 rounded-lg"
              onClick={toggleEditMode}>Edit
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default LeetCode
