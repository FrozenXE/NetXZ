import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

interface IContextType {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<IContextType>({
  user: INITIAL_USER,
  isLoading: false,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        localStorage.removeItem("cookieFallback");
        return false;
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        await checkAuthUser();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isAuthenticated) {
      initializeAuth();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const secret = queryParams.get("secret");
    const expire = queryParams.get("expire");

    const redirectToSignIn = () => {
      navigate("/sign-in");
    };

    const handleAuthentication = async () => {
      if (
        location.pathname === "/create-password" &&
        userId &&
        secret &&
        expire
      ) {
        if (!isAuthenticated) {
          await checkAuthUser();
        }
      } else {
        if (!isAuthenticated && isInitialized) {
          redirectToSignIn();
        }
      }
    };

    handleAuthentication();
  }, [location.search, isAuthenticated, isInitialized]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = (): IContextType => useContext(AuthContext);
