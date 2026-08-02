import { SafeUserDataResult } from "../types/user.types.js";

export const userPresenters = {
  presentUser(user: SafeUserDataResult) {
    return {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        createdAt: user.createdAt,
        profile: user.profile,
      },
      recentStoryId: user.posts[0]?.id,
      isFollowed:
        "followers" in user && Array.isArray(user.followers)
          ? user.followers.length === 1
          : false,
      pendingFollowRequest:
        "receivedFollowRequests" in user &&
        Array.isArray(user.receivedFollowRequests)
          ? user.receivedFollowRequests[0]
          : null,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    };
  },
  presentUsersList(users: SafeUserDataResult[]) {
    return users.map((user: SafeUserDataResult) => this.presentUser(user));
  },
};
