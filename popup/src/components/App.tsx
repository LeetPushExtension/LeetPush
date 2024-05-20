import Icons from './Icons.tsx'
import Logo from './Logo.tsx'
import Footer from './Footer.tsx'
import LeetCode from './LeetCode.tsx'
import Form from './Form.tsx'
import useLocalStorage from './useLocalStorage'

/**
 * TODO: handle not found user
 **/

export default function App() {
  const [leetCodeUsername, setLeetCodeUsername] = useLocalStorage('', 'leetCodeUsername')

  return (
    <div className="pt-5 pb-3 px-5">
      <Icons />
      <Logo />
      {leetCodeUsername ? (
        <LeetCode leetCodeUsername={leetCodeUsername} />
      ) : (
        <Form setLeetCodeUsername={setLeetCodeUsername} />
      )}
      <Footer />
    </div>
  )
}
