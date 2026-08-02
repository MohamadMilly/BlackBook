export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
  followers?: User[];
  following?: User[];
  googleId?: string;
  profile: Profile | null;
};

export type PublicUser = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  createdAt: Date;
  profile?: Profile | null;
};

export type Profile = {
  id: number;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
};

export type UserWithFollowCounts = {
  user: PublicUser;
  followersCount: number;
  followingCount: number;
};

export type Comment = {
  postId: number;
  text: string;
  id: number;
  userId: number;
  createdAt: Date;
  user?: PublicUser;
};

export type PostType = "STORY" | "FEED";

export type Post = {
  id: number;
  title?: string | null;
  content: string;
  images: string[];
  user?: PublicUser;
  userId: number;
  createdAt: Date;
  isLiked?: boolean;
  commentsCount?: number;
  likesCount?: number;
  views: number;
  type: PostType;
};

export type CreatePostResponseBody = { post: Required<Post> };

export type Like = {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  user?: PublicUser;
  post?: Post;
};

export type FollowRequest = {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: Date;
  receiver?: PublicUser;
  sender?: PublicUser;
};

export type LoginRequestBody = {
  username: string;
  password: string;
};

export type LoginResponseBody = {
  user: UserJwtPayload;
  accessToken: string;
  refreshToken: string;
};

export type SignUpRequestBody = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  googleId?: string;
  confirmPassword: string;
};

export type SignUpResponseBody = {
  message: string;
  user: PublicUser;
};

export type UserJwtPayload = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
};

export type ResponseError = {
  message: string;
  [key: string]: any;
};

export type CreatePostRequestBody = {
  title?: string;
  content: string;
  images: string[];
  type: PostType;
  userId: number;
};
export type ToggleLikeResponseBody = {
  operation: "create" | "delete";
  like: Like | null;
};

export type GetUserResponseBody = {
  user: PublicUser;
  followingCount: number;
  followersCount: number;
  recentStoryId: number | null | undefined;
  pendingFollowRequest?: FollowRequest | null | undefined;
  isFollowed?: boolean;
};

export type GetUsersResponseBody = {
  users: GetUserResponseBody[];
  nextCursor: number | undefined;
};

export type GetFollowersResponseBody = {
  followers: GetUserResponseBody[];
  nextCursor: number | undefined;
};

export type GetFollowingsResponseBody = {
  followings: GetUserResponseBody[];
  nextCursor: number | undefined;
};

export type CurrentUserData = {
  user: PublicUser;
  followingCount: number;
  followersCount: number;
  recentStoryId: number;
};

export type CreateCommentInput = {
  text: string;
  postId: number;
  userId: number;
};

export type GetPostsResponseBody = {
  posts: Required<Post>[];
};

export type GetPostResponseBody = {
  post: Required<Post>;
};

export type FollowRequestType = "received" | "sent";
