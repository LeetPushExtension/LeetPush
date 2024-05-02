import useLocalStorage from "./useLocalStorage.tsx";
import LeetCode from "./LeetCode.tsx";
import Icons from "./Icons.tsx";
import Logo from "./Logo.js";
import Form from "./Form.tsx";
import Footer from "./Footer.tsx";

export default function App() {
  const [leetCodeID, setLeetCodeID] = useLocalStorage(null, "lpLeetCodeID");

  return (
    <div className="pt-5 pb-3 px-5">
      <Icons />
      <Logo />

      {!leetCodeID ? (
        <Form type="" setLeetCodeID={setLeetCodeID} />
      ) : (
        <LeetCode setLeetCodeID={setLeetCodeID}
                  leetCodeID={leetCodeID} />
      )}

      <Footer />
    </div>
  );
}
