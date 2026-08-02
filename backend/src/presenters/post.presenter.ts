import { SafePostDataResult } from "../types/post.types.js";

export const postPresenters = {
  presentPost(post: SafePostDataResult) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images,
      user: post.user,
      userId: post.userId,
      createdAt: post.createdAt,
      commentsCount: post._count.comments,
      likesCount: post._count.likes,
      views: post.views,
      type: post.type,
      isLiked: post.likes.length > 0,
    };
  },

  presentPostsList(posts: Array<SafePostDataResult>) {
    return posts.map((post) => this.presentPost(post));
  },
};
