import { getFollowRequests, createFollowRequest, getFollowRequestsCount, acceptRequest, cancelOrRejectRequest, unFollowUser, } from "../services/followRequestsService.js";
import { HttpError } from "../shared/errors/HttpError.js";
export const createFollowRequestPost = async (req, res, next) => {
    const currentUser = req.currentUser;
    const { receiverId } = req.body;
    const request = await createFollowRequest(currentUser?.id, receiverId, {
        include: {
            receiver: {
                include: {
                    profile: true,
                },
            },
        },
    });
    res.json({ request });
    try {
    }
    catch (err) {
        next(err);
    }
};
export const getFollowRequestsGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { type } = req.query;
    if (!type) {
        throw new HttpError(404, "Requests type (received,sent) is required");
    }
    try {
        const requests = await getFollowRequests(currentUserId, type);
        res.json({
            requests,
        });
    }
    catch (err) {
        next(err);
    }
};
export const getFollowRequestsCountGet = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { type } = req.query;
    try {
        const requestsCount = await getFollowRequestsCount(currentUserId, type);
        res.json({
            count: requestsCount,
        });
    }
    catch (err) {
        next(err);
    }
};
export const acceptFollowRequestPost = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { requestId } = req.params;
    try {
        const hasAccepted = await acceptRequest(currentUserId, JSON.parse(requestId));
        res.json({
            hasAccepted,
        });
    }
    catch (err) {
        next(err);
    }
};
export const cancelOrRejectFollowRequestDelete = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { requestId } = req.params;
    try {
        const hasRemoved = await cancelOrRejectRequest(currentUserId, JSON.parse(requestId));
        res.json({ hasRemoved });
    }
    catch (err) {
        next(err);
    }
};
export const unFollowUserDelete = async (req, res, next) => {
    const currentUserId = req.currentUser?.id;
    const { userId } = req.params;
    try {
        const hasUnFollowed = await unFollowUser(currentUserId, JSON.parse(userId));
        res.json({ hasUnFollowed });
    }
    catch (err) {
        next(err);
    }
};
