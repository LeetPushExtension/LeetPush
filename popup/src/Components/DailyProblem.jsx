import { useEffect, useState } from "react";
import PropTypes from "prop-types";

DailyProblem.propTypes = {
  setReqErr: PropTypes.func.isRequired,
};

export default function DailyProblem({ setReqErr }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDailyProblem = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(`https://alfa-leetcode-api.onrender.com/daily`);
        if (!res.ok) {
          if (res.status === 429) setReqErr(true);
          else setError("Failed to fetch the daily problem");
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

    fetchDailyProblem();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-lp-green-dark";
      case "Medium":
        return "bg-lp-yellow-dark";
      case "Hard":
        return "bg-lp-red-dark";
      default:
        return "";
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {data && !error && !isLoading && (
        <div className="flex flex-col mb-2">
          <p className="font-medium text-sm">Daily Problem</p>
          <div>
            <a href={data.questionLink}
               target="_blank"
               className="text-sm font-semibold underline mr-3 transition hover:text-[#1586ff]">
              {data.questionTitle}
            </a>
            <span className={`text-sm font-semibold px-1 py-1 ${getDifficultyColor(data.difficulty)} rounded-md`}>
              {data.difficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
