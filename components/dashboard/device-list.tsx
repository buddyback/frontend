"use client"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {AddDeviceForm} from "@/components/forms/add-device-form";
import DeviceCard from "@/components/dashboard/device-card";
import {useQuery} from "@tanstack/react-query";
import {getDevices, getDevicesQueryKey} from "@/api/devices";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Device} from "@/interfaces";
import {Loader2Icon} from "lucide-react";

export function DeviceList() {
    const [formOpen, setFormOpen] = useState(false)

    const {username} = useSelector((state: RootState) => state.auth)

    const {
        data: devices,
        isLoading: isLoadingDevices,
        isError: isErrorDevices,
        isSuccess: isSuccessDevices,
    } = useQuery<Device[]>({
        queryFn: getDevices,
        queryKey: getDevicesQueryKey(username),
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Connected Devices</h3>
                <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
                    Add Device
                </Button>
            </div>
            {
                isLoadingDevices ? (
                    <div className={"items-center justify-center flex flex-col gap-4"}>
                        <Loader2Icon
                            className={"animate-spin text-muted-foreground text-center"}
                            size={40}
                        />
                    </div>
                ) : isErrorDevices ? (
                    <div className="flex items-center justify-center">
                        <p className="text-sm text-red-500">Error loading devices</p>
                    </div>
                ) : isSuccessDevices && devices.length === 0 ? (
                    <div className="flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No devices found</p>
                    </div>
                ) : isSuccessDevices ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {devices.map((device) => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                            />
                        ))}
                    </div>
                ) : null
            }

            <AddDeviceForm open={formOpen} action={setFormOpen}/>
        </div>
    )
}
