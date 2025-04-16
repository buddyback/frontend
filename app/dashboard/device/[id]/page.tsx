import {Button} from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import {ChevronLeft} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DeviceStats} from '@/components/devices/device-stats';
import {DeviceDetail} from '@/components/devices/device-detail';
import { PostureChart } from '@/components/charts/posture-chart';

interface DevicePageParams {
    params: {
        id: string
    }
}


const DevicePage = ({params}: DevicePageParams) => {

    const id = params.id

    const deviceName = id === "raspberry-pi-1" ? "Living Room" : id === "raspberry-pi-2" ? "Office" : "Bedroom"

    return (
        <div className="flex min-h-screen flex-col">
            <div className="container grid gap-10">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">{deviceName}</h2>
                </div>

                <DeviceStats/>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList
                        className={"w-full"}
                    >
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <DeviceDetail id={id}/>
                    </TabsContent>
                    <TabsContent value="statistics" className="space-y-4">
                        <PostureChart/>
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