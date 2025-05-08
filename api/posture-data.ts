import { djangoInstance } from "@/config/axios-config";

export const getDailyPostureDataQuery = (username: string, deviceId: string, interval: string) => [
    username,
    "devices",
    deviceId,
    "posture-data",
    "daily-chart",
    "interval",
    interval
];

export const getWeeklyPostureDataQuery = (username: string, deviceId: string) => [
    username,
    "devices",
    deviceId,
    "posture-data",
    "weekly-chart",
];

export const getMonthlyPostureDataQuery = (username: string, deviceId: string) => [
    username,
    "devices",
    deviceId,
    "posture-data",
    "monthly-chart",
];

export const getDailyPostureData = async (deviceId: string, dateParams: any = {}) => {
    const queryParams = new URLSearchParams();

    if (dateParams.date) {
        queryParams.append("date", dateParams.date);
    }

    if (dateParams.interval) {
        queryParams.append("interval", dateParams.interval);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await djangoInstance.get(
        `/devices/${deviceId}/posture-data/daily-chart/${queryString}`
    );

    return response.data;
};

export const getWeeklyPostureData = async (deviceId: string, dateParams: any = {}) => {
    const queryParams = new URLSearchParams();

    if (dateParams.start_date) {
        queryParams.append("start_date", dateParams.start_date);
    }
    if (dateParams.end_date) {
        queryParams.append("end_date", dateParams.end_date);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await djangoInstance.get(
        `/devices/${deviceId}/posture-data/weekly-chart/${queryString}`
    );

    return response.data;
};

export const getMonthlyPostureData = async (deviceId: string, dateParams: any = {}) => {
    const queryParams = new URLSearchParams();

    if (dateParams.start_date) {
        queryParams.append("start_date", dateParams.start_date);
    }
    if (dateParams.end_date) {
        queryParams.append("end_date", dateParams.end_date);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await djangoInstance.get(
        `/devices/${deviceId}/posture-data/monthly-chart/${queryString}`
    );

    return response.data;
};
