import { fetchUserStreak } from "@/lib/leetpush.api";
import { UserStreakI } from "@/types/leetpush.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * useUserStreak - Fetch user streak from the LeetPush API
 * @param username - The username of the user to fetch streak for
 **/
export function useUserStreak(username: string) {
  const { data, error, isLoading } = useQuery<UserStreakI, Error>({
    queryKey: ["userStreak", username],
    queryFn: () => fetchUserStreak(username),
  });

  return { data, error, isLoading };
}
