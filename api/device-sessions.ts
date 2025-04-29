import {djangoInstance} from "@/config/axios-config";

export const getDeviceSessionStatusQueryKey = (username: string, deviceId: string) => [username, "devices", deviceId, "session", "status"];

export const isDeviceAliveQueryKey = (username: string, deviceId: string) => [username, "devices", deviceId, "is-alive"];

export const getDeviceSessionStatus = async (deviceId: string) => {
    const res = await djangoInstance.get(`/devices/${deviceId}/status/`);
    return res.data;
}

export const startDeviceSession = async (deviceId: string) => {
    const res = await djangoInstance.put(`/devices/${deviceId}/start/`);
    return res.data;
}

export const stopDeviceSession = async (deviceId: string) => {
    const res = await djangoInstance.put(`/devices/${deviceId}/stop/`);
    return res.data;
}