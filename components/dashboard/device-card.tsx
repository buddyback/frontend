import React from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarClock, ChevronRight, RadioReceiver, SlidersHorizontal, Vibrate} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Device} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";
import {Badge} from "@/components/ui/badge";

interface DeviceCardProps {
    device: Device;
}

const DeviceCard = ({device}: DeviceCardProps) => {

    const router = useRouter()

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle
                        className={"text-2xl"}
                    >
                        {device.name}
                    </CardTitle>
                    <Badge
                        variant={"outline"}
                    >
                        {device.has_active_session ? (
                            <div>
                                <div className="flex items-center">
                                    <div
                                        className={"mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500"}
                                    />
                                    <div
                                        className={"font-semibold"}
                                    >
                                        Active Session
                                    </div>
                                </div>
                            </div>
                        ) : "Disabled"}
                    </Badge>
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