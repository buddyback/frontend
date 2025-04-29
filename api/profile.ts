import {djangoInstance} from "@/config/axios-config";

export const getUserProfileQueryKey = (username: string) => [username, "profile"];

export const getUserProfileData = async () => {
    const res = await djangoInstance.get(`/auth/users/me/`);
    return res.data;
}