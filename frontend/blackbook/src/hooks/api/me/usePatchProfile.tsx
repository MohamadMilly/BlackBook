import type {
  Profile,
  UserWithFollowCounts,
} from "@app/types";
import { apiClient } from "../../../api/api";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../../../contexts/authContext";

const patchProfile = async ({
  bio,
  avatarUrl,
  bannerUrl,
}: {
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}): Promise<{ profile: Profile }> => {
  const response = await apiClient.patch("/me/profile", {
    bio,
    avatarUrl,
    bannerUrl,
  });

  return response.data;
};

export function usePatchProfile() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["patchProfile"],
    mutationFn: patchProfile,

    onSuccess: (data) => {
      queryClient.setQueryData(
        ["users", currentUser?.id],
        (old: { user: UserWithFollowCounts } | undefined) => {
          if (!old?.user) return old;
          return {
            ...old,
            user: { ...old.user, profile: data.profile },
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentUser?.id] });
    },
  });
}
