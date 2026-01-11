import { fetchDailyProblem } from "@/lib/leetpush.api";
import { DailyProblemI } from "@/types/leetpush.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * useDailyProblem - Fetch the daily problem from the LeetPush API
 **/
export function useDailyProblem() {
  const { data, error, isLoading } = useQuery<DailyProblemI, Error>({
    queryKey: ["dailyProblem"],
    queryFn: fetchDailyProblem,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return { data, error, isLoading };
}
