import {djangoInstance} from "@/config/axios-config";

export const getDevicesQueryKey = (username: string) => [username, "devices"];

export const getDeviceQueryKey = (username: string, deviceId: string) => [username, "devices", deviceId];


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

export const unclaimDevice = async (deviceId: string) => {
    const res = await djangoInstance.post(`/devices/${deviceId}/release/`);
    return res.data;
}

export const getDevice = async (deviceId: string) => {
    const res = await djangoInstance.get(`/devices/${deviceId}/`);
    return res.data;
}

export const updateDevice = async (deviceId: string, deviceName: string, deviceSensitivity: number, deviceVibrationIntensity: number, deviceAudioIntensity: number) => {
    const res = await djangoInstance.patch(`/devices/${deviceId}/`, {
        name: deviceName,
        sensitivity: deviceSensitivity,
        vibration_intensity: deviceVibrationIntensity,
        audio_intensity: deviceAudioIntensity,
    });
    return res.data;
}


