export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
  followers?: User[];
  following?: User[];
};

export type UserFollowDataType = {
  hasPendingFollowRequest: boolean;
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
  pendingFollowRequest: FollowRequest;
} & UserFollowDataType;

export type CurrentUserData = {
  user: Omit<User, "password">;
  followingCount: number;
  followersCount: number;
};

export type FollowRequestType = "received" | "sent";
