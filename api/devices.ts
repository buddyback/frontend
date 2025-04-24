import {djangoInstance} from "@/config/axios-config";

export const getDevices = async () => {
    const res = await djangoInstance.get("/devices/");
    return res.data;
}

export const getDevicesQueryKey = (username: string) => [username, "devices"];