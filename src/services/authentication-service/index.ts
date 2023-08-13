import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import { AccessToken } from "@/protocols";
import axios from "axios";
import dotenv from "dotenv";
import qs from "query-string";
import userService from "../users-service";

dotenv.config();

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

async function signInWithGitHub(code: string): Promise<any> {
  const token = await exchangeCodeForAccessToken(code);
  const userGitHub = await fetchUserFromGitHub(token);
  const email = userGitHub.email;
  const password = String(userGitHub.id);
  const userWithSameEmail = await userRepository.findByEmail(userGitHub.email);

  if (userWithSameEmail) {
    const result = await signIn({ email, password });

    return result;
  }else {
    await userService.createUser({ email, password });
    const result = await signIn({ email, password });
 
    return result;
  }
}

async function exchangeCodeForAccessToken(code: string) {
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET, GITHUB_ACCESS_TOKEN_URL } = process.env;

  const params: AccessToken = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }
  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const { access_token } = qs.parse(data);

  return Array.isArray(access_token) ? access_token.join("") : access_token;
}

async function fetchUserFromGitHub(token: string) {
  const { GITHUB_USER_URL } = process.env;
  const response = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

const authenticationService = {
  signIn,
  signInWithGitHub
};

export default authenticationService;
export * from "./errors";
