'use client'

import React, {createContext, useContext, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {djangoInstance} from "@/config/axios-config";
import {useMutation} from "@tanstack/react-query";
import {login as reduxLogin, logout as reduxLogout} from "@/features/authSlice";
import {useDispatch} from "react-redux";
import {toast} from "sonner";

// Define types for user data and the mutation variables
interface User {
    username: string;
    is_staff: boolean;
    is_moderator: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname()
    const dispatch = useDispatch();
    const [initialLoading, setInitialLoading] = useState(true);

    // Function to fetch user data
    const fetchUser = async () => {
        try {
            const res = await djangoInstance.get("/auth/users/me/");
            if (res.status === 200) {
                setUser(res.data);
                dispatch(reduxLogin({
                    username: res.data.username,
                    email: res.data.email,
                    is_staff: res.data.is_staff,
                }));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            setUser(null);
            dispatch(reduxLogout());
        } finally {
            setInitialLoading(false);
        }
        setLoading(false);
    };

    // Define mutation function for login
    const loginMutation = useMutation({
        mutationFn: async ({username, password}: { username: string; password: string }) => {
            return await djangoInstance.post("/auth/jwt/create/", {username, password}, {withCredentials: true});
        },
        onSuccess: async () => {
            await fetchUser();
            router.replace("/dashboard");
        },
        onError: () => {
            setUser(null);
            toast.error("Invalid username or password");
        }
    });

    // Login function
    const login = (username: string, password: string) => {
        loginMutation.mutate({username, password});
    };

    // Logout function
    const logout = async () => {
        await djangoInstance.post("/auth/logout/", {}, {withCredentials: true});
        setUser(null);
        dispatch(reduxLogout());
        router.push("/");
    };

    // Auto-fetch user on first load
    useEffect(() => {
        fetchUser();
    }, []);

    // Auto-refresh token every 14 minutes
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await djangoInstance.post("/auth/jwt/refresh/", {}, {withCredentials: true});
                await fetchUser();
            } catch {
                setUser(null);
            }
        }, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Redirect user to /dashboard if they are already authenticated and try to access the login page
    useEffect(() => {
        if (user && pathname === "/") {
            router.replace("/dashboard");
        }
    }, [user, router]);

    return (
        <AuthContext.Provider value={{user, loading: initialLoading || loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing authentication data
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
