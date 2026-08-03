import type { Profile, ResponseError, UserWithFollowCounts } from "@app/types";
import { apiClient } from "../../../api/api";
import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useAuth } from "../../../contexts/authContext";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

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
  const { add } = useNotifications();
  return useMutation<
    { profile: Profile },
    AxiosError<{ errors: ResponseError[] } | ResponseError>,
    { bio?: string; avatarUrl?: string; bannerUrl?: string }
  >({
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
      add("Profile updated successfully.", "SUCCESS");
    },
    onError: (error) => {
      add(
        getErrorMessage(
          error as AxiosError<
            { errors: ResponseError[] } | ResponseError
          > | null,
        ),
        "ERROR",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentUser?.id] });
    },
  });
}
