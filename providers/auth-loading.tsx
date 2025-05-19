'use client';

import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export const AuthLoading = ({ children }: { children: React.ReactNode }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
};
