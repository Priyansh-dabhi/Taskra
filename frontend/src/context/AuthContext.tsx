import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { login, signup } from "../api/auth";
import { TOKEN_KEY } from "../api/client";

interface AuthContextValue {
  token: string | null;
  isBootstrapping: boolean;
  isAuthenticating: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        setToken(storedToken);
      } finally {
        setIsBootstrapping(false);
      }
    };

    void loadToken();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isBootstrapping,
      isAuthenticating,
      loginUser: async (email: string, password: string) => {
        setIsAuthenticating(true);

        try {
          const response = await login(email, password);
          await AsyncStorage.setItem(TOKEN_KEY, response.token);
          setToken(response.token);
        } finally {
          setIsAuthenticating(false);
        }
      },
      signupUser: async (name: string, email: string, password: string) => {
        setIsAuthenticating(true);

        try {
          const response = await signup(name, email, password);
          await AsyncStorage.setItem(TOKEN_KEY, response.token);
          setToken(response.token);
        } finally {
          setIsAuthenticating(false);
        }
      },
      logoutUser: async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        queryClient.clear();
        setToken(null);
      },
    }),
    [isAuthenticating, isBootstrapping, queryClient, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
