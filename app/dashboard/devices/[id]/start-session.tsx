import React from 'react';
import {ChevronLeft, Loader2Icon} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Device, DeviceSession} from "@/interfaces";
import {
    getDeviceSessionStatus,
    getDeviceSessionStatusQueryKey,
    startDeviceSession,
    stopDeviceSession
} from "@/api/device-sessions";
import {getDeviceStatisticsQueryKey} from "@/api/statistics";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";


interface StartSessionProps {
    device: Device;
    isOnline: boolean;
}

const StartSession = ({device, isOnline}: StartSessionProps) => {

    const {username} = useSelector((state: RootState) => state.auth);
    const queryClient = useQueryClient();

    const {
        data: deviceSession,
        isLoading: isLoadingDeviceSession,
        isError: isErrorDeviceSession,
        isSuccess: isSuccessDeviceSession,
    } = useQuery<DeviceSession>({
        queryKey: getDeviceSessionStatusQueryKey(username, device.id),
        queryFn: () => getDeviceSessionStatus(device.id),
        refetchInterval: 1800000,
    })

    const handleSessionMutation = useMutation({
        mutationFn: (session_active: boolean) => {
            if (session_active)
                return stopDeviceSession(device.id);
            else
                return startDeviceSession(device.id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getDeviceSessionStatusQueryKey(username, device.id),
            })
            await queryClient.invalidateQueries({
                queryKey: getDeviceStatisticsQueryKey(username, device.id),
            })
        },
        onError: (error) => {
            console.error("Error updating device session:", error);
        },
    })

    return (
        <div
            className={"flex items-center justify-between w-full"}
        >
            <div className="flex items-center justify-center gap-4">
                <div
                    className="flex items-center gap-2"
                >
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold">{device.name}</h2>
                </div>

                <div>
                    {isSuccessDeviceSession ? (
                        <Badge
                            variant={isOnline ? "outline" : "destructive"}
                        >
                            {
                                !isOnline ? (
                                    <div>
                                        Offline
                                    </div>
                                ) : deviceSession.has_active_session && !deviceSession.is_idle? (
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
                            ) : deviceSession.has_active_session && deviceSession.is_idle ? (
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
                    ) : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isLoadingDeviceSession ? (
                    <div>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>
                    </div>
                ) : null}
                {isErrorDeviceSession ? (
                    <div>
                        <p className="text-red-500">Error fetching device session status.</p>
                    </div>
                ) : null}

                {isSuccessDeviceSession ? (
                    <div className="grid gap-4">
                        <HoverCard>
                            <HoverCardTrigger
                                className={"w-full cursor-pointer"}
                            >
                                <Button
                                    disabled={handleSessionMutation.isPending || !isOnline}
                                    onClick={() => handleSessionMutation.mutate(deviceSession.has_active_session)}
                                    variant={deviceSession.has_active_session ? "destructive" : "accent"}
                                    className={"w-full"}
                                >
                                    {deviceSession.has_active_session ? (
                                        <div className={"flex items-center"}>
                                            Stop Session
                                        </div>
                                    ) : `Start Session`}
                                </Button>
                            </HoverCardTrigger>
                            {!isOnline ? (
                                <HoverCardContent>
                                    Device is offline. Please check your internet connection.
                                </HoverCardContent>
                            ) : null}
                        </HoverCard>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default StartSession;