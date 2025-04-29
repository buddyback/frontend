import axios from "axios";

// Use NEXT_PUBLIC_ prefix to make it available to the browser
// export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const baseURL = "https://api.buddyback.srv.mrlc.cc";

export const djangoInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});