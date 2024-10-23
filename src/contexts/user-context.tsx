"use client";
import LoadingAnimation from "@/app/app/_components/loading-page";
import { fetchApi } from "@/services/fetchApi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextParams {
  user: User | null;
  loadingUser: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DELIVERYMAN";
  loggedWithGoogle: boolean;
  avatarUrl: string;
  acceptNotifications: boolean;
  accountAmount: number;
}

const UserContext = createContext({} as UserContextParams);

interface UserProviderProps {
  children: ReactNode;
}
export function UserProvider({ children }: UserProviderProps) {
  const { data, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  async function getUser() {
    const userEmail = data?.user.email ?? "user-not-found";

    const response = await fetchApi(`/users/by-email/`, {
      method: 'POST',
      body: JSON.stringify({
        email: userEmail,
      }),
    });

    if (!response.ok) {
      loadOut();
      setLoadingUser(false);
      return;
    }

    const dataResponse = await response.json();

    setLoadingUser(false);

    setUser(dataResponse);
  }

  async function loadOut() {
    await signOut({
      redirect: false,
    });

    window.location.href = "/";
  }

  useEffect(() => {
    if (status === "authenticated" && data.user) {
      getUser();
    }
  }, [status]);

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
