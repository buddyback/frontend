import {djangoInstance} from "@/config/axios-config";

export const getDeviceStatisticsQueryKey = (username: string, deviceId: string) => [username, "devices", deviceId, "statistics"];

export const getDeviceStatistics = async (deviceId: string) => {
    const response = await djangoInstance.get(`/devices/${deviceId}/statistics/`)
    return response.data;
}