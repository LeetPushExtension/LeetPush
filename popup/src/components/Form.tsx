import React, { useState } from 'react'


export default function Form({ setLeetCodeUsername }: {
  setLeetCodeUsername: Function
}) {
  const [input, setInput] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLeetCodeUsername(input)
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="w-full flex justify-evenly">
        <input
          placeholder="LeetCode username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-1 text-sm focus:input-focus focus:outline-lp-grey rounded-lg"
        />
        <button className="bg-lp-green-bg text-sm font-semibold px-3 py-1 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  )
}
