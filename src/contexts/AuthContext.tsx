
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUsername: (username: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // In a real app, you would call an API here
    // For this demo, we'll just simulate a successful login
    try {
      // Find user in localStorage (simulating a database)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        return false;
      }
      
      // Don't store password in state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    } catch (error) {
      console.error("Ошибка входа", error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // In a real app, you would call an API here
      // For this demo, we'll just store the user in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user with this email already exists
      if (users.some((user: any) => user.email === email)) {
        return false;
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // In a real app, this would be hashed
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Don't store password in state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      return true;
    } catch (error) {
      console.error("Ошибка регистрации", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUsername = (username: string) => {
    if (user) {
      const updatedUser = { ...user, username };
      setUser(updatedUser);
      
      // Update in users array too
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, username } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
