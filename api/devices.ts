import {djangoInstance} from "@/config/axios-config";

export const getDevicesQueryKey = (username: string) => [username, "devices"];

export const getDevices = async () => {
    const res = await djangoInstance.get("/devices/");
    return res.data;
}

export const claimDevice = async (deviceId: string, deviceName: string) => {
    const res = await djangoInstance.post(`/devices/${deviceId}/claim/`, {
        name: deviceName,
    });
    return res.data;
}
