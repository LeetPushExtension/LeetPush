import useLocalStorage from "./useLocalStorage.jsx";
import LeetCode from "./LeetCode.jsx";
import Icons from "./Icons.jsx";
import Logo from "./Logo.jsx";
import Form from "./Form.jsx";
import Footer from "./Footer.jsx";

export default function App() {
  const [leetCodeID, setLeetCodeID] = useLocalStorage(null, "lpLeetCodeID");

  return (
    <div className="pt-5 pb-5 px-5">
      <Icons />
      <Logo />

      {!leetCodeID ? (
        <Form setLeetCodeID={setLeetCodeID} />
      ) : (
        <LeetCode setLeetCodeID={setLeetCodeID}
                  leetCodeID={leetCodeID} />
      )}

      <Footer />
    </div>
  );
}
