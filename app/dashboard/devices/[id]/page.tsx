'use client'
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import {ChevronLeft} from "lucide-react";
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

const DevicePage = () => {

    const params = useParams<{ id: string }>()
    const {id} = params

    const {username} = useSelector((state: RootState) => state.auth)

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
            <div className="container grid gap-10">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                    </Link>
                    {isSuccessDevice ? (
                        <h2 className="text-3xl font-bold tracking-tight">{device.name}</h2>
                    ) : null}
                </div>

                {isSuccessDevice ? (
                    <DeviceStats
                        device={device}
                    />
                ): null}


                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList
                        className={"w-full"}
                    >
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        {isSuccessDevice ? (
                            <DeviceDetail
                                device={device}
                            />
                        ) : null}
                    </TabsContent>
                    <TabsContent value="statistics" className="space-y-4">
                        <PostureChart
                            deviceId={id}
                        />
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-4">
                        {/*<DeviceSettings id={id}/>*/}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DevicePage;