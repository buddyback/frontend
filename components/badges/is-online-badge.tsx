'use client';
import {useQuery} from "@tanstack/react-query";
import {isDeviceAliveQueryKey} from "@/api/device-sessions";

import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Badge} from "@/components/ui/badge";
import {djangoInstance} from "@/config/axios-config";

interface IsOnlineBadgeProps {
    deviceId: string;
    setIsOnline?: (isOnline: boolean) => void;
}

const IsOnlineBadge = ({deviceId, setIsOnline}: IsOnlineBadgeProps) => {
    const {username} = useSelector((state: RootState) => state.auth)

    const getIsDeviceAlive = async (deviceId: string) => {
        const res = await djangoInstance.get(`/devices/${deviceId}/is-alive/`);
        if (setIsOnline) {
            setIsOnline(res.data.is_alive);
        }
        return res.data.is_alive;
    }

    const {
        data: isAlive,
        isLoading: isLoadingIsAlive,
        isError: isErrorIsAlive,
        isSuccess: isSuccessIsAlive,
    } = useQuery({
        queryKey: isDeviceAliveQueryKey(username, deviceId),
        queryFn: () => getIsDeviceAlive(deviceId),
        refetchInterval: 20 * 1000, // 40 seconds interval
    })

    if (isLoadingIsAlive) {
        return
    }
    if (isErrorIsAlive) {
        return
    }

    if (isSuccessIsAlive && isAlive) {
        return (
            <Badge
                variant={"accent"}
            >
                Online
            </Badge>
        )
    }

    return (
        <Badge
            variant={"destructive"}
        >
            Offline
        </Badge>
    )

};

export default IsOnlineBadge;