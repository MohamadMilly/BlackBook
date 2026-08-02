import { PostCommentsDataResult } from "../types/comment.types.js";

export const commentPresenters = {
  presentComment(comment: PostCommentsDataResult[number]) {
    return {
      id: comment.id,
      text: comment.text,
      postId: comment.postId,
      userId: comment.userId,
      createdAt: comment.createdAt,
      user: comment.user,
    };
  },

  presentCommentsList(comments: PostCommentsDataResult) {
    return comments.map((comment) => this.presentComment(comment));
  },
};
