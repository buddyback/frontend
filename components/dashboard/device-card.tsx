import React from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Device} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";

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
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div className="col-span-2 flex items-center">
                        <div className={"grid items-center justify-between w-full"}>
                            <div
                                className={"font-semibold"}
                            >
                                Device ID
                            </div>
                            <div>
                                {device.id}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <div className={"items-center justify-between w-full"}>
                            <div
                                className={"font-semibold"}
                            >
                                Registration Date:
                            </div>
                            <div>
                                {dateParser(device.registration_date)}
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