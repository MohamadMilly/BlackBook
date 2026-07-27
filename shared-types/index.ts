export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
  followers?: User[];
  following?: User[];
  profile: Profile | null;
};

export type Profile = {
  id: number;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
};

export type UserWithFollowCounts = {
  user: Omit<User, "password">;
  followersCount: number;
  followingCount: number;
};

export type Comment = {
  postId: number;
  text: string;
  id: number;
  userId: number;
  createdAt: Date;
  user?: Omit<User, "password">;
};

export type UserFollowDataType = {
  hasPendingFollowRequest: boolean;
  pendingFollowRequest?: FollowRequest;
  isFollowed: boolean;
};

export type Post = {
  id: number;
  title?: string | null;
  content: string;
  images: string[];
  user?: Omit<User, "password">;
  userId: number;
  createdAt: Date;
  likes: Like[];
  commentsCount?: number;
};

export type Like = {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  user?: Omit<User, "password">;
  post?: Post;
};

export type FollowRequest = {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: Date;
  receiver?: Omit<User, "password">;
  sender?: Omit<User, "password">;
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
  confirmPassword: string;
};

export type SignUpResponseBody = {
  message: string;
  user: Omit<User, "password">;
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

export interface CreatePostRequestBody
  extends Omit<Post, "id" | "user" | "createdAt" | "userId" | "likes"> {}

export type ToggleLikeResponseBody = {
  operation: "create" | "delete";
  like: Like | null;
};

export type GetUserResponseBody = {
  user: Omit<User, "password">;
  followingCount: number;
  followersCount: number;
} & UserFollowDataType;

export type CurrentUserData = {
  user: Omit<User, "password">;
  followingCount: number;
  followersCount: number;
};

export type FollowRequestType = "received" | "sent";
