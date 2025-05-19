'use client'
import React, {useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DeviceStats} from '@/components/devices/device-stats';
import {DeviceDetail} from '@/components/devices/device-detail';
import {PostureChart} from '@/components/charts/posture-chart';

import {useParams} from 'next/navigation'
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useQuery} from "@tanstack/react-query";
import {Device} from "@/interfaces";
import {getDevice, getDeviceQueryKey} from "@/api/devices";
import StartSession from "@/app/dashboard/devices/[id]/start-session";

const DevicePage = () => {

    const params = useParams<{ id: string }>()
    const {id} = params

    const {username} = useSelector((state: RootState) => state.auth)
    const [isOnline, setIsOnline] = useState<boolean>(false)

    const {
        data: device,
        isLoading: isLoadingDevice,
        isError: isErrorDevice,
        isSuccess: isSuccessDevice,
    } = useQuery<Device>({
        queryKey: getDeviceQueryKey(username, id),
        queryFn: () => getDevice(id),
    })

    if (isLoadingDevice) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (isErrorDevice) {
        return <div className="flex items-center justify-center h-screen">Error loading device</div>
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="grid gap-10">
                <div
                    className={"flex items-center justify-between"}
                >
                    {isSuccessDevice ? (
                        <StartSession
                            device={device}
                            isOnline={isOnline}
                        />
                    ) : null}
                </div>

                {isSuccessDevice ? (
                    <DeviceStats
                        device={device}
                    />
                ) : null}


                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList
                        className={"w-full"}
                    >
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        {isSuccessDevice ? (
                            <DeviceDetail
                                device={device}
                                action={setIsOnline}
                            />
                        ) : null}
                    </TabsContent>
                    <TabsContent value="statistics" className="space-y-4">
                        {isSuccessDevice ? (
                            <PostureChart
                                deviceId={id}
                                deviceSensitivity={device.sensitivity}
                            />
                        ) : null}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DevicePage;