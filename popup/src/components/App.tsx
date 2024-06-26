import Icons from './Icons.tsx'
import Logo from './Logo.tsx'
import LeetCode from './LeetCode.tsx'
import Form from './Form.tsx'
import Footer from './Footer.tsx'
import useLocalStorage from './useLocalStorage'

export default function App() {
  const [leetCodeUsername, setLeetCodeUsername] = useLocalStorage('', 'leetCodeUsername')

  return (
    <div className="pt-5 pb-3 px-5">
      <Icons />
      <Logo />
      {leetCodeUsername ? (
        <LeetCode leetCodeUsername={leetCodeUsername}
                  setLeetCodeUsername={setLeetCodeUsername} />
      ) : (
        <Form setLeetCodeUsername={setLeetCodeUsername} />
      )}
      <Footer />
    </div>
  )
}
