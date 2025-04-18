import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import styles from "../styles/login.module.css";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

// Create an auth context to manage authentication state
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  checkAuth: () => false,
});


export const useAuth = () => useContext(AuthContext);

// Типы для ответов API
interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface RegisterResponse {
  message: string;
}

export interface ErrorResponse {
  code: string;
  details: string;
  message: string;
}

// Protected route component
export function ProtectedRoute() {
  const { checkAuth } = useAuth();
  const isAuthenticated = checkAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Function to validate token
  const validateToken = (token: string): boolean => {
    if (!token) return false;
    
    try {
      // Simple validation - token should exist and have reasonable length
      return token.length > 20;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };
  
  const checkAuth = (): boolean => {
    const token = Cookies.get("access_token");
    return validateToken(token || "");
  };
  
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      Cookies.set("access_token", response.data.access_token);
      Cookies.set("refresh_token", response.data.refresh_token);
      setIsAuthenticated(true);
      return Promise.resolve();
    } catch (error) {
      // Clear any existing tokens on login failure
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setIsAuthenticated(false);
      return Promise.reject(error);
    }
  };
  
  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
  };
  
  // Check token on mount and set authentication state
  useEffect(() => {
    const isValid = checkAuth();
    setIsAuthenticated(isValid);
    
    if (!isValid) {
      // Clear invalid tokens
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function Auth() {
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login, checkAuth } = useAuth();
    
    // Only redirect if actually authenticated with a valid token
    useEffect(() => {
        // We'll check if there's a valid token and redirect only in that case
        const isValid = checkAuth();
        if (isValid) {
            navigate("/dashboard");
        }
    }, [checkAuth, navigate]);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await login(email, password);
            setSuccess(true);
            
            // После успешного входа перенаправляем на /dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Error:", error);
            
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data as ErrorResponse;
                
                switch (statusCode) {
                    case 400:
                        setError(`Ошибка валидации: ${errorData.message}`);
                        break;
                    case 401:
                        setError("Неверный email или пароль");
                        break;
                    case 500:
                        setError(`Ошибка сервера: ${errorData.message}`);
                        break;
                    default:
                        setError(`Произошла ошибка: ${errorData.message}`);
                }
            } else {
                setError("Не удалось подключиться к серверу. Проверьте подключение к интернету.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (name: string, surname: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await axios.post<RegisterResponse>(
                `${API_URL}/auth/register`, 
                { name, surname, email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            
            console.log("Registration Success:", response.data);
            setSuccess(true);
            
            // После регистрации переключаем на форму входа
            setIsLoginMode(true);
        } catch (error) {
            console.error("Registration Error:", error);
            
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data as ErrorResponse;
                
                switch (statusCode) {
                    case 400:
                        if (errorData.code === "EMAIL_EXISTS") {
                            setError("Пользователь с таким email уже существует");
                        } else {
                            setError(`Ошибка валидации: ${errorData.message}`);
                        }
                        break;
                    case 500:
                        if (errorData.code === "PASSWORD_HASH_ERROR") {
                            setError("Ошибка при обработке пароля");
                        } else if (errorData.code === "DB_ERROR") {
                            setError("Ошибка базы данных");
                        } else {
                            setError(`Ошибка сервера: ${errorData.message}`);
                        }
                        break;
                    default:
                        setError(`Произошла ошибка: ${errorData.message}`);
                }
            } else {
                setError("Не удалось подключиться к серверу. Проверьте подключение к интернету.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(null);
        setSuccess(false);
    };

    return (
        <div className={styles.login}>
            {isLoginMode ? (
                <Login 
                    onSubmit={handleLogin} 
                    isLoading={isLoading} 
                />
            ) : (
                <Register 
                    onSubmit={handleRegister} 
                    isLoading={isLoading} 
                />
            )}
            
            <span>
                <button
                    onClick={toggleMode}
                    className={styles.toggleButton}
                >
                    {isLoginMode ? "Switch to Register" : "Switch to Login"}
                </button>
            </span>
            
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>
                {isLoginMode ? "Login successful!" : "Registration successful!"}
            </div>}
        </div>
    );
}
