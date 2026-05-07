import client from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: AuthUser;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: string }).message === "string" &&
    (error as { message: string }).message.trim()
  ) {
    return (error as { message: string }).message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  return fallback;
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await client.post<AuthResponse>("/auth/signup", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Signup request failed"));
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await client.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login request failed"));
  }
};
