import {djangoInstance} from "@/config/axios-config";

export const getRanksQueryKey = () => ["ranks"];

export const getRanks = async () => {
    const res = await djangoInstance.get("/ranks");
    return res.data;
}