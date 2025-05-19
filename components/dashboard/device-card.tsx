import React from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarClock, ChevronRight, RadioReceiver, SlidersHorizontal, Vibrate} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Device} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";
import {Badge} from "@/components/ui/badge";
import {djangoInstance} from "@/config/axios-config";
import {useQuery} from "@tanstack/react-query";
import {isDeviceAliveQueryKey} from "@/api/device-sessions";
import {RootState} from "@/store";
import {useSelector} from "react-redux";

interface DeviceCardProps {
    device: Device;
}

const DeviceCard = ({device}: DeviceCardProps) => {

    const router = useRouter()
    const {username} = useSelector((state: RootState) => state.auth)

    const getIsDeviceAlive = async (deviceId: string) => {
        const res = await djangoInstance.get(`/devices/${deviceId}/is-alive/`);
        return res.data.is_alive;
    }

    const {
        data: isAlive,
        isLoading: isLoadingIsAlive,
        isError: isErrorIsAlive,
        isSuccess: isSuccessIsAlive,
    } = useQuery<boolean>({
        queryKey: isDeviceAliveQueryKey(username, device.id),
        queryFn: () => getIsDeviceAlive(device.id),
        refetchInterval: 20 * 1000, // 40 seconds interval
    })

    if (isLoadingIsAlive) {
        return
    }
    if (isErrorIsAlive) {
        return
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle
                        className={"text-2xl truncate"}
                        title={device.name}
                    >
                        {device.name.length > 20 ? `${device.name.substring(0, 20)}...` : device.name}
                    </CardTitle>
                    <div
                        className={"flex items-center gap-4"}
                    >
                        {isSuccessIsAlive && isAlive ? (
                            <Badge
                                variant={"outline"}
                            >
                                {device.has_active_session && !device.is_idle ? (
                                    <div>
                                        <div className="flex items-center">
                                            <div
                                                className={"mr-2 h-2 w-2 animate-pulse rounded-full bg-teal-500"}
                                            />
                                            <div
                                                className={"font-semibold"}
                                            >
                                                In Use
                                            </div>
                                        </div>
                                    </div>
                                ) : device.has_active_session && device.is_idle ? (
                                    <div>
                                        <div className="flex items-center">
                                            <div
                                                className={"mr-2 h-2 w-2 animate-pulse rounded-full bg-yellow-500"}
                                            />
                                            <div
                                                className={"font-semibold"}
                                            >
                                                Idle
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center">
                                            <div
                                                className={"mr-2 h-2 w-2 rounded-full bg-destructive"}
                                            />
                                            <div
                                                className={"font-semibold"}
                                            >
                                                Standby
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Badge>
                        ) : (
                            <Badge
                                variant={"destructive"}
                            >
                                Offline
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-8 text-sm">
                    <div className="flex items-center">
                        <div className={"grid items-center justify-between w-full"}>
                            <div className="flex items-center">
                                <RadioReceiver
                                    className={"mr-2 h-4 w-4"}
                                />
                                <div
                                    className={"font-semibold"}
                                >
                                    Device ID
                                </div>
                            </div>
                            <div>
                                {device.id}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className={"items-center justify-between w-full"}>

                            <div className="flex items-center">
                                <CalendarClock
                                    className={"mr-2 h-4 w-4"}
                                />
                                <div
                                    className={"font-semibold"}
                                >
                                    Registration Date
                                </div>
                            </div>

                            <div>
                                {dateParser(device.registration_date)}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <div className={"items-center justify-between w-full"}>

                            <div className="flex items-center">
                                <SlidersHorizontal
                                    className={"mr-2 h-4 w-4"}
                                />
                                <div
                                    className={"font-semibold"}
                                >
                                    Sensitivity
                                </div>
                            </div>

                            <div>
                                {device.sensitivity}%
                            </div>
                        </div>
                        <div className={"items-center justify-between w-full"}>

                            <div className="flex items-center">
                                <Vibrate
                                    className={"mr-2 h-4 w-4"}
                                />
                                <div
                                    className={"font-semibold"}
                                >
                                    Vibration Intensity
                                </div>
                            </div>

                            <div>
                                {device.vibration_intensity}%
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant={"outline"}
                    className="w-full justify-between cursor-pointer"
                    onClick={() => router.push(`/dashboard/devices/${device.id}`)}
                >
                    View Details
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DeviceCard;