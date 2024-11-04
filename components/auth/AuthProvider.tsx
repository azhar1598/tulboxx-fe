import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectIsAuthenticated } from "@/redux/slices/authSlice";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated ? children : null}</>;
};

export default AuthProvider;
