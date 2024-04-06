import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Loader from "./Loader.jsx";
import NotFound from "./NotFound.jsx";
import Form from "./Form.jsx";
import DailyProblem from "./DailyProblem.jsx";

LeetCode.propTypes = {
  leetCodeID: PropTypes.string.isRequired,
  setLeetCodeID: PropTypes.func.isRequired,
};

function calculateProgress(solved, total) {
  return (250 * (solved / total) * 100 / 100).toFixed();
}

export default function LeetCode({ leetCodeID, setLeetCodeID }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(null);
  const [updateForm, setUpdateForm] = useState(false);
  const [reqError, setReqErr] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError("");
        setNotFound("");

        const res = await fetch(`https://leetcodestats.cyclic.app/${leetCodeID}`);
        if (!res.ok) {
          if (res.status === 404) setNotFound("404: User Not Found");
          else setError(`Network response was not ok (status: ${res.status})`);
        }
        
        const data = await res.json();
        setData(data);
        setError("");
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [leetCodeID]);

  const {
    easySolved,
    totalEasy,
    mediumSolved,
    totalMedium,
    hardSolved,
    totalHard,
    totalSolved,
  } = data;

  return (
    <>
      {!updateForm ? (
        <>
          {isLoading && <Loader />}
          {notFound && <NotFound />}
          {error && <p>Error: {error}</p>}
          {data && !error && !notFound && !isLoading && (
            <>
              <div className="mb-5 px-6 flex items-center justify-between">
                <p className="font-semibold text-xl text-lp-greyer">
                  Hi, <span className="text-lp-white">{leetCodeID}</span>
                </p>
                <p className="font-medium text-sm text-lp-greyer">
                  Total
                  Solved <span className="text-lp-white underline">{totalSolved}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <div className="flex gap-2 items-center justify-around">
                  <div className="flex gap-2 justify-between w-7/12">
                    <p className={`text-lp-green text-xl font-semibold`}>Easy</p>
                    <p className="text-lp-white text-xl font-semibold">{easySolved}
                      <span className="text-lp-greyer font-bold text-sm">/{totalEasy}</span>
                    </p>
                  </div>
                  <div className={`bg-lp-green-dark h-2 w-[250px] rounded-3xl relative`}>
                    <div className={`absolute bg-lp-green h-2 rounded-3xl`}
                         style={{ width: `${calculateProgress(easySolved, totalEasy)}px` }}>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-around">
                  <div className="flex gap-2 justify-between w-7/12">
                    <p className={`text-lp-yellow text-xl font-semibold`}>Medium</p>
                    <p className="text-lp-white text-xl font-semibold">{mediumSolved}
                      <span className="text-lp-greyer font-bold text-sm">/{totalMedium}</span>
                    </p>
                  </div>
                  <div className={`bg-lp-yellow-dark h-2 w-[250px] rounded-3xl relative`}>
                    <div className={`absolute bg-lp-yellow h-2 rounded-3xl`}
                         style={{ width: `${calculateProgress(mediumSolved, totalMedium)}px` }}>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-around">
                  <div className="flex gap-2 justify-between w-7/12">
                    <p className={`text-lp-red text-xl font-semibold`}>Hard</p>
                    <p className="text-lp-white text-xl font-semibold">{hardSolved}
                      <span className="text-lp-greyer font-bold text-sm">/{totalHard}</span>
                    </p>
                  </div>
                  <div className={`bg-lp-red-dark h-2 w-[250px] rounded-3xl relative`}>
                    <div className={`absolute bg-lp-red h-2 rounded-3xl`}
                         style={{ width: `${calculateProgress(hardSolved, totalHard)}px` }}>
                    </div>
                  </div>
                </div>
              </div>

              {!reqError && <DailyProblem setReqErr={setReqErr} />}
            </>
          )}
        </>
      ) : (
        <Form setLeetCodeID={setLeetCodeID}
              type="update" />
      )}

      <div className="w-full flex justify-end">
        <button
          className="bg-[#ffffff1a] hover:bg-opacity-80 transition mr-7 text-sm font-semibold px-3 py-1 rounded-lg"
          onClick={() => setUpdateForm(!updateForm)}>
          {updateForm ? "Back" : "Edit"}
        </button>
      </div>
    </>
  );
}
