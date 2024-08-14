import { useContext, FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { UserContext } from '@/context/userContext.tsx'
import { fetchUserStats } from '@/lib/leetpush.api.ts'

export default function InputForm() {
  const { username, setUsername } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const username = e.currentTarget.username.value
    if (!username) {
      setError('Please enter a username')
      setLoading(false)
      return
    }

    try {
      await fetchUserStats(username)

      setUsername(username)
      setError('')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          setError('User not found')
        } else {
          setError('Failed to fetch user stats')
        }
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center py-7 space-y-3">
      <form className="flex w-full max-w-sm justify-center items-center space-x-2 mx-auto"
            onSubmit={handleSubmit}>
        <Input type="text"
               name="username"
               defaultValue={username}
               className="bg-transparent border-b border-lp-greyer text-stone-100 placeholder:text-stone-500"
               placeholder="LeetCode username" />
        <Button type="submit"
                size="sm"
                disabled={loading}
                className="bg-stone-600 hover:bg-stone-700 text-white font-normal">Submit</Button>
      </form>

      {error && <p className="text-red-500 font-medium text-base">{error}</p>}
    </div>
  )
}
