// Import necessary modules
import { useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { getCurrentUser } from '@/lib/appwrite/api';
import { useNavigate, useLocation } from 'react-router-dom';

// Define IUser interface
interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
}

// Define initial user state
export const INITIAL_USER: IUser = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
};

// Define context
const AuthContext = createContext<{
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}>({
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
});

// Define provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkAuthUser = async () => {
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
        localStorage.removeItem('cookieFallback');
        // Redirect only if not already on the reset password page and not authenticated
        if (location.pathname !== '/reset-password' && !isAuthenticated) {
          navigate('/sign-in');
        }
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (cookieFallback === '[]' || cookieFallback === null || cookieFallback === undefined) {
      navigate('/sign-in');
    }
    checkAuthUser();
  }, [navigate, location.pathname, isAuthenticated]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to consume AuthContext
export const useUserContext = () => useContext(AuthContext);
