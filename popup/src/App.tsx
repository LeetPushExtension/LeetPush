import Links from '@/components/Links.tsx'
import Logo from '@/components/Logo.tsx'
import LeetCode from '@/components/LeetCode.tsx'

export default function App() {
  return (
    <main className="h-screen w-screen space-y-4 bg-[#09090b] px-4 py-5 text-stone-100">
      <Links />
      <Logo />
      <LeetCode />
    </main>
  )
}
