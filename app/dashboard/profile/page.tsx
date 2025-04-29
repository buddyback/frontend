'use client'
import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {getUserProfileQueryKey, getUserProfileData} from "@/api/profile";
import {useQuery} from "@tanstack/react-query";
import {ChevronLeft, Loader2Icon} from "lucide-react";
import {User} from "@/interfaces";
import ChangeProfileDataForm from "@/components/dashboard/profile/change-profile-data-form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import ChangePasswordForm from "@/components/dashboard/profile/change-password-form";


const ProfilePage = () => {

    const {username} = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const {
        data: user,
        isLoading: isLoadingUser,
        isError: isErrorUser,
        isSuccess: isSuccessUser,
    } = useQuery<User>({
        queryKey: getUserProfileQueryKey(username),
        queryFn: getUserProfileData
    })

    if (isLoadingUser) {
        return (
            <div className={"items-center justify-center flex flex-col gap-4"}>
                <Loader2Icon
                    className={"animate-spin text-muted-foreground text-center"}
                    size={40}
                />
            </div>
        );
    }

    if (isErrorUser) {
        return (
            <div className="flex items-center justify-center">
                <p className="text-sm text-red-500">Error loading user profile</p>
            </div>
        );
    }

    if (isSuccessUser && !user) {
        return (
            <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No user profile found</p>
            </div>
        );
    }

    return (
        <div className="grid gap-10">
            <div className={"flex items-center gap-2"}>
                <div
                    onClick={() => router.back()}
                >
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
            </div>
            {isSuccessUser ? (
                <ChangeProfileDataForm
                    user={user}
                />
            ) : null}

            <ChangePasswordForm />

        </div>
    );
};

export default ProfilePage;