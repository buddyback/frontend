'use client'
import React from 'react';
import {User} from "@/interfaces";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {djangoInstance} from "@/config/axios-config";
import {toast} from "sonner";
import {getUserProfileQueryKey} from "@/api/profile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {updateUser} from "@/features/authSlice";

interface ChangeProfileDataFormProps {
    user: User
}

const ChangeProfileDataForm = ({user}: ChangeProfileDataFormProps) => {

    const [newEmail, setNewEmail] = React.useState(user.email);
    const queryClient = useQueryClient();
    const {username} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const changeProfileDataMutation = useMutation({
        mutationFn: async () => {
            const res = await djangoInstance.put(`/auth/users/me/`, {
                email: newEmail
            })
            return res.data;
        },
        onSuccess: async () => {
            dispatch(updateUser({
                email: newEmail,
            }))
            toast.success("User profile updated successfully.");
            await queryClient.invalidateQueries({
                queryKey: getUserProfileQueryKey(username),
            })
        },
        onError: async (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred while updating the user profile.");
            }
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        changeProfileDataMutation.mutate();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Change Profile Data
                </CardTitle>
                <CardDescription>
                    Fill in the form below to change your profile data.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
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
                        disabled={changeProfileDataMutation.isPending}
                    >
                        {changeProfileDataMutation.isPending ? "Updating profile..." : "Update Profile"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default ChangeProfileDataForm;