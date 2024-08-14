import { Button } from '@/components/ui/button.tsx'
import { UserContext } from '@/context/userContext.tsx'
import { useContext } from 'react'

export default function EditButton() {
  const { setUsername } = useContext(UserContext)

  return (
    <div className="flex justify-end">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setUsername('')}
      >
        Edit
      </Button>
    </div>
  )
}
