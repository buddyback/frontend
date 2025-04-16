"use client"

import type React from "react"
import {useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface AddDeviceFormProps {
    open: boolean
    action: (open: boolean) => void
}

export function AddDeviceForm({open, action}: AddDeviceFormProps) {
    const [deviceName, setDeviceName] = useState("")
    const [deviceType, setDeviceType] = useState("")
    const [deviceLocation, setDeviceLocation] = useState("")
    const [deviceId, setDeviceId] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Simulate API call
        setTimeout(() => {
            // Reset form
            setDeviceName("")
            setDeviceType("")
            setDeviceLocation("")
            setDeviceId("")
            action(false)
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={action}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Device</DialogTitle>
                        <DialogDescription>
                            Connect a new Raspberry Pi device to monitor your posture.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="device-name">Device Name</Label>
                                <Input
                                    id="device-name"
                                    placeholder="Living Room, Office, etc."
                                    value={deviceName}
                                    onChange={(e) => setDeviceName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="device-type">Device Type</Label>
                                <Select
                                    value={deviceType}
                                    onValueChange={setDeviceType}
                                    required
                                >
                                    <SelectTrigger id="device-type" className={"w-full"}>
                                        <SelectValue placeholder="Select device type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="raspberry-pi-4">Raspberry Pi 4</SelectItem>
                                        <SelectItem value="raspberry-pi-3">Raspberry Pi 3</SelectItem>
                                        <SelectItem value="raspberry-pi-zero">Raspberry Pi Zero</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="device-location">Location</Label>
                                <Select value={deviceLocation} onValueChange={setDeviceLocation} required>
                                    <SelectTrigger id="device-location" className={"w-full"}>
                                        <SelectValue placeholder="Select location"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home</SelectItem>
                                        <SelectItem value="office">Office</SelectItem>
                                        <SelectItem value="school">School</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="device-id">Device ID</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="device-id"
                                        placeholder="Enter device ID"
                                        value={deviceId}
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    You can find the device ID on the bottom of your Raspberry Pi.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
