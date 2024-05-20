import React, { useEffect, useState } from 'react'

export default function useLocalStorage<T>(initialState: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key)
      return storedValue !== null ? JSON.parse(storedValue) : initialState
    } catch (err) {
      console.error('Error reading from localStorage', err)
      return initialState
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('Error saving to localStorage', err)
    }
  }, [value, key])

  return [value, setValue]
}
