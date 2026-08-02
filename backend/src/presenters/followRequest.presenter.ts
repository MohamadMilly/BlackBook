import { FollowRequestsDataResult } from "../types/followRequest.types.js";

export const followRequestPresenters = {
  presentFollowRequest(request: FollowRequestsDataResult[number]) {
    return {
      id: request.id,
      senderId: request.senderId,
      receiverId: request.receiverId,
      createdAt: request.createdAt,
      sender: request.sender,
      receiver: request.receiver,
    };
  },

  presentFollowRequestsList(requests: FollowRequestsDataResult) {
    return requests.map((request) => this.presentFollowRequest(request));
  },
};
