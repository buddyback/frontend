import {djangoInstance} from "@/config/axios-config";

export const getPostureDataQuery = (username: string, deviceId: string) => [username, "devices", deviceId, "posture"];

// Update getPostureData to accept date parameters
export const getPostureData = async (deviceId: string, dateParams: any = {}) => {
    // Construct query parameters
    const queryParams = new URLSearchParams();

    if (dateParams.date) {
        queryParams.append('date', dateParams.date);
    }

    if (dateParams.start_date) {
        queryParams.append('start_date', dateParams.start_date);
    }

    if (dateParams.end_date) {
        queryParams.append('end_date', dateParams.end_date);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await djangoInstance.get(
        `/devices/${deviceId}/posture-data/${queryString}`,
    );

    return response.data;
};