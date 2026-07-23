import type { User } from "@app/types";
import { apiClient } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/authContext";

const getUser = async (
  userId: number,
  currentUserId: number | undefined,
): Promise<{ user: Omit<User, "password"> }> => {
  const endpoint = userId === currentUserId ? "/me" : `/users/${userId}`;
  const response = await apiClient.get(endpoint);

  return response.data;
};

export function useUser(userId: number) {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: [userId, "users"],
    queryFn: () => getUser(userId, currentUser?.id),
    staleTime: 1000 * 60 * 15,
    enabled: !!userId,
  });
  const user = data?.user ?? null;

  return { user, isLoading, error };
}
