import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Battery, ChevronRight, Signal, Wifi} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface DeviceCardProps {
    device: Device;
}

const DeviceCard = ({device}: DeviceCardProps) => {

    const router = useRouter()

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle>{device.name}</CardTitle>
                    <Badge
                        variant={device.status === "online" ? "default" : "secondary"}>{device.status}</Badge>
                </div>
                <CardDescription>Raspberry Pi Device</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                        <Battery className="mr-1 h-4 w-4 text-muted-foreground"/>
                        <span>{device.battery}%</span>
                    </div>
                    <div className="flex items-center">
                        <Signal className="mr-1 h-4 w-4 text-muted-foreground"/>
                        <span>{device.signal}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <Wifi className="mr-1 h-4 w-4 text-muted-foreground"/>
                        <span>Last sync: {device.lastSync}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant={"outline"}
                    className="w-full justify-between cursor-pointer"
                    onClick={() => router.push(`/dashboard/device/${device.id}`)}
                >
                    View Details
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DeviceCard;