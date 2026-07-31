const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
export const recentStoryWhereOption = {
    type: "STORY",
    createdAt: {
        gt: yesterday,
    },
};
export const getPostsQueryOptions = {
    include: {
        user: {
            select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                createdAt: true,
                profile: true,
            },
        },
        likes: true /* here we can only get the user like and return hasLiked instead of getting all likes and check in frontend
          / but it is okay if likes are not so much */,
        _count: {
            select: {
                comments: true,
            },
        },
    },
    orderBy: {
        createdAt: "desc",
    },
};
