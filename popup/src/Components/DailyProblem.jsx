import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useLocalStorage from "./useLocalStorage";

DailyProblem.propTypes = {
  setReqErr: PropTypes.func.isRequired,
};

function getGSTDate() {
  const now = new Date();
  return `${now.getUTCFullYear()}${now.getUTCMonth() + 1}${now.getUTCDate()}`;
}

function useDailyProblem(setReqErr) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [daily, setDaily] = useLocalStorage(null, "dailyProblem");

  useEffect(() => {
    const fetchDailyProblem = async () => {
      let dataJson;
      try {
        setIsLoading(true);
        setError("");

        if (daily && daily.date === getGSTDate()) {
            dataJson = daily.data;
        } else {
          const res = await fetch(
            `https://alfa-leetcode-api.onrender.com/daily`
          );
          if (!res.ok) {
            if (res.status === 429) setReqErr(true);
            else setError("Failed to fetch the daily problem");
          }
          dataJson = await res.json();
          setDaily({
            data: {
              questionLink: dataJson.questionLink,
              questionTitle: dataJson.questionTitle,
              difficulty: dataJson.difficulty,
            },
            date: getGSTDate(),
          });
        }
        setData({
          questionLink: dataJson.questionLink,
          questionTitle: dataJson.questionTitle,
          difficulty: dataJson.difficulty,
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyProblem();
  }, []);

  return { data, isLoading, error };
}

export default function DailyProblem({ setReqErr }) {
  const { data, isLoading, error } = useDailyProblem(setReqErr);
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-lp-green-dark",
      Medium: "bg-lp-yellow-dark",
      Hard: "bg-lp-red-dark",
    };
    return colors[difficulty] || "";
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {data && !error && !isLoading && (
        <div className="flex flex-col mb-2">
          <p className="font-medium text-sm">Daily Problem</p>
          <div>
            <a
              href={data.questionLink}
              target="_blank"
              className="text-sm font-semibold underline mr-3 transition hover:text-[#1586ff]"
            >
              {data.questionTitle}
            </a>
            <span
              className={`text-sm font-semibold px-1 py-1 ${getDifficultyColor(
                data.difficulty
              )} rounded-md`}
            >
              {data.difficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
