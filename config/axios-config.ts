import axios from "axios";

// Use NEXT_PUBLIC_ prefix to make it available to the browser
export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.buddyback.srv.mrlc.cc";

export const djangoInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});