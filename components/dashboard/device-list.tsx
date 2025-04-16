"use client"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {AddDeviceForm} from "@/components/forms/add-device-form";
import DeviceCard from "@/components/dashboard/device-card";

const devices: Device[] = [
    {
        id: "raspberry-pi-1",
        name: "Living Room",
        status: "online",
        battery: 85,
        lastSync: "2 minutes ago",
        signal: "strong",
    },
    {
        id: "raspberry-pi-2",
        name: "Office",
        status: "online",
        battery: 72,
        lastSync: "5 minutes ago",
        signal: "medium",
    },
    {
        id: "raspberry-pi-3",
        name: "Bedroom",
        status: "offline",
        battery: 15,
        lastSync: "3 hours ago",
        signal: "weak",
    },
]

export function DeviceList() {
    const [formOpen, setFormOpen] = useState(false)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Connected Devices</h3>
                <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
                    Add Device
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {devices.map((device) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                    />
                ))}
            </div>

            <AddDeviceForm open={formOpen} action={setFormOpen}/>
        </div>
    )
}
