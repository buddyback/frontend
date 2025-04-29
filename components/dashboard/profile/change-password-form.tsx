'use client'
import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {djangoInstance} from "@/config/axios-config";
import {toast} from "sonner";

const ChangePasswordForm = () => {

    const emptyChangePasswordData = {
        current_password: "",
        new_password: "",
        re_new_password: ""
    }

    const [changePasswordData, setChangePasswordData] = React.useState(emptyChangePasswordData);

    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            const res = await djangoInstance.post(`/auth/users/set_password/`, changePasswordData)
            return res.data;
        },
        onSuccess: async () => {
            toast.success("Password updated successfully");
            setChangePasswordData(emptyChangePasswordData)
        },
        onError: async () => {
            toast.error("Error updating password");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changePasswordMutation.mutate();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your password to keep your account secure. The password must be at least 8 characters long
                    and contain at least one uppercase letter, one lowercase letter, one number, and one special
                    character.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Current Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your current password"
                            required
                            value={changePasswordData.current_password}
                            onChange={(e) => setChangePasswordData({
                                ...changePasswordData,
                                current_password: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">New Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your new password"
                            required
                            value={changePasswordData.new_password}
                            onChange={(e) => setChangePasswordData({
                                ...changePasswordData,
                                new_password: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Confirm New Password</Label>
                        <Input
                            type="password"
                            placeholder="Confirm your new password"
                            required
                            value={changePasswordData.re_new_password}
                            onChange={(e) => setChangePasswordData({
                                ...changePasswordData,
                                re_new_password: e.target.value
                            })}
                        />
                    </div>
                </CardContent>
                <CardFooter
                    className={"mt-10"}
                >
                    <Button
                        type="submit"
                        className="w-full"
                        variant={"accent"}
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? "Updating profile..." : "Update Profile"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default ChangePasswordForm;