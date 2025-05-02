import {djangoInstance} from "@/config/axios-config";

export const getUnclaimedDevicesQueryKey = () => ["unclaimed-devices"];

export const getRegisteredUsersQueryKey = () => ["registered-users"];

export const getUnclaimedDevices = async () => {
    const response = await djangoInstance.get("/devices/unclaimed/")
    return response.data;
}

export const getRegisteredUsers = async () => {
    const response = await djangoInstance.get("/auth/users/")
    return response.data;
}