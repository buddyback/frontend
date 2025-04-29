import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const djangoInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

