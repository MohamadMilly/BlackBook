export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
};

export type Post = {
  id: number;
  title: string | null;
  content: string | null;
  images: string[];
  user?: Omit<User, "password">;
  userId: number;
  createdAt: Date;
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
  extends Omit<Post, "id" | "user" | "createdAt" | "userId"> {}
