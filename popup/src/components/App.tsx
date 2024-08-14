import Links from '@/components/Links.tsx'
import Logo from '@/components/Logo.tsx'
import LeetCode from '@/components/LeetCode.tsx'
import Footer from '@/components/Footer.tsx'
import InputForm from '@/components/InputForm.tsx'
import { useContext } from 'react'
import { UserContext } from '@/context/userContext.tsx'
import EditButton from '@/components/EditButton.tsx'

export default function App() {
  const { username } = useContext(UserContext)

  return (
    <main className="space-y-1 bg-stone-900 px-4 py-5 text-stone-100">
      <Links />
      <Logo />
      {username ? (
        <LeetCode />
      ) : (
        <InputForm />
      )}
      {username && <EditButton />}
      <Footer />
    </main>
  )
}
